const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const requireAdmin = require('../middleware/auth');

// Public routes
router.post('/visit', statsController.logVisit);

// Protected routes
router.get('/', requireAdmin, statsController.getStats);

module.exports = router;
