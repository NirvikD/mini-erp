// server/controllers/vendorCtrl.js
const Rating = require('../models/Rating');

// @desc    Submit a new rating for a vendor
// @route   POST /api/vendor/rate
// @access  Procurement Only
const submitVendorRating = async (req, res) => {
    try {
        const { purchaseOrder, vendor, score, comment } = req.body;
        const procurementOfficer = req.user._id;

        // Ensure the procurement officer has a valid PO for this vendor
        const newRating = new Rating({
            purchaseOrder,
            vendor,
            procurementOfficer,
            score,
            comment,
        });

        await newRating.save();
        res.status(201).json({ msg: 'Rating submitted successfully', rating: newRating });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// @desc    Get a vendor's history and ratings
// @route   GET /api/vendor/history/:vendorId
// @access  All authenticated roles
const getVendorHistory = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const ratings = await Rating.find({ vendor: vendorId })
            .populate('purchaseOrder', 'status')
            .sort({ createdAt: -1 });
        
        // Calculate average score
        const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
        const averageScore = ratings.length > 0 ? (totalScore / ratings.length).toFixed(1) : 0;

        res.status(200).json({ 
            ratings,
            averageScore
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

module.exports = {
    submitVendorRating,
    getVendorHistory
};
