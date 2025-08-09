// server/models/PurchaseOrder.js
const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
    quote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VendorQuote',
        required: true,
    },
    rfq: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RFQ',
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The vendor user who was awarded the quote
        required: true,
    },
    procurementOfficer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The procurement officer who issued the PO
        required: true,
    },
    items: [
        {
            item: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            pricePerUnit: {
                type: Number,
                required: true,
            },
            totalPrice: {
                type: Number,
                required: true,
            },
        },
    ],
    totalCost: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Issued', 'Delivered', 'Cancelled'],
        default: 'Issued',
    },
    deliveryDate: {
        type: Date,
    },
    isGoodsReceived: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
// This model represents the purchase orders created by procurement officers for specific RFQs and vendor quotes.