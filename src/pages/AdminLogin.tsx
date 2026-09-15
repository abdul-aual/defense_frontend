import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PasswordInput from "../pages/admin/AdminDashboard/components/PasswordInput";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setServerError("");

    const phone = formData.phone.trim();
    const password = formData.password;

    if (!phone || !password) {
      setServerError("Phone number and password are required.");
      return;
    }

    if (!/^01[0-9]{9}$/.test(phone)) {
      setServerError(
        "Enter a valid 11-digit phone number (01XXXXXXXXX)."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setServerError(
          data.message || "Invalid phone number or password."
        );
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Admin Login Error:", error);

      setServerError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <button
          type="button"
          className="admin-login-logo"
          onClick={() => navigate("/")}
        >
          Rentwise
        </button>

        <div className="admin-badge">
          ADMIN PORTAL
        </div>

        <h1>Admin Login</h1>

        <p className="admin-login-subtitle">
          Login to manage the Rentwise system
        </p>

        <form onSubmit={handleSubmit}>

          <div className="admin-form-group">
            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              maxLength={11}
              inputMode="numeric"
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>

            <PasswordInput
              id="admin-login-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          {serverError && (
            <div className="admin-server-error">
              {serverError}
            </div>
          )}

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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
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
