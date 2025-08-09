// /server/models/Requisition.js
const mongoose = require('mongoose');

const RequisitionSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Fulfilled', 'Needs Procurement', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Requisition', RequisitionSchema);
// This model represents the requisitions made by users for items needed in the organization.