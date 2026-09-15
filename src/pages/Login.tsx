import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
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

    setErrors({
      ...errors,
      [name]: "",
    });

    setServerError("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^01[0-9]{9}$/.test(formData.phone.trim())) {
      newErrors.phone =
        "Enter a valid 11-digit phone number (01XXXXXXXXX).";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/customer/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formData.phone.trim(),
            password: formData.password,
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

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save customer information
      localStorage.setItem(
        "customer",
        JSON.stringify(data.customer)
      );

      // Login successful
      navigate("/");
    } catch (error) {
      console.error("Customer Login Error:", error);

      setServerError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
        <button
  type="button"
  className="login-logo"
  onClick={() => navigate("/")}
>
  Rentwise
</button>
        </div>

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to continue your journey with Rentwise
        </p>

        <form onSubmit={handleSubmit}>

          {/* ================= PHONE NUMBER ================= */}
          <div className="login-form-group">
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

            {errors.phone && (
              <p className="form-error">
                {errors.phone}
              </p>
            )}
          </div>

          {/* ================= PASSWORD ================= */}
          <div className="login-form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            {errors.password && (
              <p className="form-error">
                {errors.password}
              </p>
            )}
          </div>

          {/* ================= SERVER ERROR ================= */}
          {serverError && (
            <div className="server-error">
              {serverError}
            </div>
          )}

          {/* ================= OPTIONS ================= */}
          <div className="login-options">

            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot Password?
            </button>

          </div>

          {/* ================= LOGIN BUTTON ================= */}
          <button
            type="submit"
            className="login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* ================= DIVIDER ================= */}
        <div className="login-divider">
          <span>OR</span>
        </div>

        {/* ================= CUSTOMER REGISTRATION ================= */}
        <p className="register-text">
          Don't have an account?

          <button
            type="button"
            className="register-link"
            onClick={() => navigate("/create-account")}
          >
            Create Account
          </button>
        </p>

        {/* ================= ADMIN LOGIN ================= */}
        <div className="admin-login-section">

          <span>Are you an administrator?</span>

          <button
            type="button"
            className="admin-login-link"
            onClick={() => navigate("/admin-login")}
          >
            Admin Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;