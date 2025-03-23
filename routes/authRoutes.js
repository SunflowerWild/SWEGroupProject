const express = require('express');
const { registerUser, verifyEmail } = require('../controllers/authController');
const User = require('../models/User'); 


const router = express.Router();
router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password -verificationCode'); // Hide sensitive data
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});




module.exports = router;
