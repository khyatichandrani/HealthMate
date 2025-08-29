const User = require('../models/User'); 
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }, 'name _id specialization');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
});


module.exports = router;
