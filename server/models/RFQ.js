// server/models/RFQ.js
const mongoose = require('mongoose');

const RFQSchema = new mongoose.Schema({
    requisition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Requisition',
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
        },
    ],
    vendors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Assuming vendors are also users
        },
    ],
    status: {
        type: String,
        enum: ['Pending', 'Sent', 'Quotes Received', 'Completed'],
        default: 'Pending',
    },
    deadline: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('RFQ', RFQSchema);