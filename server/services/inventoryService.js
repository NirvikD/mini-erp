const Inventory = require("../models/Inventory");

/**
 * @desc    Create a new inventory item
 * @param   {string} item - The name of the item
 * @param   {number} initialQuantity - The initial quantity on hand
 * @returns {Promise<Object>} The new inventory item
 */
const createInventoryItem = async (item, initialQuantity = 0) => {
  try {
    const newItem = new Inventory({
      item,
      quantity_on_hand: initialQuantity,
      reserved_quantity: 0,
    });
    return await newItem.save();
  } catch (error) {
    throw new Error(`Error creating inventory item: ${error.message}`);
  }
};

/**
 * @desc    Get all inventory items, sorted by item name
 * @returns {Promise<Array>} A list of all inventory items
 */
const getItems = async () => {
  try {
    return await Inventory.find().sort({ item: 1 });
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};

/**
 * @desc    Get items with quantity below the low-stock threshold
 * @returns {Promise<Array>} A list of low-stock inventory items
 */
const getLowStock = async () => {
  try {
    return await Inventory.find({
      $expr: { $lte: ['$quantity_on_hand', '$low_stock_threshold'] }
    });
  } catch (error) {
    throw new Error(`Error fetching low-stock items: ${error.message}`);
  }
};

/**
 * @desc    Find a single item by its name
 * @param   {string} itemName - The name of the item to find
 * @returns {Promise<Object>} The found inventory item
 */
const getItemByName = async (itemName) => {
  try {
    return await Inventory.findOne({ item: itemName });
  } catch (error) {
    throw new Error(`Error finding item by name: ${error.message}`);
  }
};

/**
 * @desc    Update an item's on-hand quantity by a specified amount
 * @param   {string} itemName - The name of the item to update
 * @param   {number} change - The amount to add or subtract from the quantity
 * @returns {Promise<Object>} The updated inventory item
 */
const updateOnHandQuantity = async (itemName, change) => {
  try {
    return await Inventory.findOneAndUpdate(
      { item: itemName },
      { $inc: { quantity_on_hand: change } },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Error updating on-hand quantity: ${error.message}`);
  }
};

/**
 * @desc    Update an item's reserved quantity by a specified amount
 * @param   {string} itemName - The name of the item to update
 * @param   {number} change - The amount to add or subtract from the reserved quantity
 * @returns {Promise<Object>} The updated inventory item
 */
const updateReservedQuantity = async (itemName, change) => {
  try {
    return await Inventory.findOneAndUpdate(
      { item: itemName },
      { $inc: { reserved_quantity: change } },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Error updating reserved quantity: ${error.message}`);
  }
};

/**
 * @desc    Delete an inventory item by its name
 * @param   {string} itemName - The name of the item to delete
 * @returns {Promise<Object>} The deleted inventory item
 */
const deleteItem = async (itemName) => {
  try {
    return await Inventory.findOneAndDelete({ item: itemName });
  } catch (error) {
    throw new Error(`Error deleting item: ${error.message}`);
  }
};

module.exports = {
  createInventoryItem,
  getItems,
  getLowStock,
  getItemByName,
  updateOnHandQuantity,
  updateReservedQuantity,
  deleteItem,
};
