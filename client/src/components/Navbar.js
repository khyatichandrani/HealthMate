import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

// Enhanced Navbar with animated interactive link hover
const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [hovered, setHovered] = useState(null);

  // Dynamic link style for hover effect
  const getLinkStyle = (which) => ({
    ...styles.link,
    ...(hovered === which
      ? {
          background: "linear-gradient(90deg,#71e2f3 0%,#ad2be8 100%)",
          color: "#fff",
          boxShadow: "0 2px 12px #3b51e655",
          transform: "translateY(-2px) scale(1.06)",
          textDecoration: "none",
        }
      : {})
  });

  return (
    <nav style={styles.nav}>
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img width="40%" src={logo} alt="Logo" />
      </Link>
      <div style={styles.menu}>
        {!user ? (
          <>
            <Link
              to="/login"
              style={getLinkStyle("login")}
              onMouseEnter={() => setHovered("login")}
              onMouseLeave={() => setHovered(null)}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={getLinkStyle("register")}
              onMouseEnter={() => setHovered("register")}
              onMouseLeave={() => setHovered(null)}
            >
              Register
            </Link>
          </>
        ) : (
          <Link
            to="/profile"
            style={getLinkStyle("profile")}
            onMouseEnter={() => setHovered("profile")}
            onMouseLeave={() => setHovered(null)}
          >
            Profile
          </Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#232259',
    paddingLeft: '32px',
    paddingRight: '32px',
    color: 'white',
    boxShadow: '0 1px 10px 0 #23225918',
    position: "sticky",
    top: 0,
    zIndex: 20,
  },
  brandText: {
    fontSize: "1.44rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "1px"
  },
  menu: {
    display: 'flex',
    gap: '26px',
    alignItems: 'center',
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "1rem",
    borderRadius: "6px",
    position: "relative",
    overflow: "hidden",
    transition: "background 0.18s, color 0.16s, box-shadow 0.16s, transform 0.12s",
    boxShadow: "0 1px 4px 0 #23225913",
    cursor: "pointer",
    outline: "none",
    border: "none",
    minWidth: "88px",
    textAlign: "center"
  }
};

export default Navbar;
