// server/routes/poRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { 
    createPurchaseOrder, 
    markGoodsReceived, 
    getPurchaseOrderById, 
    getPurchaseOrdersForVendor 
} = require('../controllers/poCtrl');

// @desc    Create a new Purchase Order from an awarded quote
// @route   POST /api/po
// @access  Procurement Only
router.post('/', protect, authorize('ProcurementOfficer'), createPurchaseOrder);

// @desc    Mark a Purchase Order as delivered (Goods Receipt)
// @route   PUT /api/po/:id/goods-received
// @access  Procurement Only
router.put('/:id/goods-received', protect, authorize('ProcurementOfficer'), markGoodsReceived);

// @desc    Get a single Purchase Order by ID
// @route   GET /api/po/:id
// @access  Procurement, Vendor
router.get('/:id', protect, getPurchaseOrderById);

// @desc    Get all Purchase Orders for a specific vendor
// @route   GET /api/po/vendor/:vendorId
// @access  Procurement, Vendor
router.get('/vendor/:vendorId', protect, getPurchaseOrdersForVendor);

module.exports = router;
