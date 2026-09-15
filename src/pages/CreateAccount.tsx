import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PasswordInput from "../pages/admin/AdminDashboard/components/PasswordInput";
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

    setServerError("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Enter a valid 11-digit phone number (01XXXXXXXXX).";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 4) {
      newErrors.password =
        "Password must be at least 4 characters.";
    }

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
        setServerError(
          data.message || "Registration failed."
        );
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
            <span>
              Your account has been created. Redirecting to
              login...
            </span>
          </div>
        </div>
      )}

      <div className="create-account-page">
        <div className="create-account-card">

          <div className="create-account-logo">
            Rentwise
          </div>

          <h1>Create Account</h1>

          <p className="create-account-subtitle">
            Create your Rentwise account and start your journey
          </p>

          <form onSubmit={handleSubmit}>

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

            <div className="create-form-group">
              <label>
                Password{" "}
                <span className="required-star">*</span>
              </label>

              <PasswordInput
                id="password"
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

            <div className="create-form-group">
              <label>
                Confirm Password{" "}
                <span className="required-star">*</span>
              </label>

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
              />

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

            <button
              type="submit"
              className="create-account-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

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