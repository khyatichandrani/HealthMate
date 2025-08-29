const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getAvailableSlotsForDoctor } = require('../controllers/appointmentController');

// Add the /slots route here, protected for patient and doctor roles
router.get('/', auth(['patient', 'doctor']), getAvailableSlotsForDoctor);

module.exports = router;
