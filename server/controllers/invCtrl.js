const Inventory = require('../models/Inventory');

/**
 * @desc    Get all inventory items
 * @route   GET /api/inventory
 * @access  Private (ProcurementOfficer, DeptHead)
 */
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ item: 1 });
    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get inventory items with quantity below the low-stock threshold
 * @route   GET /api/inventory/low-stock
 * @access  Private (ProcurementOfficer)
 */
exports.getLowStock = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity_on_hand', '$low_stock_threshold'] }
    });
    res.json(lowStockItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Add or update a stock item's quantity_on_hand
 * @route   POST /api/inventory/add
 * @access  Private (ProcurementOfficer)
 */
exports.addStock = async (req, res) => {
  const { item, quantity } = req.body;

  try {
    let stock = await Inventory.findOne({ item });

    if (stock) {
      // If the item exists, just add to the on-hand quantity
      stock.quantity_on_hand += quantity;
      await stock.save();
      return res.json({ message: 'Stock updated', stock });
    }

    // If the item doesn't exist, create a new one
    const newStock = await Inventory.create({
      item,
      quantity_on_hand: quantity
    });
    res.status(201).json({ message: 'New stock item added', stock: newStock });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a stock item
 * @route   DELETE /api/inventory/:id
 * @access  Private (ProcurementOfficer)
 */
exports.deleteStockItem = async (req, res) => {
  try {
    const stock = await Inventory.findByIdAndDelete(req.params.id);

    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    res.json({ message: 'Stock item deleted successfully', stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
