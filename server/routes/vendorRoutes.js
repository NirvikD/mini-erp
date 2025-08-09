// server/routes/vendorRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { submitVendorRating, getVendorHistory } = require('../controllers/vendorCtrl');

// @desc    Submit a new rating for a vendor after a PO is completed
// @route   POST /api/vendor/rate
// @access  Procurement Only
router.post('/rate', protect, authorize('Procurement Officer'), submitVendorRating);

// @desc    Get a vendor's history and ratings
// @route   GET /api/vendor/history/:vendorId
// @access  All roles (Procurement, Dept Head, Vendor)
router.get('/history/:vendorId', protect, getVendorHistory);

module.exports = router;
