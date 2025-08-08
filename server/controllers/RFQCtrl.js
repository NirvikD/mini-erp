// /server/controllers/rfqCtrl.js
const RFQ = require('../models/RFQ');
const Requisition = require('../models/Requisition');
const VendorQuote = require('../models/VendorQuote');

/**
 * @desc    Create an RFQ for a 'Needs Procurement' requisition
 * @route   POST /api/rfq
 * @access  Private (ProcurementOfficer)
 */
exports.createRFQ = async (req, res) => {
  const { requisitionId, deadline, vendors } = req.body;
  
  try {
    const requisition = await Requisition.findById(requisitionId);

    if (!requisition || requisition.status !== 'Needs Procurement') {
      return res.status(404).json({ message: 'Requisition not found or not in procurement status' });
    }

    // You can add logic here to select vendors based on item category, etc.
    const rfq = await RFQ.create({
      requisition: requisitionId,
      items: [{ item: requisition.item, quantity: requisition.quantity }],
      vendors: vendors,
      deadline: deadline,
      status: 'Sent', // You might set this to 'Pending' initially
    });

    // Optionally, update the requisition status to reflect the RFQ creation
    requisition.status = 'RFQ Sent';
    await requisition.save();

    res.status(201).json({ rfq, message: 'RFQ created and sent to vendors' });
  } catch (error) {
    console.error('Error creating RFQ:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all RFQs for a specific vendor
 * @route   GET /api/rfq/my-rfqs
 * @access  Private (Vendor)
 */
exports.getVendorRFQs = async (req, res) => {
  try {
    // Find RFQs where the vendor's ID is in the vendors array
    const rfqs = await RFQ.find({ vendors: req.user.id })
      .populate('requisition', 'item quantity')
      .sort({ createdAt: -1 });

    res.json(rfqs);
  } catch (error) {
    console.error('Error fetching vendor RFQs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Submit a quote for a specific RFQ
 * @route   POST /api/rfq/:rfqId/quote
 * @access  Private (Vendor)
 */
exports.submitQuote = async (req, res) => {
  const { rfqId } = req.params;
  const { quoteItems, deliveryDate } = req.body;
  const vendorId = req.user.id;
  
  try {
    const rfq = await RFQ.findById(rfqId);

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    // Check if the vendor is authorized to submit a quote for this RFQ
    if (!rfq.vendors.includes(vendorId)) {
        return res.status(403).json({ message: 'You are not authorized to submit a quote for this RFQ' });
    }
    
    // Create the new vendor quote
    const newQuote = await VendorQuote.create({
      rfq: rfqId,
      vendor: vendorId,
      quoteItems,
      deliveryDate,
    });
    
    res.status(201).json({ message: 'Quote submitted successfully', newQuote });
  } catch (error) {
    console.error('Error submitting quote:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all quotes for a specific RFQ
 * @route   GET /api/rfq/:rfqId/quotes
 * @access  Private (ProcurementOfficer)
 */
exports.getQuotesForRFQ = async (req, res) => {
  try {
    const quotes = await VendorQuote.find({ rfq: req.params.rfqId }).populate('vendor', 'name email');

    if (!quotes) {
      return res.status(404).json({ message: 'No quotes found for this RFQ' });
    }

    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes for RFQ:', error);
    res.status(500).json({ message: 'Server error' });
  }
};