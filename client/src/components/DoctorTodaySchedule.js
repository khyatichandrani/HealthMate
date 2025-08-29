import React from "react";

const DoctorTodaySchedule = ({ appointments, onApprove, onReject, loading }) => {
  if (loading) return <p>Loading today's schedule…</p>;

  if (!appointments.length) return <p>No appointments scheduled for today.</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#232259", color: "white" }}>
          <th style={{ padding: "10px", textAlign: "left" }}>Slot #</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Time</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Patient</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(appt => (
          <tr key={appt._id} style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>{appt.slotNumber || "-"}</td>
            <td style={{ padding: "10px" }}>{appt.scheduledTime}</td>
            <td style={{ padding: "10px" }}>
              {appt.patientId?.name || "Unknown"} <br />
              <small>{appt.patientId?.email}</small>
            </td>
            <td style={{ padding: "10px", textTransform: "capitalize" }}>{appt.status}</td>
            <td style={{ padding: "10px" }}>
              {appt.status === "pending" ? (
                <>
                  <button
                    onClick={() => onApprove(appt._id)}
                    style={{
                      marginRight: "8px",
                      backgroundColor: "#60cdec",
                      border: "none",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(appt._id)}
                    style={{
                      backgroundColor: "#e55353",
                      border: "none",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </>
              ) : (
                <em>No actions</em>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DoctorTodaySchedule;
