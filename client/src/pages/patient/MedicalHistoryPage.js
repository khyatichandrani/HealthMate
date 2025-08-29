import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ReportUploader from "../../components/ReportUploader";
import HistoryList from "../../components/HistoryList";
import "./MedicalHistoryPage.css";

const MedicalHistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [showUpload, setShowUpload] = useState(false);

  // Optionally, close form after upload. You can lift a callback to do so.

  return (
    <div className="history-container">
      <h2 className="history-title">Medical History & Reports</h2>
      <p className="history-desc">
        Upload new medical reports and view your treatment history.
      </p>

      {!showUpload && (
        <button
          className="show-upload-btn"
          onClick={() => setShowUpload(true)}
        >
          + Upload Document
        </button>
      )}

      {showUpload && (
        <div className="history-upload">
          <ReportUploader
            onUpload={() => setShowUpload(false)} // Optionally close on upload
          />
          <button className="cancel-upload-btn" onClick={() => setShowUpload(false)}>
            Cancel
          </button>
        </div>
      )}

      <div className="history-list-wrapper">
        <HistoryList patientId={user?._id} />
      </div>
    </div>
  );
};

export default MedicalHistoryPage;
