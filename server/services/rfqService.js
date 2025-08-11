const Requisition = require('../models/Requisition');
const RFQ = require('../models/RFQ');
const User = require('../models/User'); // Assuming vendors are users with a 'vendor' role

// This service is responsible for creating and managing RFQs.
const rfqService = {
  // Create an RFQ for a requisition flagged for procurement
  async createRFQ(requisitionId, deadline) {
    // Find the requisition that needs an RFQ
    const requisition = await Requisition.findById(requisitionId);
    if (!requisition || requisition.status !== 'Needs Procurement') {
      throw new Error('Requisition not found or not in procurement status.');
    }

    // Find all users with the 'vendor' role
    const vendors = await User.find({ role: 'vendor' });

    // Create the RFQ document
    const newRfq = new RFQ({
      requisition: requisition._id,
      items: [{
        item: requisition.item,
        quantity: requisition.quantity,
      }],
      vendors: vendors.map(vendor => vendor._id),
      deadline: deadline,
      status: 'Sent',
    });

    await newRfq.save();

    // Update the requisition status to reflect that an RFQ has been created
    requisition.status = 'Approved';
    await requisition.save();

    // In a real-world scenario, you'd trigger a notification system here
    // e.g., send emails to vendors or push notifications.
    console.log(`RFQ created for requisition ${requisitionId} and sent to vendors.`);

    return newRfq;
  },

  // Get all RFQs or filter by status
  async getRFQs(filter = {}) {
    return await RFQ.find(filter).populate('requisition').populate('vendors');
  },

  // Get a single RFQ by ID
  async getRFQById(rfqId) {
    return await RFQ.findById(rfqId).populate('requisition').populate('vendors');
  },
};

module.exports = rfqService;