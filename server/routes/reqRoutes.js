// server/routes/reqRoutes.js
const express = require('express');
const { createRequisition, getMyRequisitions, getAllRequisitions, updateRequisitionStatus } = require('../controllers/reqCtrl');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @route   POST /api/requisition
 * @desc    Create a new requisition
 * @access  Private (DeptHead)
 */
router.post('/', protect, authorize('DeptHead'), createRequisition);

/**
 * @route   GET /api/requisition/my-requisitions
 * @desc    Get all requisitions for the logged-in DeptHead
 * @access  Private (DeptHead)
 */
router.get('/my-requisitions', protect, authorize('DeptHead'), getMyRequisitions);

/**
 * @route   GET /api/requisition/all
 * @desc    Get all requisitions for procurement officer to manage
 * @access  Private (ProcurementOfficer)
 */
router.get('/all', protect, authorize('ProcurementOfficer'), getAllRequisitions);

/**
 * @route   PUT /api/requisition/:id
 * @desc    Update the status of a requisition
 * @access  Private (ProcurementOfficer)
 */
router.put('/:id', protect, authorize('ProcurementOfficer'), updateRequisitionStatus);

module.exports = router;
