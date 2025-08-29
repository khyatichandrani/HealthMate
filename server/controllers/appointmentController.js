const Appointment = require('../models/Appointment');
const {
  generateTimeSlots,
  getAvailableSlots,
  assignNextSlotNumber,
} = require("../utils/slotUtils");

// Helper: get date string YYYY-MM-DD (date only, no time)
const getDateOnlyString = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Helper: normalize scheduledTime string to "HH:mm" 24-hour format zero padded
function normalizeTimeString(timeStr) {
  if (!timeStr) return "";
  const parts = timeStr.trim().split(" ");
  if (parts.length === 2) {
    // e.g. "10:30 AM"
    const [time, modifier] = parts;
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  } else {
    // assume format already "HH:mm"
    return timeStr;
  }
}

// 1️⃣ Patient books appointment with slot conflict check
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, reason, scheduledTime } = req.body;
    const patientId = req.user.userId;

    if (!doctorId || !date || !reason || !scheduledTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const dateOnly = getDateOnlyString(date);
    const normalizedScheduledTime = normalizeTimeString(scheduledTime);

    // Check if approved appointment exists at that date/time slot
    const conflict = await Appointment.findOne({
      doctorId,
      scheduledTime: normalizedScheduledTime,
      date: {
        $gte: new Date(dateOnly),
        $lt: new Date(new Date(dateOnly).getTime() + 24 * 60 * 60 * 1000),
      },
      status: 'approved',
    });

    if (conflict) {
      return res.status(409).json({ message: 'This time slot is already booked for the chosen doctor.' });
    }

    // Save as pending without slotNumber yet, with normalized scheduledTime
    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      reason,
      scheduledTime: normalizedScheduledTime,
      status: 'pending',
      slotNumber: null,
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment request sent", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error booking appointment' });
  }
};

// 2️⃣ Get appointments for patient or doctor
exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    const filter = role === 'patient' ? { patientId: userId } : { doctorId: userId };

    const appointments = await Appointment.find(filter)
      .populate('doctorId', 'name email specialization')
      .populate('patientId', 'name email age gender contact')
      .sort({ date: -1, scheduledTime: 1 });

    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

// 3️⃣ Doctor approves or rejects appointment, assigning slotNumber on approval
exports.updateStatus = async (req, res) => {
  try {
    const { status, scheduledTime } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const dateOnly = getDateOnlyString(appointment.date);
    const dayStart = new Date(dateOnly);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    if (status === 'approved') {
      const normalizedScheduledTime = normalizeTimeString(scheduledTime || appointment.scheduledTime);

      // Check conflict on approval time slot
      const conflict = await Appointment.findOne({
        doctorId: appointment.doctorId,
        scheduledTime: normalizedScheduledTime,
        date: { $gte: dayStart, $lt: dayEnd },
        status: 'approved',
        _id: { $ne: appointment._id }
      });
      if (conflict) {
        return res.status(409).json({ message: "This time slot is already booked, cannot approve." });
      }

      // Count approved appointments to assign slotNumber
      const approvedAppointments = await Appointment.find({
        doctorId: appointment.doctorId,
        date: { $gte: dayStart, $lt: dayEnd },
        status: 'approved'
      });

      appointment.slotNumber = assignNextSlotNumber(approvedAppointments);
      appointment.status = 'approved';
      appointment.scheduledTime = normalizedScheduledTime;
    } else {
      // For reject/completed/pending clear slotNumber
      appointment.status = status;
      if (status !== 'approved') {
        appointment.slotNumber = null;
      }
      if (scheduledTime) {
        appointment.scheduledTime = normalizeTimeString(scheduledTime);
      }
    }

    await appointment.save();
    res.status(200).json({ message: "Appointment updated", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating status' });
  }
};

// 4️⃣ Get Doctor's daily schedule with all slots, sorted by slotNumber/time
exports.getDoctorDailySchedule = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const dateQuery = req.query.date; // expects YYYY-MM-DD

    if (!dateQuery) {
      return res.status(400).json({ message: "Date query parameter YYYY-MM-DD required." });
    }

    const startDate = new Date(dateQuery);
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    const appointments = await Appointment.find({
      doctorId,
      date: { $gte: startDate, $lt: endDate }
    })
      .populate('patientId', 'name email age')
      .sort({ slotNumber: 1, scheduledTime: 1 });

    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching doctor's daily schedule" });
  }
};

// 5️⃣ Get available slots for a doctor on a date using slotUtils.js
exports.getAvailableSlotsForDoctor = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    // Log doctorId and date received
    console.log("Received doctorId:", doctorId);
    console.log("Received date:", date);

    if (!doctorId || !date) {
      return res.status(400).json({ message: 'doctorId and date query parameters are required.' });
    }

    // Normalize date boundaries
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    // Generate all possible slots
    const allSlots = generateTimeSlots("09:00", "17:00", 30);
    console.log("All possible slots:", allSlots);

    // Fetch approved appointments for doctor/date
    const approvedAppointments = await Appointment.find({
      doctorId,
      date: { $gte: dayStart, $lt: dayEnd },
      status: 'approved',
    });

    // Log the approved appointment documents found
    console.log("Approved appointments found:", approvedAppointments);

    // Map their scheduledTime to normalized format if you use normalization (optional)
    // For now just map directly
    const bookedSlots = approvedAppointments.map(appt => appt.scheduledTime);
    console.log("Booked slots:", bookedSlots);

    // Calculate available slots by excluding booked ones from all slots
    const availableSlots = getAvailableSlots(allSlots, bookedSlots);
    console.log("Available slots returned:", availableSlots);

    return res.status(200).json(availableSlots);
  } catch (err) {
    console.error("Error fetching available slots:", err);
    return res.status(500).json({ message: "Server error fetching time slots" });
  }
};

