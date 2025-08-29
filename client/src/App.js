import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProfilePage from "./pages/ProfilePage";

// Patient dashboard and pages
import PatientDashboardLayout from "./pages/patient/PatientDashboard";
import BookAppointmentPage from "./pages/patient/BookAppointmentPage";
import MyAppointmentsPage from "./pages/patient/MyAppointmentsPage";
import MedicalHistoryPage from "./pages/patient/MedicalHistoryPage";

// Doctor dashboard and pages
import DoctorDashboardLayout from "./pages/doctor/DoctorDashboardLayout";
import Appointments from "./pages/doctor/Appointments";
import PendingAppointments from "./pages/doctor/PendingAppointments";
import AddTreatment from "./pages/doctor/AddTreatment";
import Patients from "./pages/doctor/Patients";
import PatientHistory from './pages/doctor/PatientHistory'; // Adjust path as needed

import DoctorBilling from './pages/doctor/DoctorBilling';
import PatientBills from './pages/patient/PatientBills';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Profile (protected, you may implement protected routes as needed) */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Patient Dashboard with nested pages */}
          <Route path="/patient" element={<PatientDashboardLayout />}>
            <Route index element={<BookAppointmentPage />} /> {/* Default /patient */}
            <Route path="book" element={<BookAppointmentPage />} />
            <Route path="appointments" element={<MyAppointmentsPage />} />
            <Route path="/patient/bills" element={<PatientBills />} />
            <Route path="history" element={<MedicalHistoryPage />} />
          </Route>

          {/* Doctor Dashboard with nested pages */}
           <Route path="doctor" element={<DoctorDashboardLayout />}>
              <Route path="/doctor/billing" element={<DoctorBilling />} />
              <Route index element={<Appointments />} />  {/* This makes /doctor default to Appointments */}
              <Route path="appointments" element={<Appointments />} />
              <Route path="pending-appointments" element={<PendingAppointments />} />
              <Route path="add-treatment" element={<AddTreatment />} />
              <Route path="patients" element={<Patients />} />
              <Route path="/doctor/patient-history" element={<PatientHistory />} />
          </Route>

          {/* Optional: Add a catch-all 404 or redirect route here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
