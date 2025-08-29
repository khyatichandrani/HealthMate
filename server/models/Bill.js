const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Changed to User
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Changed to User
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  amount: { type: Number, required: true },
  items: [{ description: String, fee: Number }],
  status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  issuedDate: { type: Date, default: Date.now },
  paidDate: Date,
  paymentMethod: String,
});

module.exports = mongoose.model('Bill', BillSchema);
