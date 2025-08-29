// PatientDashboardLayout.js (your existing file)
import { NavLink, Outlet } from "react-router-dom";
import "./patientdash.css";

const PatientDashboardLayout = () => (
  <div className="dashboard-root">
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <nav>
          <NavLink to="book" className="side-link">Book Appointment</NavLink>
          <NavLink to="appointments" className="side-link">My Appointments</NavLink>
          <NavLink to="history" className="side-link">Medical History</NavLink>
          <NavLink to="bills" className="side-link">My Bills</NavLink> {/* NEW */}
        </nav>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  </div>
);

export default PatientDashboardLayout;
