const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res) => {
  const stock = await Inventory.find();
  res.json(stock);
};

exports.addOrUpdateStock = async (req, res) => {
  const { item, quantity } = req.body;

  const stock = await Inventory.findOne({ item });
  if (stock) {
    stock.quantity += quantity;
    await stock.save();
    return res.json({ message: 'Stock updated', stock });
  }

  const newStock = await Inventory.create({ item, quantity });
  res.json({ message: 'Stock added', stock: newStock });
};
