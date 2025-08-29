import React, { useEffect, useState } from "react";
import axios from "axios";

const BillsList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/bills/my-bills", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setBills(res.data);
        setLoading(false);
      })
      .catch(err => {
        setBills([]);
        setLoading(false);
      });
  }, []);

  const handlePay = (billId) => {
    const token = localStorage.getItem("token");
    axios
      .post(`http://localhost:5000/api/bills/pay/${billId}`, { paymentMethod: "cash" }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        alert("Bill marked as paid!");
        // Refresh bills
        setBills(bills.map(bill => bill._id === billId ? { ...bill, status: "paid" } : bill));
      });
  };

  if (loading) return <p>Loading bills...</p>;
  if (!bills.length) return <p>No bills found.</p>;

  return (
    <div>
      <h2>My Bills</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Doctor</th>
            <th>Appointment</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <tr key={bill._id}>
              <td>{new Date(bill.issuedDate).toLocaleDateString()}</td>
              <td>{bill.doctorId?.name}</td>
              <td>{bill.appointmentId?._id}</td>
              <td>₹{bill.amount}</td>
              <td>{bill.status}</td>
              <td>
                {bill.status === "unpaid"
                  ? <button onClick={() => handlePay(bill._id)}>Mark as Paid</button>
                  : "Paid"
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillsList;
