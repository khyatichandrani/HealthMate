import { useState } from "react";
import axios from "axios";

const ReportUploader = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    files.forEach(file => formData.append("reports", file));
    formData.append("note", note);

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/patient/upload-report",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Uploaded successfully!");
      setFiles([]);
      setNote("");
      e.target.reset();
      // 🔥 Notify the parent to close/hide form or refresh data
      if (onUpload) onUpload();
    } catch {
      alert("Failed to upload.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="report-upload-form">
      <h3 className="upload-title">Upload Medical Reports</h3>
      <label className="report-label" htmlFor="report-files">
        Choose file(s):
      </label>
      <input
        type="file"
        id="report-files"
        className="report-file-input"
        multiple
        onChange={e => setFiles(Array.from(e.target.files))}
      />
      <label className="report-label" htmlFor="report-note">
        Note (optional):
      </label>
      <textarea
        id="report-note"
        className="report-note-input"
        placeholder="Add details about these reports (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <button
        className="upload-btn"
        type="submit"
        disabled={loading || files.length === 0}
      >
        {loading ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
};

export default ReportUploader;
