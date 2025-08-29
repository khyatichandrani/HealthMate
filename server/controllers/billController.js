const Bill = require('../models/Bill');
const Appointment = require('../models/Appointment');
const History = require('../models/History');

// 1. Generate a bill for an appointment
exports.generateBill = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId)
      .populate('patientId', 'name email contact role') // Reference User model
      .populate('doctorId', 'name email contact role');  // Reference User model
    
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // You can customize item descriptions/fees here based on treatment, etc.
    const items = [
      { description: "Consultation Fee", fee: 500 },
      // More items can be added based on appointment/treatment
    ];
    const amount = items.reduce((sum, item) => sum + item.fee, 0);

    const bill = new Bill({
      patientId: appointment.patientId._id,
      doctorId: appointment.doctorId._id,
      appointmentId: appointment._id,
      amount,
      items,
      status: 'unpaid',
      issuedDate: new Date()
    });

    await bill.save();
    res.status(201).json({ message: "Bill generated", bill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating bill" });
  }
};

// 2. Get bills for the logged in patient
exports.getBillsForPatient = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const bills = await Bill.find({ patientId })
      .populate('doctorId', 'name email contact role') // Reference User model
      .populate('appointmentId');
    res.json(bills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting bills" });
  }
};

// 3. Mark bill as paid (doctor or patient can do)
exports.markBillPaid = async (req, res) => {
  try {
    const billId = req.params.billId;
    const { paymentMethod } = req.body;
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    bill.status = "paid";
    bill.paidDate = new Date();
    bill.paymentMethod = paymentMethod;
    await bill.save();
    res.json({ message: "Bill marked as paid.", bill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating bill status" });
  }
};

// 4. Get all appointments with treatments for doctor (for billing page)
exports.getAppointmentsWithTreatments = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    
    // Get all approved appointments for this doctor
    const appointments = await Appointment.find({ 
      doctorId: doctorId, 
      status: 'approved' 
    })
    .populate('patientId', 'name email contact role') // Reference User model
    .sort({ date: -1 });

    // Get all history records for this doctor
    const historyRecords = await History.find({ doctorId: doctorId });

    // Create a map of patients who have history records with this doctor
    const patientsWithTreatments = new Set(
      historyRecords.map(history => history.patientId.toString())
    );

    // Filter appointments to only include those where patient has treatment history
    const appointmentsWithTreatments = appointments.filter(appt => 
      patientsWithTreatments.has(appt.patientId._id.toString())
    );

    // Get existing bills for these appointments
    const appointmentIds = appointmentsWithTreatments.map(appt => appt._id);
    const existingBills = await Bill.find({ appointmentId: { $in: appointmentIds } });

    // Add billing info to each appointment
    const appointmentsWithBillingInfo = appointmentsWithTreatments.map(appt => {
      const bill = existingBills.find(bill => bill.appointmentId.toString() === appt._id.toString());
      return {
        ...appt.toObject(),
        hasBill: !!bill,
        billInfo: bill || null
      };
    });

    res.json(appointmentsWithBillingInfo);
  } catch (err) {
    console.error('Error fetching appointments with treatments:', err);
    res.status(500).json({ message: "Error fetching appointments with treatments" });
  }
};

// 5. Get all bills for doctor (to view billing history)
exports.getBillsForDoctor = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const bills = await Bill.find({ doctorId })
      .populate('patientId', 'name email contact role') // Reference User model
      .populate('appointmentId', 'date scheduledTime reason')
      .sort({ issuedDate: -1 });
    
    res.json(bills);
  } catch (err) {
    console.error('Error getting bills for doctor:', err);
    res.status(500).json({ message: "Error getting bills for doctor" });
  }
};
