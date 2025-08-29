import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PatientReports from "../../components/PatientReports"; // adjust path if needed
import './Appointments.css';

const PatientHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const patientId = location.state?.patientId || location.state?.patient?._id;
  const patient = location.state?.patient;

  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const token = localStorage.getItem("token");
        // Adjust endpoint as per your backend API
        const res = await axios.get(`http://localhost:5000/api/treatments/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTreatments(res.data);
      } catch (err) {
        setError("Failed to fetch treatment history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (patientId) fetchTreatments();
  }, [patientId]);

  if (!patientId) {
    return (
      <div className="patient-history-container">
        <p className="error-message">No patient selected. Please return to the appointments page.</p>
        <button className="back-button" onClick={() => navigate("/doctor/appointments")}>Back</button>
      </div>
    );
  }

  return (
    <div className="patient-history-container">
      <button
        className="back-button"
        onClick={() => navigate("/doctor/appointments")}
      >
        &larr; Back 
      </button>

      <div className="patient-details">
        <h3>Patient Details</h3>
        <p><b>Name:</b> {patient?.name}</p>
        <p><b>Email:</b> {patient?.email}</p>
        <p><b>Age:</b> {patient?.age || "N/A"}</p>
        <p><b>Gender:</b> {patient?.gender || "N/A"}</p>
        <p><b>Phone:</b> {patient?.contact || "N/A"}</p>
      </div>

      <h3 className="treatment-history-title">Treatment History</h3>

      {loading ? (
        <p className="message">Loading treatments...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : treatments.length === 0 ? (
        <p className="message">No treatments found for this patient.</p>
      ) : (
        <table className="treatment-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((tr) => (
              <tr key={tr._id}>
                <td>{tr.date ? new Date(tr.date).toLocaleDateString() : "N/A"}</td>
                <td>{tr.diagnosis || "-"}</td>
                <td>{tr.prescription || "-"}</td>
                <td>{tr.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientHistory;
