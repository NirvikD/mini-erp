const express = require('express');
const { createRequisition, getRequisitions } = require('../controllers/reqCtrl');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', auth, createRequisition);
router.get('/', auth, getRequisitions);

module.exports = router;
