// /server/routes/RFQRoutes.js
const express = require('express');
const router = express.Router();
const {
  createRFQ,
  getVendorRFQs,
  submitQuote,
  getQuotesForRFQ,
} = require('../controllers/RFQCtrl');
const { protect, authorize } = require('../middlewares/authMiddleware'); // Assume you have these middlewares

// @route   POST /api/rfq
// @desc    Create a new RFQ (Procurement Officer)
router.post('/', protect, authorize('ProcurementOfficer'), createRFQ);

// @route   GET /api/rfq/my-rfqs
// @desc    Get RFQs for a specific vendor (Vendor)
router.get('/my-rfqs', protect, authorize('Vendor'), getVendorRFQs);

// @route   POST /api/rfq/:rfqId/quote
// @desc    Submit a quote for an RFQ (Vendor)
router.post('/:rfqId/quote', protect, authorize('Vendor'), submitQuote);

// @route   GET /api/rfq/:rfqId/quotes
// @desc    Get all quotes for a specific RFQ (Procurement Officer)
router.get('/:rfqId/quotes', protect, authorize('ProcurementOfficer'), getQuotesForRFQ);

module.exports = router;