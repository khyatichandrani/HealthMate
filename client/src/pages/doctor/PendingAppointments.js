import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null); // track processing appointment id

  // Fetch pending appointments on mount
  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pendingAppts = response.data.filter((appt) => appt.status === "pending");
      setAppointments(pendingAppts);
    } catch (err) {
      setError("Failed to fetch pending appointments.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle approve or reject
  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this appointment?`)) return;

    setProcessingId(id);
    try {
      const token = localStorage.getItem("token");

      // For approving, optionally set scheduledTime to existing or null
      const payload = { status: newStatus };

      await axios.put(`http://localhost:5000/api/appointments/${id}/status`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`Appointment ${newStatus}`);
      fetchPendingAppointments(); // refresh list
    } catch (err) {
      alert(`Failed to ${newStatus} appointment.`);
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p>Loading pending appointments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!appointments.length) return <p>No pending appointments found.</p>;

  return (
    <div>
      <h2 className="dashboard-title">Pending Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt._id}>
              <td>{appt.patientId?.name || "Unknown"}</td>
              <td>{new Date(appt.date).toLocaleDateString()}</td>
              <td>{appt.scheduledTime}</td>
              <td>{appt.reason}</td>
              <td>{appt.status}</td>
              <td>
                <button
                  disabled={processingId === appt._id}
                  onClick={() => handleStatusUpdate(appt._id, "approved")}
                  style={{ marginRight: 8 }}
                >
                  Approve
                </button>
                <button
                  disabled={processingId === appt._id}
                  onClick={() => handleStatusUpdate(appt._id, "rejected")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingAppointments;
