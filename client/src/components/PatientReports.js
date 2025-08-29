import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientReports = ({ patientId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/history/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch reports');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (patientId) fetchReports();
  }, [patientId]);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (reports.length === 0) return <p>No reports found.</p>;

  return (
    <div>
      <h3>Patient Reports</h3>
      <ul>
        {reports.map((report) => (
          <li key={report._id}>
            <a href={`/${report.filepath}`} target="_blank" rel="noopener noreferrer">
              {report.filename}
            </a>{" "}
            - {new Date(report.uploadedAt).toLocaleDateString()}
            {report.description ? <div><em>{report.description}</em></div> : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientReports;
