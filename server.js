require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Allow cross-origin requests
const bcrypt = require('bcrypt'); // Password hashing
const connectDB = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes');
const sgMail = require('@sendgrid/mail');

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
const users = [];

// Get all users (for testing only)
app.get('/users', (req, res) => {
    res.json(users);
});

// Register a new user
app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// User login
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);

    if (!user) {
        return res.status(400).send('Cannot find user');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Login successful');
        } else {
            res.status(403).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Auth Routes (for MongoDB-based authentication)
app.use('/api/auth', authRoutes);

// Start Server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
