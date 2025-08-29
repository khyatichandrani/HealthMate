// controllers/patientController.js
const Patient = require('../models/Patient');

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select('name email age gender contact'); // Include the fields you want to expose
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Failed to fetch patients.' });
  }
};
