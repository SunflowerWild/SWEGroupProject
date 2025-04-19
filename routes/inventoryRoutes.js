const express = require('express');
const { addPart, getInventorySummary, deleteItem, addPC } = require('../controllers/inventoryController');
const User = require('../login-register/src/models/Part'); 
const { isAdmin } = require('../middleware/authMiddleware');
const inventoryController = require('../controllers/inventoryController');


const router = express.Router();
router.post('/add-part', addPart);
router.post('/add-pc', addPC);
router.get('/summary', getInventorySummary);
router.delete('/:id', deleteItem);



module.exports = router;
