const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAdmin = require('../middleware/auth');

// Protected routes
router.get('/', requireAdmin, userController.getUsers);

module.exports = router;
