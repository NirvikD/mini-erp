// server/routes/quoteRoutes.js
const express = require('express');
const router = express.Router();
// Import the protect and authorize functions from your middleware
const { protect, authorize } = require('../middlewares/authMiddleware');
const { submitQuote, getQuotesForRfq, getQuoteById, awardQuote, rejectQuote } = require('../controllers/quoteCtrl');

// @desc   Submit a new quote for an RFQ
// @route POST /api/quotes
// @access Vendor Only
// We use the authorize factory with the 'Vendor' role
router.post('/', protect, authorize('Vendor'), submitQuote);

// @desc   Get all quotes for a specific RFQ
// @route GET /api/quotes/rfq/:rfqId
// @access Procurement Only
// We use the authorize factory with the 'Procurement Officer' role
router.get('/rfq/:rfqId', protect, authorize('Procurement Officer'), getQuotesForRfq);

// @desc   Get a single quote by ID
// @route GET /api/quotes/:id
// @access Procurement Only
// We use the authorize factory with the 'Procurement Officer' role
router.get('/:id', protect, authorize('Procurement Officer'), getQuoteById);

// @desc   Award a specific quote
// @route PUT /api/quotes/award/:id
// @access Procurement Only
// We use the authorize factory with the 'Procurement Officer' role
router.put('/award/:id', protect, authorize('Procurement Officer'), awardQuote);

// @desc   Reject a specific quote
// @route PUT /api/quotes/reject/:id
// @access Procurement Only
// We use the authorize factory with the 'Procurement Officer' role
router.put('/reject/:id', protect, authorize('Procurement Officer'), rejectQuote);

module.exports = router;
