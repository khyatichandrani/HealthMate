import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import "./reset-password.css";

const MIN_LENGTH = 6;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const pwdValid = password.length >= MIN_LENGTH;
  const match = password && confirm && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!pwdValid) {
      setError(`Password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (!match) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API || "http://localhost:5000"}/api/auth/reset-password/${token}`, { password });
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="reset-bg">
      <form onSubmit={handleSubmit} className="reset-card">
        <h2 className="reset-title">Reset Your Password</h2>
        <p className="reset-subtitle">
          Enter your new password twice to confirm. Make it strong and unique!
        </p>
        {done ? (
          <div className="reset-success">
            <FiCheckCircle size={36} />
            <div>Password updated!</div>
            <div className="reset-success-sub">Redirecting to login…</div>
          </div>
        ) : (
          <>
            <div className="reset-field">
              <label htmlFor="new-password">New Password</label>
              <div className="reset-input-icon">
                <input
                  id="new-password"
                  type={showPwd ? "text" : "password"}
                  className={password === "" ? "" : pwdValid ? "valid" : "invalid"}
                  placeholder="Enter new password"
                  value={password}
                  minLength={MIN_LENGTH}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  className="reset-eye"
                  onClick={() => setShowPwd((v) => !v)}
                  tabIndex={-1}
                >
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <span className={pwdValid ? "reset-helper success" : "reset-helper error"}>
                {password === ""
                  ? ""
                  : pwdValid
                  ? "Good! Password length sufficient."
                  : "At least 6 characters"}
              </span>
            </div>
            <div className="reset-field">
              <label htmlFor="confirm-password">Repeat Password</label>
              <div className="reset-input-icon">
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  className={confirm === "" ? "" : match ? "valid" : "invalid"}
                  placeholder="Repeat new password"
                  value={confirm}
                  minLength={MIN_LENGTH}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="reset-eye"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {confirm && (
                <span className={match ? "reset-helper success" : "reset-helper error"}>
                  {match ? "Passwords match" : "Passwords do not match"}
                </span>
              )}
            </div>
            {error && <div className="reset-error">{error}</div>}
            <button
              type="submit"
              className="reset-btn"
              disabled={!pwdValid || !match}
            >
              Update Password
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
