const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const requireAdmin = require('../middleware/auth');

// Public routes
router.post('/', appointmentController.createAppointment);
router.get('/availability', appointmentController.getAvailability);

// Protected routes
router.get('/', requireAdmin, appointmentController.getAppointments);

module.exports = router;
