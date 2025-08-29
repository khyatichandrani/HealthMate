import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./doctordash.css"; // See CSS below

const DoctorDashboardLayout = () => (
  <div className="doctor-dashboard-root">
    <Navbar />
    <div className="doctor-dashboard-layout">
      <aside className="doctor-dashboard-sidebar">
        <nav>
          <NavLink to="appointments" className="side-link">Pending Appointments</NavLink>
          <NavLink to="add-treatment" className="side-link">Add Treatment</NavLink>
          {/* Add more as your UX/flow grows */}
        </nav>
      </aside>
      <main className="doctor-dashboard-main">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DoctorDashboardLayout;
