import { useEffect, useState } from "react";
import axios from "axios";

const PatientHistoryViewer = ({ patientId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    setLoading(true);
    setError("");

    axios
      .get(`http://localhost:5000/api/history/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHistory(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch history.");
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  if (!patientId) return null;

  if (loading) return <p>Loading patient history...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (history.length === 0)
    return <p>No history records found for this patient.</p>;

  return (
    <div className="p-4 mt-4 border rounded">
      <h3 className="font-bold mb-2">Patient Medical History</h3>
      {history.map((entry) => (
        <div key={entry._id} className="border-b py-2">
          <p>
            <b>Date:</b>{" "}
            {entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <b>Diagnosis:</b> {entry.diagnosis || "N/A"}
          </p>
          <p>
            <b>Prescription:</b> {entry.prescription || "N/A"}
          </p>
          <a
            href={`http://localhost:5000/api/history/pdf/${entry._id}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Download PDF
          </a>
        </div>
      ))}
    </div>
  );
};

export default PatientHistoryViewer;
