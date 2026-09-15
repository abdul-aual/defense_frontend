import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CreateAccount.css";

function CreateAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
const [serverError, setServerError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

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
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full Name
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Enter a valid 11-digit phone number (01XXXXXXXXX).";
    }

    // Email - Optional
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 4) {
      newErrors.password =
        "Password must be at least 4 characters.";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
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
        "http://localhost:5000/api/customer/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim() || null,
            password: formData.password,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        setServerError(data.message || "Registration failed.");
        return;
      }
  
      setShowSuccess(true);

setTimeout(() => {
  navigate("/login");
}, 2000);
    } catch (error) {
      console.error("Registration Error:", error);
  
      setServerError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<>
    {showSuccess && (
        <div className="success-toast">
          <div className="success-icon">✓</div>
      
          <div className="success-content">
            <strong>Account Created Successfully</strong>
            <span>Your account has been created. Redirecting to login...</span>
          </div>
        </div>
      )}

    <div className="create-account-page">

      <div className="create-account-card">

        {/* Logo */}
        <div className="create-account-logo">
          Rentwise
        </div>

        {/* Heading */}
        <h1>Create Account</h1>

        <p className="create-account-subtitle">
          Create your Rentwise account and start your journey
        </p>

        <form onSubmit={handleSubmit}>

          {/* ================= FULL NAME ================= */}
          <div className="create-form-group">

            <label>
              Full Name{" "}
              <span className="required-star">*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

            {errors.name && (
              <p className="form-error">
                {errors.name}
              </p>
            )}

          </div>

          {/* ================= PHONE NUMBER ================= */}
          <div className="create-form-group">

            <label>
              Phone Number{" "}
              <span className="required-star">*</span>
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              maxLength={11}
              inputMode="numeric"
            />

            {errors.phone && (
              <p className="form-error">
                {errors.phone}
              </p>
            )}

          </div>

          {/* ================= EMAIL ================= */}
          <div className="create-form-group">

            <label>
              Email{" "}
              <span className="optional-text">
                (Optional)
              </span>
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />

            {errors.email && (
              <p className="form-error">
                {errors.email}
              </p>
            )}

          </div>

          {/* ================= PASSWORD ================= */}
          <div className="create-form-group">

            <label>
              Password{" "}
              <span className="required-star">*</span>
            </label>

            <div className="password-input-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />

              <button
                type="button"
                className="password-eye"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword ? (

                  /* ================= EYE OFF ================= */
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >

                    <path
                      d="M3 3L21 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M9.88 5.09C10.56 4.9 11.26 4.8 12 4.8C16.5 4.8 20.18 7.65 21.5 12C21.05 13.48 20.3 14.78 19.35 15.85"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M6.61 6.61C4.98 7.75 3.7 9.62 3 12C4.32 16.35 8 19.2 12 19.2C13.17 19.2 14.29 18.98 15.32 18.58"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                  </svg>

                ) : (

                  /* ================= EYE ================= */
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >

                    <path
                      d="M2.5 12C3.8 7.65 7.5 4.8 12 4.8C16.5 4.8 20.2 7.65 21.5 12C20.2 16.35 16.5 19.2 12 19.2C7.5 19.2 3.8 16.35 2.5 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                  </svg>

                )}

              </button>

            </div>

            {errors.password && (
              <p className="form-error">
                {errors.password}
              </p>
            )}

          </div>

          {/* ================= CONFIRM PASSWORD ================= */}
          <div className="create-form-group">

            <label>
              Confirm Password{" "}
              <span className="required-star">*</span>
            </label>

            <div className="password-input-wrapper">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
              />

              <button
                type="button"
                className="password-eye"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showConfirmPassword ? (

                  /* ================= EYE OFF ================= */
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >

                    <path
                      d="M3 3L21 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M9.88 5.09C10.56 4.9 11.26 4.8 12 4.8C16.5 4.8 20.18 7.65 21.5 12C21.05 13.48 20.3 14.78 19.35 15.85"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M6.61 6.61C4.98 7.75 3.7 9.62 3 12C4.32 16.35 8 19.2 12 19.2C13.17 19.2 14.29 18.98 15.32 18.58"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                  </svg>

                ) : (

                  /* ================= EYE ================= */
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >

                    <path
                      d="M2.5 12C3.8 7.65 7.5 4.8 12 4.8C16.5 4.8 20.2 7.65 21.5 12C20.2 16.35 16.5 19.2 12 19.2C7.5 19.2 3.8 16.35 2.5 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                  </svg>

                )}

              </button>

            </div>

            {errors.confirmPassword && (
              <p className="form-error">
                {errors.confirmPassword}
              </p>
            )}

          </div>



          {serverError && (
  <div className="server-error">
    {serverError}
  </div>
)}


          {/* ================= CREATE ACCOUNT BUTTON ================= */}
          <button
  type="submit"
  className="create-account-btn"
  disabled={isSubmitting}
>
  {isSubmitting ? "Creating Account..." : "Create Account"}
</button>

        </form>

        {/* ================= LOGIN ================= */}
        <p className="already-account">

          Already have an account?

          <button
            type="button"
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </p>

      </div>

    </div>
    </>
  );
}

export default CreateAccount;