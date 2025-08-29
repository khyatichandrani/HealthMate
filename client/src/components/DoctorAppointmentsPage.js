import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorTodaySchedule from "../../components/DoctorTodaySchedule";

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTodayAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Format today's date as YYYY-MM-DD
      const today = new Date().toISOString().split("T")[0];
      const res = await axios.get("http://localhost:5000/api/appointments/doctor-schedule", {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: today },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/appointments/${id}/status`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment approved!");
      fetchTodayAppointments(); // Refresh schedule
    } catch (err) {
      alert("Failed to approve appointment.");
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/appointments/${id}/status`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment rejected.");
      fetchTodayAppointments(); // Refresh schedule
    } catch (err) {
      alert("Failed to reject appointment.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#232259", marginBottom: "20px" }}>
        Today's Appointments
      </h1>
      <DoctorTodaySchedule
        appointments={appointments}
        loading={loading}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default DoctorAppointmentsPage;
