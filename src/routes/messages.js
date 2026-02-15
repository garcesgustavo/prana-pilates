const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const requireAdmin = require('../middleware/auth');

// Public routes
router.post('/', messageController.createMessage);

// Protected routes
router.get('/', requireAdmin, messageController.getMessages);

module.exports = router;
