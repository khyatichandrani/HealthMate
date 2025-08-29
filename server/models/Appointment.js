const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },               // Date only (no time part)
  scheduledTime: { type: String, required: true },    // e.g. "10:00 AM", or ISO time string
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
  },
  slotNumber: { type: Number }, // auto-increment / assigned when appointment approved
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
