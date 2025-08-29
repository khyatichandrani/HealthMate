import { useEffect, useState } from "react";
import axios from "axios";

const DoctorAppointments = ({ onSelectPatient }) => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/appointments", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAppointments(res.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/appointments/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAppointments();
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Pending Appointments</h3>
      {appointments.map(app => (
        <div key={app._id} className="border-b py-2">
          <p><b>Patient:</b> {app.patientId.name}</p>
          <p><b>Date:</b> {new Date(app.date).toLocaleDateString()}</p>
          <p><b>Reason:</b> {app.reason}</p>
          <p><b>Status:</b> {app.status}</p>
          {app.status === "pending" && (
            <>
              <button className="bg-green-500 text-white px-2 py-1 mr-2"
                onClick={() => updateStatus(app._id, "approved")}>Approve</button>
              <button className="bg-red-500 text-white px-2 py-1"
                onClick={() => updateStatus(app._id, "rejected")}>Reject</button>
            </>
          )}
          <button
            className="ml-4 text-blue-600 underline"
            onClick={() => onSelectPatient(app.patientId._id)}
          >
            View/Add Treatment
          </button>
        </div>
      ))}
    </div>
  );
};

export default DoctorAppointments;
