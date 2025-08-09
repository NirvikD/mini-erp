// server/controllers/RFQCtrl.js
const RFQ = require('../models/RFQ');
const Requisition = require('../models/Requisition');
const VendorQuote = require('../models/VendorQuote'); // Import the new VendorQuote model

// @desc    Create a new RFQ
// @route   POST /api/rfq
// @access  Procurement Officer
exports.createRFQ = async (req, res) => {
    try {
        // Now destructuring the deadline from the request body
        const { requisitionId, vendors, items, deadline } = req.body;
        const procurementOfficerId = req.user._id;

        const requisition = await Requisition.findById(requisitionId);

        if (!requisition) {
            return res.status(404).json({ success: false, message: 'Requisition not found.' });
        }

        if (requisition.status !== 'Approved') {
            return res.status(400).json({ success: false, message: `Requisition status is '${requisition.status}', not 'Approved'.` });
        }

        // Update requisition status to 'Needs Procurement' to match the updated enum
        //requisition.status = 'Needs Procurement'; // <-- Updated this line
        await requisition.save();

        const newRFQ = new RFQ({
            requisition: requisitionId,
            procurementOfficer: procurementOfficerId,
            vendors,
            items,
            deadline,
            status: 'Sent'
        });

        await newRFQ.save();
        res.status(201).json({
            success: true,
            message: 'RFQ created and sent to vendors!',
            rfq: newRFQ
        });

    } catch (error) {
        console.error('Error creating RFQ:', error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get RFQs for a specific vendor
// @route   GET /api/rfq/my-rfqs
// @access  Vendor
exports.getVendorRFQs = async (req, res) => {
    try {
        const vendorId = req.user._id;

        const rfqs = await RFQ.find({ vendors: vendorId })
            .populate('requisition', 'item quantity')
            .populate('procurementOfficer', 'name email');

        res.status(200).json({ success: true, rfqs });
    } catch (error) {
        console.error('Error fetching vendor RFQs:', error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Submit a quote for an RFQ
// @route   POST /api/rfq/:rfqId/quote
// @access  Vendor
exports.submitQuote = async (req, res) => {
    try {
        const { rfqId } = req.params;
        const { quoteItems, deliveryDate } = req.body;
        const vendorId = req.user._id;

        const rfq = await RFQ.findById(rfqId);

        if (!rfq) {
            return res.status(404).json({ success: false, message: 'RFQ not found.' });
        }

        // Check if the vendor is one of the invited vendors
        if (!rfq.vendors.includes(vendorId)) {
            return res.status(403).json({ success: false, message: 'You are not authorized to submit a quote for this RFQ.' });
        }

        // Check if the vendor has already submitted a quote for this RFQ
        const existingQuote = await VendorQuote.findOne({ rfq: rfqId, vendor: vendorId });
        if (existingQuote) {
            return res.status(409).json({ success: false, message: 'You have already submitted a quote for this RFQ.' });
        }

        // Create a new VendorQuote document
        const newQuote = new VendorQuote({
            rfq: rfqId,
            vendor: vendorId,
            quoteItems,
            deliveryDate,
        });

        await newQuote.save();

        res.status(201).json({ success: true, message: 'Quote submitted successfully!', quote: newQuote });
    } catch (error) {
        console.error('Error submitting quote:', error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get all quotes for a specific RFQ
// @route   GET /api/rfq/:rfqId/quotes
// @access  Procurement Officer
exports.getQuotesForRFQ = async (req, res) => {
    try {
        const { rfqId } = req.params;

        // Find all quotes for the specified RFQ from the VendorQuote collection
        const quotes = await VendorQuote.find({ rfq: rfqId })
            .populate('vendor', 'name email');

        if (!quotes || quotes.length === 0) {
            return res.status(404).json({ success: false, message: 'No quotes found for this RFQ.' });
        }

        res.status(200).json({ success: true, quotes });
    } catch (error) {
        console.error('Error fetching quotes for RFQ:', error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
