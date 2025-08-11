// server/services/poService
const PurchaseOrder = require('../models/PurchaseOrder');
const VendorQuote = require('../models/VendorQuote');
const RFQ = require('../models/RFQ');
const Inventory = require('../models/Inventory');
// const inventoryService = require('./inventoryService'); // The logic here makes this import redundant

// This service handles the creation of POs and the goods receipt process.
const poService = {
  // Create a Purchase Order from a winning quote
  async createPO(winningQuote, procurementOfficerId) {
    if (!winningQuote) {
      throw new Error('Winning quote object not provided.');
    }
    if (!winningQuote.rfq) {
      throw new Error(`Cannot create Purchase Order: The RFQ associated with quote ${winningQuote._id} could not be found.`);
    }
    if (!winningQuote.vendor) {
      throw new Error(`Cannot create Purchase Order: The Vendor associated with quote ${winningQuote._id} could not be found.`);
    }

    const newPO = new PurchaseOrder({
      quote: winningQuote._id,
      rfq: winningQuote.rfq._id,
      vendor: winningQuote.vendor._id,
      procurementOfficer: procurementOfficerId,
      items: winningQuote.quoteItems.map(item => ({
        item: item.item,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        totalPrice: item.totalPrice,
      })),
      totalCost: winningQuote.quoteItems.reduce((acc, item) => acc + item.totalPrice, 0),
      deliveryDate: winningQuote.deliveryDate,
      status: 'Issued',
    });

    await newPO.save();
    console.log(`Purchase Order created and issued to vendor ${winningQuote.vendor.email}.`);

    return newPO;
  },

  // Record goods receipt and update inventory
  async recordGoodsReceipt(poId, deliveredQuantities) {
    const purchaseOrder = await PurchaseOrder.findById(poId).populate('rfq');
    if (!purchaseOrder) {
      throw new Error('Purchase Order not found.');
    }

    if (purchaseOrder.isGoodsReceived) {
      throw new Error('Goods already received for this PO.');
    }

    // Loop through the deliveredQuantities from the request body
    for (const deliveredItem of deliveredQuantities) {
      // Find the inventory item using its name
      const inventoryItem = await Inventory.findOne({ item: deliveredItem.item });
      
      if (inventoryItem) {
        // Add the delivered quantity to the on-hand stock
        inventoryItem.quantity_on_hand += deliveredItem.quantity;
        await inventoryItem.save();
      } else {
        // If the item doesn't exist, create a new inventory record
        const newInventoryItem = new Inventory({
          item: deliveredItem.item,
          quantity_on_hand: deliveredItem.quantity,
          reserved_quantity: 0,
          low_stock_threshold: 5 // Default threshold
        });
        await newInventoryItem.save();
      }
    }
    
    // Update the PO status
    purchaseOrder.status = 'Delivered';
    purchaseOrder.isGoodsReceived = true;
    await purchaseOrder.save();

    console.log(`Goods received for PO ${poId}. Inventory updated.`);

    return purchaseOrder;
  },

  // Get a list of all purchase orders
  async getPOs(filter = {}) {
    return await PurchaseOrder.find(filter)
      .populate('quote')
      .populate('vendor')
      .populate('procurementOfficer');
  },
};

module.exports = poService;
