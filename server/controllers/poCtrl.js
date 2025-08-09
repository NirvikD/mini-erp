// server/controllers/poCtrl.js
const PurchaseOrder = require('../models/PurchaseOrder');
const VendorQuote = require('../models/VendorQuote');

// @desc    Create a new Purchase Order from an awarded quote
// @route   POST /api/po
// @access  Procurement Only
const createPurchaseOrder = async (req, res) => {
    try {
        const { quoteId } = req.body;
        const procurementOfficerId = req.user._id;

        // Find the awarded quote and populate necessary details
        const awardedQuote = await VendorQuote.findById(quoteId).populate('rfq').populate('vendor');
        if (!awardedQuote || awardedQuote.status !== 'Awarded') {
            return res.status(400).json({ msg: 'Quote is not awarded or does not exist' });
        }

        // Create the new Purchase Order
        const newPO = new PurchaseOrder({
            quote: awardedQuote._id,
            rfq: awardedQuote.rfq._id,
            vendor: awardedQuote.vendor._id,
            procurementOfficer: procurementOfficerId,
            items: awardedQuote.quoteItems.map(item => ({
                item: item.item,
                quantity: item.quantity, // Assuming quoteItems will have a quantity field
                pricePerUnit: item.pricePerUnit,
                totalPrice: item.totalPrice,
            })),
            totalCost: awardedQuote.quoteItems.reduce((acc, item) => acc + item.totalPrice, 0),
        });

        await newPO.save();
        res.status(201).json({ msg: 'Purchase Order created successfully', po: newPO });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// @desc    Mark a Purchase Order as delivered (Goods Receipt)
// @route   PUT /api/po/:id/goods-received
// @access  Procurement Only
const markGoodsReceived = async (req, res) => {
    try {
        const { id } = req.params;
        const po = await PurchaseOrder.findById(id);

        if (!po) {
            return res.status(404).json({ msg: 'Purchase Order not found' });
        }

        // Check if the PO is already delivered
        if (po.isGoodsReceived) {
            return res.status(400).json({ msg: 'Goods already marked as received' });
        }

        po.isGoodsReceived = true;
        po.status = 'Delivered';
        po.deliveryDate = new Date();

        await po.save();
        res.status(200).json({ msg: 'Goods receipt confirmed', po });
        
        // TODO: Implement logic here to update Inventory and auto-deduct any allocated reqs
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// @desc    Get a single Purchase Order by ID
// @route   GET /api/po/:id
// @access  Procurement, Vendor
const getPurchaseOrderById = async (req, res) => {
    try {
        const po = await PurchaseOrder.findById(req.params.id)
            .populate('vendor', 'username companyName')
            .populate('procurementOfficer', 'username');

        if (!po) {
            return res.status(404).json({ msg: 'Purchase Order not found' });
        }

        // Authorization check to ensure the user is the vendor or a procurement officer
        if (req.user.role === 'Vendor' && po.vendor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized to view this purchase order' });
        }

        res.status(200).json({ po });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// @desc    Get all Purchase Orders for a specific vendor
// @route   GET /api/po/vendor/:vendorId
// @access  Procurement, Vendor
const getPurchaseOrdersForVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Authorization check
        if (req.user.role === 'Vendor' && vendorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized to view other vendors\' purchase orders' });
        }

        const pos = await PurchaseOrder.find({ vendor: vendorId })
            .populate('vendor', 'username companyName')
            .sort({ createdAt: -1 });

        res.status(200).json({ pos });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

module.exports = {
    createPurchaseOrder,
    markGoodsReceived,
    getPurchaseOrderById,
    getPurchaseOrdersForVendor
};
