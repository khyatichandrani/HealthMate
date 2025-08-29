const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/authMiddleware');
const {
  addHistory, getHistory, generatePDF
} = require('../controllers/historyController');

// Doctor adds treatment & uploads reports
router.post('/', auth(['doctor']), upload.array('reports', 3), addHistory);

// Doctor or patient views history
router.get('/:patientId', auth(['doctor', 'patient']), getHistory);

// Generate prescription PDF
router.get('/pdf/:id', auth(['doctor', 'patient']), generatePDF);

module.exports = router;
