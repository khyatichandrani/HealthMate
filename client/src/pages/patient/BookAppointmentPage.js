import AppointmentForm from "../../components/AppointmentForm";
import "./BookAppointmentPage.css"; // Create this file (see below)

const BookAppointmentPage = () => (
  <div className="book-appointment-container">
    <h2 className="book-appointment-title">Book a New Appointment</h2>
    <p className="book-appointment-desc">
      Select your doctor, choose a date, and tell us your reason. Our doctors will confirm your slot as soon as possible.
    </p>
    <div className="book-appointment-form-wrapper">
      <AppointmentForm />
    </div>
  </div>
);

export default BookAppointmentPage;
