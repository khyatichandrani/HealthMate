import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import DoctorAppointments from "../../components/DoctorAppointments";
import AddTreatmentForm from "../../components/AddTreatmentForm";
import PatientHistoryViewer from "../../components/PatientHistoryViewer";

const DoctorAppointmentsPage = () => {
  const { user } = useContext(AuthContext);
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div>
      <h1 className="dashboard-title">Welcome, Dr. {user?.name}</h1>
      <DoctorAppointments onSelectPatient={setSelectedPatient} />
      {selectedPatient && (
        <>
          <AddTreatmentForm patientId={selectedPatient} />
          <PatientHistoryViewer patientId={selectedPatient} />
        </>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
