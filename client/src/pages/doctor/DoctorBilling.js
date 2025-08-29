import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this import
import "./DoctorBilling.css";

const DoctorBilling = () => {
  const navigate = useNavigate(); // Add this hook
  const [appointmentsWithTreatments, setAppointmentsWithTreatments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');
  const [generatingBill, setGeneratingBill] = useState(null);

  useEffect(() => {
    fetchAppointmentsWithTreatments();
    fetchDoctorBills();
  }, []);

  const fetchAppointmentsWithTreatments = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/bills/appointments-with-treatments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointmentsWithTreatments(response.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to fetch appointments with treatments");
    }
  };

  const fetchDoctorBills = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/bills/doctor-bills", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBills(response.data);
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError("Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  const generateBill = async (appointmentId) => {
    const confirmed = window.confirm("Are you sure you want to generate a bill for this appointment?");
    if (!confirmed) return;

    try {
      setGeneratingBill(appointmentId);
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/bills/generate/${appointmentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Bill generated successfully!");
      await fetchAppointmentsWithTreatments();
      await fetchDoctorBills();
    } catch (err) {
      console.error("Error generating bill:", err);
      alert("Failed to generate bill. Please try again.");
    } finally {
      setGeneratingBill(null);
    }
  };

  const markAsPaid = async (billId) => {
    const confirmed = window.confirm("Are you sure you want to mark this bill as paid?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/bills/pay/${billId}`, 
        { paymentMethod: "cash" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Bill marked as paid!");
      await fetchDoctorBills();
    } catch (err) {
      console.error("Error marking bill as paid:", err);
      alert("Failed to update bill status. Please try again.");
    }
  };

  // Updated function to navigate to patient history instead of showing alert
  const goToPatientHistory = (patient) => {
    navigate("/doctor/patient-history", {
      state: { patientId: patient._id, patient },
    });
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchAppointmentsWithTreatments(),
      fetchDoctorBills()
    ]);
  };

  if (loading) return <div className="loading">Loading billing information...</div>;

  return (
    <div className="doctor-billing">
      <div className="billing-header">
        <h2 className="page-title">Billing Management</h2>
        <button className="refresh-btn" onClick={refreshData} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}
      
      <div className="billing-tabs">
        <button 
          className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Generate Bills ({appointmentsWithTreatments.filter(appt => !appt.hasBill).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'bills' ? 'active' : ''}`}
          onClick={() => setActiveTab('bills')}
        >
          Generated Bills ({bills.length})
        </button>
      </div>

      {activeTab === 'appointments' && (
        <div className="appointments-section">
          <div className="section-header">
            <h3>Appointments Ready for Billing</h3>
            <p className="section-subtitle">
              {appointmentsWithTreatments.filter(appt => !appt.hasBill).length} appointments available for billing
            </p>
          </div>
          
          {appointmentsWithTreatments.filter(appt => !appt.hasBill).length > 0 ? (
            <div className="appointments-grid">
              {appointmentsWithTreatments
                .filter(appt => !appt.hasBill)
                .map(appt => (
                  <div key={appt._id} className="appointment-card">
                    <div className="card-header">
                      <span className="appointment-id">#{appt._id.slice(-6).toUpperCase()}</span>
                      <span className={`status-badge ${appt.status}`}>{appt.status}</span>
                    </div>

                    <div className="patient-info">
                      <h4>{appt.patientId?.name}</h4>
                      <div className="patient-details">
                        <p><span className="icon">📧</span> {appt.patientId?.email}</p>
                        <p><span className="icon">📱</span> {appt.patientId?.contact}</p>
                      </div>
                    </div>

                    <div className="appointment-details">
                      <div className="detail-item">
                        <span className="label">Date:</span>
                        <span className="value">{new Date(appt.date).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Time:</span>
                        <span className="value">{appt.scheduledTime}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Reason:</span>
                        <span className="value">{appt.reason}</span>
                      </div>
                    </div>

                    <div className="billing-actions">
                      <button 
                        className="view-treatment-btn"
                        onClick={() => goToPatientHistory(appt.patientId)}
                        title="View patient treatment history"
                      >
                        👁️ View History
                      </button>
                      <button 
                        className="generate-bill-btn"
                        onClick={() => generateBill(appt._id)}
                        disabled={generatingBill === appt._id}
                      >
                        {generatingBill === appt._id ? '⏳ Generating...' : '💳 Generate Bill'}
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">📋</div>
              <h3>No appointments ready for billing</h3>
              <p>All approved appointments have already been billed or no treatments are available.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bills' && (
        <div className="bills-section">
          <div className="section-header">
            <h3>Generated Bills</h3>
            <div className="bills-stats">
              <span className="stat-item paid">
                Paid: {bills.filter(bill => bill.status === 'paid').length}
              </span>
              <span className="stat-item unpaid">
                Unpaid: {bills.filter(bill => bill.status === 'unpaid').length}
              </span>
              <span className="stat-item total">
                Total: ₹{bills.reduce((sum, bill) => sum + bill.amount, 0)}
              </span>
            </div>
          </div>

          {bills.length > 0 ? (
            <div className="bills-table-container">
              <div className="bills-table">
                <table>
                  <thead>
                    <tr>
                      <th>Bill ID</th>
                      <th>Patient</th>
                      <th>Appointment Date</th>
                      <th>Bill Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map(bill => (
                      <tr key={bill._id} className={`bill-row ${bill.status}`}>
                        <td>
                          <span className="bill-id">#{bill._id.slice(-6).toUpperCase()}</span>
                        </td>
                        <td>
                          <div className="patient-cell">
                            <strong>{bill.patientId?.name}</strong>
                            <small>{bill.patientId?.email}</small>
                          </div>
                        </td>
                        <td>{new Date(bill.appointmentId?.date).toLocaleDateString()}</td>
                        <td>{new Date(bill.issuedDate).toLocaleDateString()}</td>
                        <td>
                          <span className="amount">₹{bill.amount}</span>
                        </td>
                        <td>
                          <span className={`status-pill ${bill.status}`}>
                            {bill.status === 'paid' ? '✅ Paid' : '⏳ Unpaid'}
                          </span>
                        </td>
                        <td>
                          {bill.status === 'unpaid' ? (
                            <div className="bill-actions-cell">
                              <button 
                                className="view-history-btn-small"
                                onClick={() => goToPatientHistory(bill.patientId)}
                                title="View patient history"
                              >
                                👁️
                              </button>
                              <button 
                                className="mark-paid-btn"
                                onClick={() => markAsPaid(bill._id)}
                              >
                                Mark as Paid
                              </button>
                            </div>
                          ) : (
                            <div className="paid-info">
                              <button 
                                className="view-history-btn-small"
                                onClick={() => goToPatientHistory(bill.patientId)}
                                title="View patient history"
                              >
                                👁️
                              </button>
                              <div className="paid-details">
                                <span className="paid-indicator">✓ Paid</span>
                                {bill.paidDate && (
                                  <small>on {new Date(bill.paidDate).toLocaleDateString()}</small>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">💰</div>
              <h3>No bills generated yet</h3>
              <p>Generate bills from the appointments tab to see them here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorBilling;
