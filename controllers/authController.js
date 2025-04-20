const User = require('../login-register/src/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const sendEmail = require('../login-register/src/utils/emailService'); 

require('dotenv').config();

// Register user
exports.registerUser = async (req, res) => {
    try {
        const { email, password, adminCode } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });


        const verificationCode = crypto.randomBytes(6).toString('hex');

        const isAdmin = adminCode === process.env.ADMIN_CODE; // Check if the admin code matches

        const newUser = new User({ email, password, verificationCode, isAdmin });
        await newUser.save();

        // Send verification email
        await sendEmail(email, verificationCode);
        console.log("EMAIL IS SENT SUCCESSFULLY");

        res.status(201).json({ message: 'User registered. Check your email for verification.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


//  Verify email
exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email, verificationCode: code });

        if (!user) return res.status(400).send('Invalid verification code.');

        user.isVerified = true;
        await user.save();

        res.send('Email verified successfully.');
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Whitelist a user as an admin
exports.whitelist = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findByIdAndDelete(id);
        // Find the user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the isAdmin field
        user.isAdmin = true;
        await user.save();

        res.status(200).json({ message: 'User successfully whitelisted as an admin.' });
    } catch (error) {
        console.error('Error whitelisting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User & Return JWT Token
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: "Login successful" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Display all users
exports.displayUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password -verificationCode  -__v'); // Hide sensitive data
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
         const { id } = req.body;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
