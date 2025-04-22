const express = require('express');
const { addPart, addPC, deleteItem, getInventorySummary, checkoutItem, returnItem, getHistory } = require('../controllers/inventoryController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');


const router = express.Router();

// Routes for inventory management
router.post('/parts', isAuthenticated, isAdmin, addPart); // Only admins can add parts
router.post('/pcs', isAuthenticated, isAdmin, addPC); // Only admins can add PCs
router.delete('/items', isAuthenticated, isAdmin, deleteItem); // Only admins can delete items
router.get('/summary', isAuthenticated, getInventorySummary); // All authenticated users can view the summary
router.post('/checkout', isAuthenticated, checkoutItem);
router.post('/returnItem', isAuthenticated, isAdmin, returnItem);
router.get('/history', isAuthenticated, isAdmin, getHistory);


module.exports = router;