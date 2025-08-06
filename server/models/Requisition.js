const mongoose = require('mongoose');

const requisitionSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  status: { type: String, default: 'Pending' }, // 'Fulfilled', 'Needs Procurement'
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Requisition', requisitionSchema);
