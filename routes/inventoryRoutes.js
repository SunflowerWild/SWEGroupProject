const express = require('express');
const { addPart, addPC, deleteItem, getInventorySummary } = require('../controllers/inventoryController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for inventory management
router.post('/parts', isAuthenticated, isAdmin, addPart); // Only admins can add parts
router.post('/pcs', isAuthenticated, isAdmin, addPC); // Only admins can add PCs
router.delete('/items/:id', isAuthenticated, isAdmin, deleteItem); // Only admins can delete items
router.get('/summary', isAuthenticated, getInventorySummary); // All authenticated users can view the summary

module.exports = router;