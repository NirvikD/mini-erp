// services/inventoryService.js
const Inventory = require("../models/Inventory"); // or wherever your model is

// Add new item
const addItem = async (data) => {
  const newItem = new Inventory(data);
  return await newItem.save();
};

// Get all items
const getItems = async () => {
  return await Inventory.find();
};

// Find item by name
const getItemByName = async (itemName) => {
  return await Inventory.findOne({ item: itemName });
};

// Update item quantity
const updateItemQuantity = async (itemName, quantity) => {
  return await Inventory.findOneAndUpdate(
    { item: itemName },
    { $set: { quantity } },
    { new: true }
  );
};

// Delete item
const deleteItem = async (itemName) => {
  return await Inventory.findOneAndDelete({ item: itemName });
};

module.exports = {
  addItem,
  getItems,
  getItemByName,
  updateItemQuantity,
  deleteItem,
};
