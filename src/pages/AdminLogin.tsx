import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-logo">
          Rentwise
        </div>

        <div className="admin-badge">
          ADMIN PORTAL
        </div>

        <h1>Admin Login</h1>

        <p className="admin-login-subtitle">
          Login to manage the Rentwise system
        </p>

        <form>

          <div className="admin-form-group">
            <label>Phone Number</label>

            <input
              type="text"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="admin-login-options">

            <label className="admin-remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="admin-forgot-password"
            >
              Forgot Password?
            </button>

          </div>

          <button
            type="submit"
            className="admin-login-submit"
          >
            Login
          </button>

        </form>

        <button
          type="button"
          className="back-to-login"
          onClick={() => navigate("/login")}
        >
          ← Back to Customer Login
        </button>

      </div>

    </div>
  );
}

export default AdminLogin;