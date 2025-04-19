require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Allow cross-origin requests
const bcrypt = require('bcrypt'); // Password hashing
const connectDB = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken'); // JWT for authentication
const User = require('./login-register/src/models/User');
const inventoryRoutes = require('./routes/inventoryRoutes');


const app = express();

// ✅ Load SendGrid API Key
if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_API_KEY.startsWith("SG.")) {
    console.error("Error: SendGrid API key is missing or incorrect.");
    process.exit(1);
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// In-memory users array (for testing purposes, use MongoDB in production)
//const users = [];

// Get all users (for testing only)
app.get('/users', (req, res) => {
    res.json(users);
});

// Register a new user
app.post('/users', async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            email,
            password  // Mongoose pre-save hook will handle hashing
        });

        // Save user to database
        await newUser.save();

        authRoutes.registerUser(req, res);

        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User login
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email in the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Cannot find user' });
        }

        // Compare the provided password with the stored password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Generate a token for authentication
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({
                message: 'Login successful',
                token: token
            });
        } else {
            res.status(403).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Auth Routes (for MongoDB-based authentication)
app.use('/api/auth', authRoutes);
// Inventory Routes
app.use('/api/inventory', inventoryRoutes);

// Start Server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));