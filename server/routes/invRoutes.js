const express = require('express');
const { getInventory, addOrUpdateStock } = require('../controllers/invCtrl');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', auth, getInventory);
router.post('/', auth, addOrUpdateStock);

module.exports = router;
