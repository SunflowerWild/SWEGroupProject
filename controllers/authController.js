const User = require('../login-register/src/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

require('dotenv').config();

// Register User & Send Verification Email
const sendEmail = require('../login-register/src/utils/emailService'); 

exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = crypto.randomBytes(6).toString('hex');

        const newUser = new User({ email, password: hashedPassword, verificationCode });
        await newUser.save();

        // Send verification email
        await sendEmail(email, verificationCode); // Ensure this is awaited
        console.log("EMAIL IS SENT SUCCESSFULLY");

        res.status(201).json({ message: 'User registered. Check your email for verification.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


//  Verify Email
exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.query;

        const user = await User.findOne({ email, verificationCode: code });
        if (!user) return res.status(400).send('Invalid verification code.');

        user.isVerified = true;
        await user.save();

        res.send('Email verified successfully.');
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User & Return JWT Token
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (!user.isVerified) return res.status(401).json({ message: 'Email not verified' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
