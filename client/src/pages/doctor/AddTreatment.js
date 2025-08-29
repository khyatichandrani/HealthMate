import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddTreatmentForm from "./AddTreatmentForm";
import "./AddTreatment.css"; // Your CSS styles

const AddTreatment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const patient = location.state?.patient;
  const appointmentId = location.state?.appointmentId; // Added appointmentId retrieval

  if (!patient) {
    return (
      <div className="message-container error">
        <p>No patient selected. Please select a patient from the appointments.</p>
        <button className="btn btn-secondary" onClick={() => navigate("/doctor/appointments")}>
          Back to Appointments
        </button>
      </div>
    );
  }

  // Navigate to patient history, passing both patientId and full patient object
  const goToPatientHistory = () => {
    navigate("/doctor/patient-history", {
      state: { patientId: patient._id, patient },
    });
  };

  return (
    <div className="add-treatment-container">
      <h2 className="dashboard-title">Add Treatment</h2>

      <div className="patient-details-card">
        <div className="patient-info">
          <h3>Patient Details</h3>
          <p><b>Name:</b> {patient.name}</p>
          <p><b>Email:</b> {patient.email}</p>
          <p><b>Age:</b> {patient.age || "N/A"}</p>
          <p><b>Gender:</b> {patient.gender || "N/A"}</p>
          <p><b>Phone:</b> {patient.contact || "N/A"}</p>
        </div>
        <div className="patient-actions">
          <button className="btn btn-secondary" onClick={() => navigate("/doctor/appointments")}>
            &larr; Back
          </button>
          <button className="btn btn-primary" onClick={goToPatientHistory}>
            View History
          </button>
        </div>
      </div>

      {/* Pass appointmentId as prop */}
      <AddTreatmentForm patientId={patient._id} appointmentId={appointmentId} />
    </div>
  );
};

export default AddTreatment;
