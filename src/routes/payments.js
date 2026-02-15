const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Public routes
router.post('/create-preference', paymentController.createPreference);

module.exports = router;
