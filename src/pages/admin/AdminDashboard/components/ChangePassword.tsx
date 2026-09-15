import { useState } from "react";
import type { FormEvent } from "react";
import "./ChangePassword.css";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 4) {
      setError("New password must be at least 4 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/change-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to change password.");
        return;
      }

      setMessage(data.message || "Password updated successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Change Password Error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="change-password-section">

      <div className="change-password-header">
        <div>
          <h2>Update Password</h2>
          <p>
            Change your account password securely.
          </p>
        </div>

        <div className="password-icon">
          🔐
        </div>
      </div>

      {message && (
        <div className="change-password-success">
          {message}
        </div>
      )}

      {error && (
        <div className="change-password-error">
          {error}
        </div>
      )}

      <form
        className="change-password-form"
        onSubmit={handleSubmit}
      >

        <div className="password-form-group">
          <label htmlFor="currentPassword">
            Current Password
          </label>

          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            placeholder="Enter current password"
            autoComplete="current-password"
          />
        </div>

        <div className="password-form-group">
          <label htmlFor="newPassword">
            New Password
          </label>

          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            placeholder="Enter new password"
            autoComplete="new-password"
          />

          <small>
            Minimum 4 characters
          </small>
        </div>

        <div className="password-form-group">
          <label htmlFor="confirmPassword">
            Confirm New Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
        </div>

        <button
          className="change-password-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

      </form>

    </section>
  );
}

export default ChangePassword;
