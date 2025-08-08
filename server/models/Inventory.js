// server/models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    unique: true,
    trim: true // Removes any leading or trailing whitespace
  },
  quantity_on_hand: {
    type: Number,
    required: true,
    default: 0
  },
  low_stock_threshold: {
    type: Number,
    default: 5
  },
  // The 'reserved_quantity' field is for tracking items that have been requested
  // but not yet allocated, like for requisitions with 'Needs Procurement' status.
  reserved_quantity: {
    type: Number,
    required: true,
    default: 0
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Inventory', inventorySchema);