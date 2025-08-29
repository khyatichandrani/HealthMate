const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  bookAppointment,
  getAppointments,
  updateStatus,
  getDoctorDailySchedule
} = require('../controllers/appointmentController');

// Patient books appointment (protected, patient role)
router.post('/', auth(['patient']), bookAppointment);

// Patient or Doctor fetches their appointments (protected)
router.get('/', auth(['patient', 'doctor']), getAppointments);

// Doctor updates appointment status (approve/reject) (protected, doctor role)
router.put('/:id/status', auth(['doctor']), updateStatus);

// Doctor fetches all appointments for a specific date (protected, doctor role)
// Example: GET /api/appointments/doctor-schedule?date=2025-07-26
router.get('/doctor-schedule', auth(['doctor']), getDoctorDailySchedule);

module.exports = router;
