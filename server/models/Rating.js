// server/models/Rating.js
const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    purchaseOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseOrder',
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The vendor being rated
        required: true,
    },
    procurementOfficer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The procurement officer who gave the rating
        required: true,
    },
    score: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Rating', RatingSchema);
// This model represents the ratings given by procurement officers to vendors for specific purchase orders.