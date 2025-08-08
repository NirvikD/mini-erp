// server/routes/authRoutes.js
const express = require('express');
const { login, register } = require('../controllers/authCtrl');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);

module.exports = router;
