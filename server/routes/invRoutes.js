// server/routes/invRoutes.js
const express = require('express');
const { getInventory, getLowStock, addStock, deleteStockItem } = require('../controllers/invCtrl');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @route   GET /api/inventory
 * @desc    Get all inventory items
 * @access  Private (DeptHead, ProcurementOfficer)
 */
router.get('/', protect, getInventory);

/**
 * @route   GET /api/inventory/low-stock
 * @desc    Get items that are below the low-stock threshold
 * @access  Private (ProcurementOfficer)
 */
router.get('/low-stock', protect, authorize('ProcurementOfficer'), getLowStock);

/**
 * @route   POST /api/inventory/add
 * @desc    Add a new item or update an existing item's quantity
 * @access  Private (ProcurementOfficer)
 */
router.post('/add', protect, authorize('ProcurementOfficer'), addStock);

/**
 * @route   DELETE /api/inventory/:id
 * @desc    Delete a stock item
 * @access  Private (ProcurementOfficer)
 */
router.delete('/:id', protect, authorize('ProcurementOfficer'), deleteStockItem);

module.exports = router;
