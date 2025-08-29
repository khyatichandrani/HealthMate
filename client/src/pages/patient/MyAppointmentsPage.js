import AppointmentsList from "../../components/AppointmentsList";
import "./MyAppointmentsPage.css"; // Add this file for styling

const MyAppointmentsPage = () => (
  <div className="my-appointments-container">
    <h2 className="my-appointments-title">My Appointments</h2>
    <div className="my-appointments-list-wrapper">
      <AppointmentsList />
    </div>
  </div>
);

export default MyAppointmentsPage;
