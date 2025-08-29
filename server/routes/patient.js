const express = require('express');
const router = express.Router();
const Patient = require('../models/User'); // Adjust the path as needed

// Example: GET /api/patients
router.get('/', async (req, res) => {
  try {
    // Modify fields as per your schema
    const patients = await Patient.find().select('name email age gender contact');
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Failed to fetch patients.' });
  }
});

module.exports = router;
