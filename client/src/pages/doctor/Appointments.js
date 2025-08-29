import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get today's date as default filter date, format YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };
  const [filterDate, setFilterDate] = useState(getTodayDateString());

  const [doctorId, setDoctorId] = useState(null);

  const navigate = useNavigate();

  // Safe doctorId extraction with console logs
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    console.log("Raw user from localStorage:", userStr);
    const user = userStr ? JSON.parse(userStr) : null;
    console.log("Parsed user object:", user);
    if (user && user.role === "doctor") {
      const id = user._id || user.id;
      console.log("Extracted doctorId:", id);
      setDoctorId(id ? id.toString() : null);
    } else {
      console.log("User is not a doctor or no user found");
      setDoctorId(null);
    }
  }, []);

  // Fetch appointments with logging
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched appointments:", res.data);
        setAppointments(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch appointments");
        console.error("Fetch error:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Navigate to AddTreatment page, passing patient and appointmentId
  const handleTreatmentClick = (patient, appointmentId) => {
    if (patient && appointmentId) {
      navigate("/doctor/add-treatment", { state: { patient, appointmentId } });
    }
  };

  // Filtering appointments for doctor and date
  const filteredAppointments = appointments.filter((appt) => {
    if (!appt.date || !appt.doctorId || !doctorId) return false;

    let apptDoctorId;
    if (typeof appt.doctorId === "object" && appt.doctorId !== null) {
      apptDoctorId = appt.doctorId._id ? String(appt.doctorId._id) : null;
    } else {
      apptDoctorId = String(appt.doctorId);
    }

    if (apptDoctorId !== String(doctorId)) return false;

    const apptDate = new Date(appt.date);
    const filterDateObj = new Date(filterDate);

    return (
      apptDate.getFullYear() === filterDateObj.getFullYear() &&
      apptDate.getMonth() === filterDateObj.getMonth() &&
      apptDate.getDate() === filterDateObj.getDate()
    );
  });

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 className="dashboard-title">Today's Appointments</h2>

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="dateFilter"
          style={{ marginRight: "10px", fontWeight: "600" }}
        >
          Filter by Date:
        </label>
        <input
          id="dateFilter"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {filteredAppointments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Treatment</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.patientId?.name || "Unknown"}</td>
                <td>{new Date(appt.date).toLocaleDateString()}</td>
                <td>{appt.scheduledTime}</td>
                <td>{appt.reason}</td>
                <td>{appt.status}</td>
                <td>
                  {appt.status === "approved" && appt.patientId ? (
                    <button onClick={() => handleTreatmentClick(appt.patientId, appt._id)}>
                      Treatment
                    </button>
                  ) : (
                    <button
                      style={{ backgroundColor: "#f0ad4e", color: "#000", cursor: "pointer" }}
                      onClick={() => navigate("/doctor/pending-appointments")}
                    >
                      Go to Pending Appointments
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No appointments found for selected date.</p>
      )}
    </div>
  );
};

export default Appointments;
