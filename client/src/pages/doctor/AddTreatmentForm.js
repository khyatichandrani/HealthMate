import { useState } from "react";
import axios from "axios";
import "./AddTreatmentForm.css"; // CSS for styling below

const AddTreatmentForm = ({ patientId, appointmentId }) => {
  const [form, setForm] = useState({ diagnosis: "", prescription: "", notes: "" });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("patientId", patientId);
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      files.forEach((file) => formData.append("reports", file));

      // Save treatment record
      await axios.post("http://localhost:5000/api/history", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Call billing API to generate bill for the appointment after treatment save
      if (appointmentId) {
        await axios.post(
          `http://localhost:5000/api/bills/generate/${appointmentId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        console.warn("No appointmentId provided for billing generation");
      }

      setSuccessMsg("Treatment added successfully and bill generated!");
      setForm({ diagnosis: "", prescription: "", notes: "" });
      setFiles([]);
    } catch (err) {
      setErrorMsg("Failed to add treatment or generate bill. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="treatment-form">
      <h3 className="form-title">Add Treatment Record</h3>

      {successMsg && <p className="message success">{successMsg}</p>}
      {errorMsg && <p className="message error">{errorMsg}</p>}

      <label htmlFor="diagnosis">
        Diagnosis <span className="required">*</span>
      </label>
      <input
        type="text"
        id="diagnosis"
        placeholder="Diagnosis"
        required
        value={form.diagnosis}
        onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
        disabled={loading}
      />

      <label htmlFor="prescription">
        Prescription <span className="required">*</span>
      </label>
      <textarea
        id="prescription"
        placeholder="Prescription"
        required
        value={form.prescription}
        onChange={(e) => setForm({ ...form, prescription: e.target.value })}
        disabled={loading}
      />

      <label htmlFor="notes">Additional Notes</label>
      <textarea
        id="notes"
        placeholder="Additional notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        disabled={loading}
      />

      <label htmlFor="reports">Upload Reports</label>
      <input
        type="file"
        id="reports"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
        disabled={loading}
      />

      <button type="submit" disabled={loading} className="btn-submit">
        {loading ? "Saving..." : "Save Record"}
      </button>
    </form>
  );
};

export default AddTreatmentForm;
