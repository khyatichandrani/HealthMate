import { useEffect, useState } from "react";
import axios from "axios";

const HistoryList = ({ patientId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/api/history/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  }, [patientId]);

  const downloadPrescription = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/history/pdf/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // treat response as file
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download prescription. Try logging in again.");
    }
  };

  if (!history.length) return <div>No medical history found.</div>;

  return (
    <div>
      <h3 className="font-bold mb-4" style={{fontSize:"1.22em"}}>Medical History</h3>
      <div className="history-list">
        {history.map((entry, i) => (
          <div key={i} className="history-entry-card">
            <div style={{marginBottom: 5, color: "#6d659c", fontWeight: 600}}>
              {new Date(entry.date).toLocaleDateString()}
            </div>
            <div><b>Doctor:</b> {entry.doctorId.name}</div>
            <div><b>Diagnosis:</b> {entry.diagnosis}</div>
            <div><b>Prescription:</b> {entry.prescription}</div>
            <button
              onClick={() => downloadPrescription(entry._id)}
              className="download-prescription-btn"
            >
              Download Prescription
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
