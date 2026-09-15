import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

interface CustomerProfile {
  id: number;
  name: string;
  email: string | null;
  created_at: string;
}

function Profile() {
  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState<CustomerProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [isUpdateMode, setIsUpdateMode] =
    useState(false);

  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [updateError, setUpdateError] =
    useState("");

  const [updateSuccess, setUpdateSuccess] =
    useState("");

  const [isUpdating, setIsUpdating] =
    useState(false);

  // ================= FETCH PROFILE =================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/customer/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("customer");

          navigate("/login");
          return;
        }

        setCustomer(data.customer);
      } catch (error) {
        console.error("Profile Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");

    navigate("/login");
  };

  // ================= OPEN UPDATE MODE =================

  const handleOpenUpdate = () => {
    /*
      Only the actual email from the database is loaded.

      If email is NULL:
      input remains completely blank.

      Phone number is never used here.
    */
    setEmail(customer?.email || "");

    /*
      Password fields are ALWAYS cleared.
      Saved passwords should never be loaded into React state.
    */
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setUpdateError("");
    setUpdateSuccess("");

    setIsUpdateMode(true);
  };

  // ================= CANCEL UPDATE =================

  const handleCancelUpdate = () => {
    /*
      Nothing is sent to the backend.
      Therefore, nothing gets saved.
    */

    setEmail("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setUpdateError("");
    setUpdateSuccess("");

    setIsUpdateMode(false);
  };

  // ================= UPDATE PROFILE =================

  const handleUpdateProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setUpdateError("");
    setUpdateSuccess("");

    const trimmedEmail = email.trim();

    const hasEmail =
      trimmedEmail.length > 0;

    const hasNewPassword =
      newPassword.length > 0;

    const hasCurrentPassword =
      currentPassword.length > 0;

    const hasConfirmPassword =
      confirmPassword.length > 0;

    // ================= NOTHING TO UPDATE =================

    if (
      !hasEmail &&
      !hasNewPassword &&
      !hasCurrentPassword &&
      !hasConfirmPassword
    ) {
      setUpdateError(
        "Please enter something to update."
      );

      return;
    }

    // ================= EMAIL VALIDATION =================

    if (hasEmail) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmedEmail)) {
        setUpdateError(
          "Please provide a valid email address."
        );

        return;
      }
    }

    // ================= PASSWORD VALIDATION =================

    if (
      hasNewPassword ||
      hasCurrentPassword ||
      hasConfirmPassword
    ) {
      if (!hasCurrentPassword) {
        setUpdateError(
          "Old password is required to change password."
        );

        return;
      }

      if (!hasNewPassword) {
        setUpdateError(
          "New password is required."
        );

        return;
      }

      if (newPassword.length < 4) {
        setUpdateError(
          "New password must be at least 4 characters."
        );

        return;
      }

      if (!hasConfirmPassword) {
        setUpdateError(
          "Please confirm your new password."
        );

        return;
      }

      if (
        newPassword !== confirmPassword
      ) {
        setUpdateError(
          "New passwords do not match."
        );

        return;
      }
    }

    // ================= TOKEN CHECK =================

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // ================= BUILD REQUEST DATA =================

    const updateData: {
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    } = {};

    /*
      Email is only sent if the user actually
      entered an email.

      Therefore, changing only the password
      will NOT touch the existing email.
    */
    if (hasEmail) {
      updateData.email = trimmedEmail;
    }

    /*
      Password fields are only sent when the
      user actually enters a new password.
    */
    if (hasNewPassword) {
      updateData.currentPassword =
        currentPassword;

      updateData.newPassword =
        newPassword;
    }

    // ================= SEND REQUEST =================

    setIsUpdating(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/customer/profile",
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      // ================= SERVER ERROR =================

      if (!response.ok) {
        setUpdateError(
          data.message ||
            "Unable to update profile."
        );

        return;
      }

      // ================= UPDATE LOCAL STATE =================

      setCustomer(data.customer);

      localStorage.setItem(
        "customer",
        JSON.stringify(data.customer)
      );

      setUpdateSuccess(
        "Profile updated successfully."
      );

      // Clear password fields after successful update.
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Close update mode after success message.
      setTimeout(() => {
        setIsUpdateMode(false);
        setUpdateSuccess("");
      }, 1200);

    } catch (error) {
      console.error(
        "Update Profile Error:",
        error
      );

      setUpdateError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // ================= MEMBER SINCE =================

  const formatMemberSince = (
    date: string
  ) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  // ================= PROFILE NOT FOUND =================

  if (!customer) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Unable to load profile.
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================

  return (
    <div className="profile-page">

      {/* ================= TOP BAR ================= */}

      <div className="profile-top-bar">

        <button
          className="home-button"
          onClick={() => navigate("/")}
        >
          ← Home
        </button>

      </div>

      {/* ================= PROFILE CARD ================= */}

      <div className="profile-card">

        <div className="profile-card-header">

          <h1>
            Your Profile
          </h1>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Log Out
          </button>

        </div>

        <div className="profile-main-info">

          {/* Avatar */}

          <div className="profile-avatar">
            {customer.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-details">

            {/* NAME */}

            <div className="profile-name-section">

              <span className="profile-label">
                Name
              </span>

              <h2>
                {customer.name}
              </h2>

            </div>

            {/* MEMBER SINCE + EMAIL */}

            <div className="profile-info-grid">

              <div className="profile-info-item">

                <span className="profile-label">
                  Member Since
                </span>

                <p>
                  {formatMemberSince(
                    customer.created_at
                  )}
                </p>

              </div>

              <div className="profile-info-item">

                <span className="profile-label">
                  Email
                </span>

                <p
                  className={
                    customer.email
                      ? ""
                      : "not-added"
                  }
                >
                  {customer.email ||
                    "Not added"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ACTION CARD ================= */}

      <div className="profile-actions-card">

        {!isUpdateMode ? (

          <>
            {/* NORMAL MODE */}

            <h2>
              Manage Your Account
            </h2>

            <p className="actions-subtitle">
              Manage your bookings and profile information.
            </p>

            <div className="profile-actions">

              {/* BOOKING HISTORY */}

              <div className="profile-action-item">

                <div className="profile-action-content">

                  <div className="action-icon booking-icon">
                    📋
                  </div>

                  <div>

                    <h3>
                      Booking History
                    </h3>

                    <p>
                      View your previous and current
                      vehicle bookings.
                    </p>

                  </div>

                </div>

                <button
                  className="action-button"
                  onClick={() => {}}
                >
                  Booking History
                </button>

              </div>

              {/* UPDATE PROFILE */}

              <div className="profile-action-item">

                <div className="profile-action-content">

                  <div className="action-icon profile-icon">
                    ⚙
                  </div>

                  <div>

                    <h3>
                      Update Profile
                    </h3>

                    <p>
                      Update your email address or
                      change your password.
                    </p>

                  </div>

                </div>

                <button
                  className="action-button"
                  onClick={handleOpenUpdate}
                >
                  Update Profile
                </button>

              </div>

            </div>
          </>

        ) : (

          <>
            {/* ================= UPDATE MODE ================= */}

            <div className="update-profile-section">

              {/* UPDATE HEADER */}

              <div className="update-profile-header">

                <div>

                  <h2>
                    Update Profile
                  </h2>

                  <p className="actions-subtitle">
                    Update your account information.
                  </p>

                </div>

                <button
                  type="button"
                  className="update-close-button"
                  onClick={handleCancelUpdate}
                  disabled={isUpdating}
                >
                  ×
                </button>

              </div>

              {/* ================= UPDATE FORM ================= */}

              <form
                className="update-profile-form"
                onSubmit={handleUpdateProfile}
                autoComplete="off"
              >

                {/* ================= EMAIL ================= */}

                <div className="update-form-group">

                  <label htmlFor="profile-email">
                    Email Address
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    name="profile-email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter your email address"
                  />

                </div>

                {/* ================= PASSWORD TITLE ================= */}

                <div className="password-section-title">

                  Change Password

                  <span>
                    (optional)
                  </span>

                </div>

                {/* ================= CURRENT PASSWORD ================= */}

                <div className="update-form-group">

                  <label htmlFor="current-password">
                    Current Password
                  </label>

                  <input
                    id="current-password"
                    type="password"
                    name="current-password"
                    autoComplete="new-password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter current password"
                  />

                </div>

                {/* ================= NEW PASSWORD ================= */}

                <div className="update-form-group">

                  <label htmlFor="new-password">
                    New Password
                  </label>

                  <input
                    id="new-password"
                    type="password"
                    name="new-password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter new password"
                  />

                </div>

                {/* ================= CONFIRM PASSWORD ================= */}

                <div className="update-form-group">

                  <label htmlFor="confirm-password">
                    Confirm New Password
                  </label>

                  <input
                    id="confirm-password"
                    type="password"
                    name="confirm-password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                  />

                </div>

                {/* ================= ERROR ================= */}

                {updateError && (
                  <div className="update-error">
                    {updateError}
                  </div>
                )}

                {/* ================= SUCCESS ================= */}

                {updateSuccess && (
                  <div className="update-success">
                    {updateSuccess}
                  </div>
                )}

                {/* ================= BUTTONS ================= */}

                <div className="update-buttons">

                  <button
                    type="button"
                    className="cancel-update-button"
                    onClick={handleCancelUpdate}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-update-button"
                    disabled={isUpdating}
                  >
                    {isUpdating
                      ? "Updating..."
                      : "Update Profile"}
                  </button>

                </div>

              </form>

            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default Profile;