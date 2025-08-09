// server/controllers/quoteCtrl.js
const VendorQuote = require('../models/VendorQuote');

// @desc   Submit a new quote
// @route POST /api/quotes
// @access Vendor Only
const submitQuote = async (req, res) => {
    try {
        // Assume req.body contains { rfq, quoteItems, deliveryDate }
        const { rfq, quoteItems, deliveryDate } = req.body;
        
        // Ensure vendor is logged in and their ID is available from auth middleware
        const vendorId = req.user._id;

        // Calculate total price for the quote
        const totalPrice = quoteItems.reduce((acc, item) => acc + item.totalPrice, 0);

        const newQuote = new VendorQuote({
            rfq,
            vendor: vendorId,
            quoteItems,
            deliveryDate,
            totalPrice
        });

        await newQuote.save();
        res.status(201).json({ success: true, message: 'Quote submitted successfully', data: newQuote });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc   Get all quotes for a specific RFQ
// @route GET /api/quotes/rfq/:rfqId
// @access Procurement Only
const getQuotesForRfq = async (req, res) => {
    try {
        const { rfqId } = req.params;
        const quotes = await VendorQuote.find({ rfq: rfqId }).populate('vendor', 'username companyName');
        res.status(200).json({ success: true, data: quotes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc   Get a single quote by ID
// @route GET /api/quotes/:id
// @access Procurement Only
const getQuoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await VendorQuote.findById(id).populate('vendor', 'username companyName');
        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }
        res.status(200).json({ success: true, data: quote });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc   Award a specific quote
// @route PUT /api/quotes/award/:id
// @access Procurement Only
const awardQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const awardedQuote = await VendorQuote.findByIdAndUpdate(
            id,
            { status: 'Awarded' },
            { new: true }
        );
        if (!awardedQuote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }
        // At this point, you would typically trigger the creation of a Purchase Order
        res.status(200).json({ success: true, message: 'Quote awarded successfully', data: awardedQuote });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc   Reject a specific quote
// @route PUT /api/quotes/reject/:id
// @access Procurement Only
const rejectQuote = async (req, res) => {
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
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    submitQuote,
    getQuotesForRfq,
    getQuoteById,
    awardQuote,
    rejectQuote,
};
