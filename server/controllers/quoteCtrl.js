const VendorQuote = require('../models/VendorQuote');
const quoteService = require('../services/quoteService');

// @desc   Submit a new quote
// @route POST /api/quotes
// @access Vendor Only
const submitQuote = async (req, res, next) => {
    try {
        const { rfqId, quoteItems, deliveryDate } = req.body;
        
        
        const vendorId = req.user.id; 
        console.log('Vendor ID:', vendorId);

        if (!rfqId || !quoteItems || !deliveryDate) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        
        const newQuote = new VendorQuote({
            rfq: rfqId,
            vendor: vendorId,
            quoteItems,
            deliveryDate,
            // Calculate total price based on the quote items.
            totalPrice: quoteItems.reduce((acc, item) => acc + item.totalPrice, 0)
        });
        
        await newQuote.save();
        
        res.status(201).json({ success: true, message: 'Quote submitted successfully', data: newQuote });
    } catch (error) {
        next(error);
    }
};

// @desc   Get all quotes for a specific RFQ
// @route GET /api/quotes/rfq/:rfqId
// @access Procurement Only
const getQuotesForRfq = async (req, res, next) => {
    try {
        const { rfqId } = req.params;
        
        const quotes = await quoteService.getQuotesForRfq(rfqId);
        if (!quotes || quotes.length === 0) {
            return res.status(404).json({ success: false, message: 'No quotes found for this RFQ' });
        }
        res.status(200).json({ success: true, data: quotes });
    } catch (error) {
        next(error);
    }
};

// @desc   Get a single quote by ID
// @route GET /api/quotes/:id
// @access Procurement Only
const getQuoteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const quote = await quoteService.getQuoteById(id);
        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }
        res.status(200).json({ success: true, data: quote });
    } catch (error) {
        next(error);
    }
};

// @desc   Award a specific quote
// @route PUT /api/quotes/award/:id
// @access Procurement Only
const awardQuote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const awardedQuote = await quoteService.awardQuote(id, req.user.id);
        if (!awardedQuote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }
        res.status(200).json({ success: true, message: 'Quote awarded successfully', data: awardedQuote });
    } catch (error) {
        next(error);
    }
};

// @desc   Reject a specific quote
// @route PUT /api/quotes/reject/:id
// @access Procurement Only
const rejectQuote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rejectedQuote = await VendorQuote.findByIdAndUpdate(
            id,
            { status: 'Rejected' },
            { new: true }
        );
        if (!rejectedQuote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }
        res.status(200).json({ success: true, message: 'Quote rejected successfully', data: rejectedQuote });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitQuote,
    getQuotesForRfq,
    getQuoteById,
    awardQuote,
    rejectQuote,
};