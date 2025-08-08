// /server/routes/rfqRoutes.js
const express = require('express');
const router = express.Router();
const {
  createRFQ,
  getVendorRFQs,
  submitQuote,
  getQuotesForRFQ,
} = require('../controllers/RFQCtrl');
const { protect, procurement, vendor } = require('../middlewares/authMiddleware'); // Assume you have these middlewares

// @route   POST /api/rfq
// @desc    Create a new RFQ (Procurement Officer)
router.post('/', protect, procurement, createRFQ);

// @route   GET /api/rfq/my-rfqs
// @desc    Get RFQs for a specific vendor (Vendor)
router.get('/my-rfqs', protect, vendor, getVendorRFQs);

// @route   POST /api/rfq/:rfqId/quote
// @desc    Submit a quote for an RFQ (Vendor)
router.post('/:rfqId/quote', protect, vendor, submitQuote);

// @route   GET /api/rfq/:rfqId/quotes
// @desc    Get all quotes for a specific RFQ (Procurement Officer)
router.get('/:rfqId/quotes', protect, procurement, getQuotesForRFQ);

module.exports = router;