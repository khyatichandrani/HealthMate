// utils/slotUtils.js

/**
 * Generates an array of time slots for a day.
 * Example slots: 09:00, 09:30, 10:00, ...
 * @param {string} start - start time in 'HH:mm' 24h format (e.g., '09:00')
 * @param {string} end - end time in 'HH:mm' (e.g., '17:00')
 * @param {number} slotDurationMinutes - Duration of each slot, e.g., 30 minutes
 * @returns {string[]} - Array of time slots as strings (e.g., ['09:00', '09:30', ...])
 */
function generateTimeSlots(start = "09:00", end = "17:00", slotDurationMinutes = 30) {
  const slots = [];
  let [hour, minute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (hour < endHour || (hour === endHour && minute < endMinute)) {
    const hh = hour.toString().padStart(2, "0");
    const mm = minute.toString().padStart(2, "0");
    slots.push(`${hh}:${mm}`);

    minute += slotDurationMinutes;
    if (minute >= 60) {
      minute = minute % 60;
      hour += 1;
    }
  }
  return slots;
}

/**
 * Returns an array of available slots by removing booked slots from all slots.
 * @param {string[]} allSlots - all possible slots in a day (output of generateTimeSlots).
 * @param {string[]} bookedSlots - slots already booked and approved.
 * @returns {string[]} - slots available for booking.
 */
function getAvailableSlots(allSlots, bookedSlots) {
  const bookedSet = new Set(bookedSlots);
  return allSlots.filter(slot => !bookedSet.has(slot));
}

/**
 * Assigns the next available slotNumber for an appointment.
 * Counts how many appointments are approved for that doctor on the given date,
 * then returns the next number in the order.
 * 
 * @param {Array} existingAppointments - array of approved appointments for doctor/date.
 * @returns {number} next slot number.
 */
function assignNextSlotNumber(existingAppointments) {
  // Here existingAppointments is assumed to be filtered approved appointments for single doctor/date
  // slotNumber should be 1 + count of existing approved
  return existingAppointments.length + 1;
}

module.exports = {
  generateTimeSlots,
  getAvailableSlots,
  assignNextSlotNumber,
};
