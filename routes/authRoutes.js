const express = require('express');
const { registerUser, verifyEmail, whitelist, loginUser, displayUsers, deleteUser } = require('../controllers/authController');
const User = require('../login-register/src/models/User'); 

const router = express.Router();

// Routes for user authentication and management
router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/whitelist', whitelist);
router.post('/login', loginUser);
router.get('/users', displayUsers);
router.delete('/users', deleteUser);

module.exports = router;
