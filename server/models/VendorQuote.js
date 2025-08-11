// server/models/VendorQuote.js
const mongoose = require('mongoose');

const VendorQuoteSchema = new mongoose.Schema({
    rfq: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RFQ',
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Vendor user
        required: true,
    },
    quoteItems: [
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
            notes: {
                type: String,
            },
        },
    ],
    deliveryDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Submitted', 'Awarded', 'Rejected'],
        default: 'Submitted',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('VendorQuote', VendorQuoteSchema);
// This model represents the quotes submitted by vendors in response to RFQs, including details about the items and pricing.