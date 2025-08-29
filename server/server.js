const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Updated mongoose connection without deprecated options
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);

app.use('/uploads', express.static('uploads'));

const appointmentRoutes = require('./routes/appointment');
app.use('/api/appointments', appointmentRoutes);

const historyRoutes = require('./routes/history');
app.use('/api/history', historyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const slotsRoutes = require('./routes/slots');
app.use('/api/slots', slotsRoutes);

const patientRoutes = require('./routes/patient');
app.use('/api/patients', patientRoutes);

const treatmentRoutes = require('./routes/treatment');
app.use('/api/treatments', treatmentRoutes);

// Billing routes
const billingRoutes = require('./routes/billing');
app.use('/api/bills', billingRoutes);
