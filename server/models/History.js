const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: { type: String },
  prescription: { type: String },
  notes: { type: String },
  date: { type: Date, default: Date.now },
  reports: [String]  // file paths
});

module.exports = mongoose.model('History', historySchema);
