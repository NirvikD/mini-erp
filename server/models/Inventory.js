const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  item: String,
  quantity: Number
});

module.exports = mongoose.model('Inventory', inventorySchema);
