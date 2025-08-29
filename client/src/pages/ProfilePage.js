import { useContext } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { AuthContext } from "../context/AuthContext";
import { FiUser, FiMail, FiBriefcase, FiLogOut } from "react-icons/fi";
import "./profile.css";
import avatarFallback from "../assets/logo.png"; // fallback avatar image

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // 2. Get navigate function

  const handleLogout = () => {
    logout();
    navigate("/login"); // 3. Redirect to login after logout
  };

  return (
    <div className="profile-fullpage">
      <header className="profile-header">
        <div className="profile-header-content">
          <img
            src={user?.avatar || avatarFallback}
            alt="Avatar"
            className="profile-header-avatar"
          />
          <div>
            <h1 className="profile-header-name">{user?.name}</h1>
            <span className="profile-header-role">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </span>
          </div>
          <button className="profile-logout-btn" onClick={handleLogout}>
            <FiLogOut style={{ marginRight: 6, fontSize: "1.07em" }} /> Logout
          </button>
        </div>
      </header>
      <main className="profile-main">
        <section className="profile-section">
          <h2>User Information</h2>
          <ul>
            <li><FiMail className="profile-icon" /> <b>Email:</b> {user?.email}</li>
            {user?.age && <li><span className="profile-icon">🎂</span> <b>Age:</b> {user.age}</li>}
            {user?.gender && <li><span className="profile-icon">⚧️</span> <b>Gender:</b> {user.gender}</li>}
            {user?.contact && <li><span className="profile-icon">📞</span> <b>Contact:</b> {user.contact}</li>}
            {user?.role === "doctor" && user?.specialization && (
              <li><span className="profile-icon">🩺</span> <b>Specialization:</b> {user.specialization}</li>
            )}
          </ul>
        </section>
        {/* Add more full-width sections as your app grows: */}
        {/* <section className="profile-section"> ... </section> */}
      </main>
    </div>
  );
};

export default ProfilePage;
