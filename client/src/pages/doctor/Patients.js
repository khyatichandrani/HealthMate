import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentCounts, setAppointmentCounts] = useState({});  // patientId -> count mapping

  const navigate = useNavigate();

  // Extract doctor ID from localStorage (adjust field as needed)
  const getDoctorId = () => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      return user ? (user._id || user.id) : null;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const doctorId = getDoctorId();
      try {
        const token = localStorage.getItem("token");

        // Fetch patients
        const patientsRes = await axios.get("http://localhost:5000/api/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch all appointments
        const apptRes = await axios.get("http://localhost:5000/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allPatients = patientsRes.data;
        const allAppointments = apptRes.data;

        // Extract unique patient IDs who made an appointment with this doctor
        // Count only appointments with status 'approved' or 'completed'
        const patientIdsSet = new Set();
        const counts = {}; // patientId -> count

        allAppointments.forEach(appt => {
          // Extract doctorId string
          let apptDoctorId;
          if (appt.doctorId) {
            if (typeof appt.doctorId === "object" && appt.doctorId._id) {
              apptDoctorId = appt.doctorId._id;
            } else {
              apptDoctorId = appt.doctorId;
            }
          }

          // Only count appointments matching logged-in doctor
          if (String(apptDoctorId) === String(doctorId) && appt.patientId) {
            // Only count approved or completed appointments
            if (appt.status === "approved" || appt.status === "completed") {
              // Extract patient id string
              let apptPatientId;
              if (typeof appt.patientId === "object" && appt.patientId._id) {
                apptPatientId = appt.patientId._id;
              } else {
                apptPatientId = appt.patientId;
              }

              patientIdsSet.add(apptPatientId);

              if (counts[apptPatientId]) {
                counts[apptPatientId] += 1;
              } else {
                counts[apptPatientId] = 1;
              }
            }
          }
        });

        // Filter patients: only those who have made an appointment with the doctor
        const filteredPatients = allPatients.filter(p =>
          patientIdsSet.has(String(p._id || p.id))
        );

        setPatients(filteredPatients);
        setAppointmentCounts(counts);
        setError(null);
      } catch (err) {
        setError("Failed to fetch patient list.");
        setPatients([]);
        setAppointmentCounts({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToPatientHistory = (patient) => {
    navigate("/doctor/patient-history", {
      state: { patientId: patient._id, patient },
    });
  };

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!patients.length) return <p>No patients found.</p>;

  return (
    <div>
      <h2 className="dashboard-title">My Patients</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Email</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Age</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Gender</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Phone</th>
            <th style={{ textAlign: "center", padding: "8px" }}>Appointments</th>
            <th style={{ textAlign: "center", padding: "8px" }}>History</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            const patientId = String(patient._id || patient.id);
            const count = appointmentCounts[patientId] || 0;

            return (
              <tr key={patientId} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{patient.name}</td>
                <td style={{ padding: "8px" }}>{patient.email}</td>
                <td style={{ padding: "8px" }}>{patient.age || "N/A"}</td>
                <td style={{ padding: "8px" }}>{patient.gender || "N/A"}</td>
                <td style={{ padding: "8px" }}>{patient.contact || "N/A"}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>{count}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => goToPatientHistory(patient)}
                  >
                    View History
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
