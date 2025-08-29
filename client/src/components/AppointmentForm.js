import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    reason: "",
    scheduledTime: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/auth/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDoctors(res.data);
        // Extract unique specializations
        const specs = [...new Set(res.data.map(doc => doc.specialization))];
        setSpecializations(specs);
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  // Filter doctors by selected specialization
  const filteredDoctors = selectedSpecialization
    ? doctors.filter(doc => doc.specialization === selectedSpecialization)
    : [];

  useEffect(() => {
    // Reset doctor and slot when changing specialization
    setForm(prev => ({ ...prev, doctorId: "", scheduledTime: "" }));
    setAvailableSlots([]);
  }, [selectedSpecialization]);

  useEffect(() => {
    if (!form.doctorId || !form.date) {
      setAvailableSlots([]);
      setForm(prev => ({ ...prev, scheduledTime: "" }));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setAvailableSlots([]);
      alert("You must be logged in to fetch slots.");
      return;
    }

    setLoadingSlots(true);

    axios
      .get("http://localhost:5000/api/slots", {
        params: { doctorId: form.doctorId, date: form.date },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAvailableSlots(res.data);
        setForm(prev => ({ ...prev, scheduledTime: "" }));
      })
      .catch((err) => {
        console.error("Error fetching slots:", err);
        setAvailableSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  }, [form.doctorId, form.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.scheduledTime) {
      alert("Please select a time slot.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to book an appointment.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/appointments", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Appointment requested!");
      setForm({ doctorId: "", date: "", reason: "", scheduledTime: "" });
      setSelectedSpecialization("");
      setAvailableSlots([]);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <h3 className="font-bold mb-2">Book Appointment</h3>

      <label>
        Select Specialization:
        <select
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
        >
          <option value="">Select Specialization</option>
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </label>

      <label>
        Select Doctor:
        <select
          required
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
          disabled={!selectedSpecialization}
        >
          <option value="">Select Doctor</option>
          {filteredDoctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name} ({doc.specialization})
            </option>
          ))}
        </select>
      </label>

      <label>
        Select Date:
        <input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          min={new Date().toISOString().split("T")[0]} // no past dates
        />
      </label>

      <label>
        Time Slot:
        {loadingSlots ? (
          <p>Loading available slots…</p>
        ) : availableSlots.length > 0 ? (
          <select
            required
            value={form.scheduledTime}
            onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
          >
            <option value="">Select Time Slot</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        ) : (
          form.date &&
          form.doctorId && <p>No available slots for this date and doctor.</p>
        )}
      </label>

      <label>
        Reason for Appointment:
        <textarea
          required
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          rows="3"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white mt-2 px-4 py-1 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default AppointmentForm;
