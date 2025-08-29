import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PatientBills.css";

const PatientBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/bills/my-bills", {
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

  const handlePay = async (billId) => {
    const confirmed = window.confirm("Are you sure you want to mark this bill as paid?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/bills/pay/${billId}`, 
        { paymentMethod: "online" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Bill marked as paid successfully!");
      fetchBills(); // Refresh bills
    } catch (err) {
      console.error("Error marking bill as paid:", err);
      alert("Failed to process payment. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading your bills...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="patient-bills">
      <h2 className="page-title">My Bills</h2>
      
      {bills.length > 0 ? (
        <div className="bills-container">
          <div className="bills-summary">
            <div className="summary-card total">
              <h3>Total Bills</h3>
              <span className="count">{bills.length}</span>
            </div>
            <div className="summary-card unpaid">
              <h3>Unpaid Bills</h3>
              <span className="count">{bills.filter(bill => bill.status === 'unpaid').length}</span>
            </div>
            <div className="summary-card paid">
              <h3>Paid Bills</h3>
              <span className="count">{bills.filter(bill => bill.status === 'paid').length}</span>
            </div>
            <div className="summary-card amount">
              <h3>Total Amount</h3>
              <span className="amount">₹{bills.reduce((sum, bill) => sum + bill.amount, 0)}</span>
            </div>
          </div>

          <div className="bills-grid">
            {bills.map(bill => (
              <div key={bill._id} className={`bill-card ${bill.status}`}>
                <div className="bill-header">
                  <div className="bill-id">Bill #{bill._id.slice(-6).toUpperCase()}</div>
                  <div className={`bill-status ${bill.status}`}>
                    {bill.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="bill-details">
                  <div className="detail-row">
                    <span className="label">Doctor:</span>
                    <span className="value">{bill.doctorId?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Appointment Date:</span>
                    <span className="value">
                      {new Date(bill.appointmentId?.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Bill Date:</span>
                    <span className="value">
                      {new Date(bill.issuedDate).toLocaleDateString()}
                    </span>
                  </div>
                  {bill.paidDate && (
                    <div className="detail-row">
                      <span className="label">Paid Date:</span>
                      <span className="value">
                        {new Date(bill.paidDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bill-items">
                  <h4>Services:</h4>
                  {bill.items?.map((item, index) => (
                    <div key={index} className="item-row">
                      <span className="item-description">{item.description}</span>
                      <span className="item-fee">₹{item.fee}</span>
                    </div>
                  ))}
                </div>

                <div className="bill-footer">
                  <div className="total-amount">
                    <strong>Total: ₹{bill.amount}</strong>
                  </div>
                  <div className="bill-actions">
                    {bill.status === 'unpaid' ? (
                      <button 
                        className="pay-btn"
                        onClick={() => handlePay(bill._id)}
                      >
                        Pay Now
                      </button>
                    ) : (
                      <div className="paid-indicator">
                        ✅ Paid on {new Date(bill.paidDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-bills">
          <div className="no-bills-icon">📄</div>
          <h3>No Bills Yet</h3>
          <p>You don't have any bills at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default PatientBills;
