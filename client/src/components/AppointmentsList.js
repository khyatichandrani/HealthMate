import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AppointmentsList = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_API || "http://localhost:5000"}/api/appointments`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        // For patients/doctors, you can filter the appointments here if needed.
        setAppointments(res.data);
      } catch (err) {
        // Optional: add error handling here
        console.error("Failed to fetch appointments:", err);
      }
      setLoading(false);
    };
    fetchAppointments();
  }, []);

  if (loading) return <div>Loading appointments…</div>;
  if (!appointments.length) return <div>No appointments found.</div>;

  return (
    <div className="appointments-list">
      {appointments.map((a) => (
        <div key={a._id} className="appointment-card" style={styles.appointmentCard}>
          <div><b>Doctor:</b> {a.doctorId?.name || "unknown"} ({a.doctorId?.specialization || "N/A"})</div>
          <div><b>Date:</b> {new Date(a.date).toLocaleDateString()}</div>
          <div><b>Time:</b> {a.scheduledTime || "N/A"}</div>
          <div><b>Reason:</b> {a.reason}</div>
          <div>
            <b>Status:</b>{" "}
            <span
              className={`status ${a.status}`}
              style={{
                color:
                  a.status === "approved"
                    ? "#33d178"
                    : a.status === "pending"
                    ? "#fbbf24"
                    : "#f43f5e",
                fontWeight: 600,
                textTransform: "capitalize"
              }}
            >
              {a.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  appointmentCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#f9f9fb",
    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
  },
};

export default AppointmentsList;
