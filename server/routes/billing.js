const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const billController = require('../controllers/billController');

// Endpoint: Generate bill for appointment (doctor marks completed)
router.post('/generate/:appointmentId', auth(['doctor']), billController.generateBill);

// Endpoint: Get my bills (patient views their bills)
router.get('/my-bills', auth(['patient']), billController.getBillsForPatient);

// Endpoint: Mark bill as paid (doctor or patient)
router.post('/pay/:billId', auth(['doctor', 'patient']), billController.markBillPaid);

// NEW ENDPOINTS:
// Get appointments with treatments for doctor billing page
router.get('/appointments-with-treatments', auth(['doctor']), billController.getAppointmentsWithTreatments);

// Get all bills for doctor
router.get('/doctor-bills', auth(['doctor']), billController.getBillsForDoctor);

module.exports = router;
