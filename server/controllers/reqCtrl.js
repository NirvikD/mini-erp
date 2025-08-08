// server/controllers/reqCtrl.js
const Requisition = require('../models/Requisition');
const Inventory = require('../models/Inventory');

/**
 * @desc    Create a new requisition
 * @route   POST /api/requisition
 * @access  Private (DeptHead)
 */
exports.createRequisition = async (req, res) => {
  const { item, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Find the item in inventory
    let stock = await Inventory.findOne({ item });

    // If item exists and there's enough stock, auto-fulfill
    if (stock && stock.quantity_on_hand >= quantity) {
      stock.quantity_on_hand -= quantity;
      await stock.save();

      const requisition = await Requisition.create({
        item,
        quantity,
        status: 'Fulfilled',
        requestedBy: userId
      });

      return res.status(201).json({ requisition, message: 'Auto-fulfilled from stock' });
    } else {
      // If item doesn't exist or not enough stock, create the requisition and flag for procurement
      // We also update the reserved quantity to account for the pending request
      if (stock) {
        stock.reserved_quantity += quantity;
        await stock.save();
      } else {
        // If the item doesn't exist at all, we create a new inventory item with the reserved quantity
        // This is important for tracking items that are requested for the first time
        await Inventory.create({
          item,
          quantity_on_hand: 0,
          reserved_quantity: quantity,
        });
      }

      const requisition = await Requisition.create({
        item,
        quantity,
        status: 'Needs Procurement',
        requestedBy: userId
      });

      return res.status(201).json({ requisition, message: 'Flagged for procurement' });
    }
  } catch (error) {
    console.error('Error creating requisition:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all requisitions for a specific user
 * @route   GET /api/requisition/my-requisitions
 * @access  Private (DeptHead)
 */
exports.getMyRequisitions = async (req, res) => {
  try {
    const requisitions = await Requisition.find({ requestedBy: req.user.id })
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(requisitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all requisitions (for ProcurementOfficer)
 * @route   GET /api/requisition/all
 * @access  Private (ProcurementOfficer)
 */
exports.getAllRequisitions = async (req, res) => {
  try {
    const requisitions = await Requisition.find()
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(requisitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update the status of a requisition
 * @route   PUT /api/requisition/:id
 * @access  Private (ProcurementOfficer)
 */
exports.updateRequisitionStatus = async (req, res) => {
  const { status } = req.body;
  const requisitionId = req.params.id;

  try {
    const requisition = await Requisition.findById(requisitionId);

    if (!requisition) {
      return res.status(404).json({ message: 'Requisition not found' });
    }

    // Update the status and save
    requisition.status = status;
    await requisition.save();

    res.json({ message: 'Requisition status updated', requisition });
  } catch (error) {
    console.error('Error updating requisition status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
