import { useState } from "react";
import "./CreateAdmin.css";

interface CreateAdminProps {
  onBack: () => void;
}

function CreateAdmin({ onBack }: CreateAdminProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const name = formData.name.trim();
    const phone = formData.phone.trim();

    if (!name) {
      newErrors.name = "Name is required.";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^01[0-9]{9}$/.test(phone)) {
      newErrors.phone =
        "Enter a valid 11-digit phone number (01XXXXXXXXX).";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setServerError(
          data.message || "Failed to create admin."
        );
        return;
      }

      setSuccessMessage(
        "Admin created successfully! Default password: 1234. Please change it after the first login."
      );

      setFormData({
        name: "",
        phone: "",
      });
    } catch (error) {
      console.error("Create Admin Error:", error);

      setServerError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-admin">
      <button
        type="button"
        className="create-admin-back"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="create-admin-header">
        <h2>Create Admin</h2>
        <p>Create a new Rentwise administrator account.</p>
      </div>

      <div className="create-admin-card">
        <form onSubmit={handleSubmit}>
          <div className="create-admin-form-group">
            <label htmlFor="admin-name">
              Full Name
            </label>

            <input
              id="admin-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter admin's full name"
            />

            {errors.name && (
              <p className="create-admin-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="create-admin-form-group">
            <label htmlFor="admin-phone">
              Phone Number
            </label>

            <input
              id="admin-phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              maxLength={11}
              inputMode="numeric"
            />

            {errors.phone && (
              <p className="create-admin-error">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="default-password-info">
            <strong>Default Password:</strong>
            <span>1234</span>
            <p>
              The admin should change this password after
              the first login.
            </p>
          </div>

          {serverError && (
            <div className="create-admin-server-error">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="create-admin-success">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            className="create-admin-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating Admin..."
              : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAdmin;