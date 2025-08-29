const express = require('express');
const router = express.Router();
const Treatment = require('../models/History'); // ensure your model exists

// GET /api/treatments/patient/:patientId - get all treatments for this patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const treatments = await Treatment.find({ patientId: req.params.patientId }).sort({ date: -1 });
    res.json(treatments);
  } catch (error) {
    console.error("Error fetching treatments:", error);
    res.status(500).json({ message: 'Failed to fetch treatments' });
  }
});

module.exports = router;
