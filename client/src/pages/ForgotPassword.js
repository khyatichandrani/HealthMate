import { useState } from "react";
import axios from "axios";
import { FiMail, FiCheckCircle } from "react-icons/fi";
import "./forgot-password.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        `${process.env.REACT_APP_API || "http://localhost:5000"}/api/auth/forgot-password`,
        { email }
      );
      setSent(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  };

  return (
    <div className="forgot-bg">
      <form className="forgot-card" onSubmit={handleSubmit}>
        <h2 className="forgot-title">Forgot Password</h2>
        <p className="forgot-subtitle">
          Enter your email and we’ll send you a reset link.
        </p>
        {sent ? (
          <div className="forgot-success">
            <FiCheckCircle size={36} />
            <div>Check your email for the password reset link.</div>
            <div className="forgot-success-sub">
              Didn’t get it? <span className="forgot-resend" onClick={() => setSent(false)}>Resend</span>
            </div>
            <Link to="/login" className="forgot-link-back">Back to Login</Link>
          </div>
        ) : (
          <>
            <div className="forgot-field">
              <label htmlFor="email">Email</label>
              <div className="forgot-input-icon">
                <input
                  id="email"
                  type="email"
                  className={error ? "invalid" : ""}
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <span className="forgot-mailicon">
                  <FiMail />
                </span>
              </div>
            </div>
            {error && <div className="forgot-error">{error}</div>}
            <button
              type="submit"
              className="forgot-btn"
              disabled={!email}
            >
              Send Reset Link
            </button>
            <Link to="/login" className="forgot-link-back">Back to Login</Link>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
