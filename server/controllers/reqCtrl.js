const Requisition = require('../models/Requisition');
const Inventory = require('../models/Inventory');

exports.createRequisition = async (req, res) => {
  const { item, quantity } = req.body;
  const userId = req.user.id;

  // Check inventory
  const stock = await Inventory.findOne({ item });

  if (stock && stock.quantity >= quantity) {
    // Auto-fulfill
    stock.quantity -= quantity;
    await stock.save();

    const requisition = await Requisition.create({
      item,
      quantity,
      status: 'Fulfilled',
      requestedBy: userId
    });

    return res.json({ requisition, message: 'Auto-fulfilled from stock' });
  } else {
    const requisition = await Requisition.create({
      item,
      quantity,
      status: 'Needs Procurement',
      requestedBy: userId
    });

    return res.json({ requisition, message: 'Flagged for procurement' });
  }
};

exports.getRequisitions = async (req, res) => {
  const reqs = await Requisition.find().populate('requestedBy', 'name email');
  res.json(reqs);
};
