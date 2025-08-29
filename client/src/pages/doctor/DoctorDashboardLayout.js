import { Outlet, NavLink } from "react-router-dom";
import "./doctordash.css";

const DoctorDashboardLayout = () => {
  return (
    <div className="doctor-dashboard-root">
      <div className="doctor-dashboard-layout">
        {/* Sidebar */}
        <aside className="doctor-dashboard-sidebar">
          <nav>
            <NavLink to="appointments" className={({ isActive }) => (isActive ? "side-link active" : "side-link")}>
              Today's Appointments
            </NavLink>
            <NavLink to="pending-appointments" className={({ isActive }) => (isActive ? "side-link active" : "side-link")}>
              Pending Appointments
            </NavLink>
            <NavLink to="patients" className={({ isActive }) => (isActive ? "side-link active" : "side-link")}>
              My Patients
            </NavLink>
            <NavLink to="billing" className={({ isActive }) => (isActive ? "side-link active" : "side-link")}>
              Billing Management
            </NavLink> 
          </nav>
        </aside>

        {/* Main content */}
        <main className="doctor-dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboardLayout;
