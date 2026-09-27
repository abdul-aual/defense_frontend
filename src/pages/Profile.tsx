import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

interface CustomerProfile {
  id: number;
  name: string;
  email: string | null;
  created_at: string;
}

interface Booking {
  id: number;
  customer_id: number;
  vehicle_id: number;
  vehicle_name: string;
  registration_number: string;
  vehicle_type: "car" | "SUV" | "HiAce";
  city: "Dhaka" | "Rangpur" | "Chattogram";
  pickup_point: string;
  start_date: string;
  end_date: string;
  daily_rent_price: number;
  total_rent: number;
  status: "Booked" | "Cancelled" | "Completed";
  booked_by_type: "own" | "admin";
  created_at: string;
}

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [showUpdate, setShowUpdate] = useState(false);

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  /* =========================================================
     BOOKING HISTORY
     ========================================================= */

  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  /* =========================================================
     FETCH PROFILE
     ========================================================= */

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile."
          );
        }

        setProfile(data.customer);
        setEmail(data.customer.email || "");

        localStorage.setItem(
          "customer",
          JSON.stringify(data.customer)
        );
      } catch (error) {
        console.error("Profile Error:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("customer");

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* =========================================================
     FETCH BOOKING HISTORY
     ========================================================= */

  const fetchBookingHistory = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/booking/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load booking history."
        );
      }

      setBookings(data.bookings || []);
      setShowBookingHistory(true);
    } catch (error) {
      console.error("Booking History Error:", error);

      setBookingError(
        error instanceof Error
          ? error.message
          : "Unable to load booking history."
      );

      setShowBookingHistory(true);
    } finally {
      setBookingLoading(false);
    }
  };

  /* =========================================================
     DATE FORMAT
     ========================================================= */

     const formatDate = (dateString: string) => {
      if (!dateString) {
        return "N/A";
      }
    
      // Backend format:
      // 2026-12-20T18:00:00.000Z
      // এখানে প্রথম 10 character হলো actual date.
      const dateOnly = dateString.substring(0, 10);
    
      const [year, month, day] = dateOnly
        .split("-")
        .map(Number);
    
      if (!year || !month || !day) {
        return "N/A";
      }
    
      const date = new Date(year, month - 1, day);
    
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

  /* =========================================================
     RENTAL DAYS
     ========================================================= */

     const calculateRentalDays = (
      startDate: string,
      endDate: string
    ) => {
      if (!startDate || !endDate) {
        return 0;
      }
    
      // Backend থেকে আসা ISO timestamp-এর
      // প্রথম 10 character নিয়ে YYYY-MM-DD বানাচ্ছি।
    
      const startOnly = startDate.substring(0, 10);
      const endOnly = endDate.substring(0, 10);
    
      const [startYear, startMonth, startDay] =
        startOnly.split("-").map(Number);
    
      const [endYear, endMonth, endDay] =
        endOnly.split("-").map(Number);
    
      const start = new Date(
        startYear,
        startMonth - 1,
        startDay
      );
    
      const end = new Date(
        endYear,
        endMonth - 1,
        endDay
      );
    
      const difference =
        end.getTime() - start.getTime();
    
      // Inclusive rental days
      // 20 → 20 = 1 day
      // 20 → 21 = 2 days
      // 20 → 22 = 3 days
    
      return (
        Math.floor(
          difference / (1000 * 60 * 60 * 24)
        ) + 1
      );
    };

  /* =========================================================
     CANCEL BOOKING
     ========================================================= */

  const handleCancelBooking = async (bookingId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setCancellingId(bookingId);
    setBookingError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/booking/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel booking."
        );
      }

      /*
       * Backend response:
       * {
       *   message: "Booking cancelled successfully",
       *   booking: {...}
       * }
       */

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: "Cancelled",
              }
            : booking
        )
      );
    } catch (error) {
      console.error("Cancel Booking Error:", error);

      setBookingError(
        error instanceof Error
          ? error.message
          : "Unable to cancel booking."
      );
    } finally {
      setCancellingId(null);
    }
  };

  /* =========================================================
     LOGOUT
     ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");

    navigate("/login");
  };

  /* =========================================================
     UPDATE PROFILE
     ========================================================= */

  const handleUpdateProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setUpdateError("");
    setUpdateSuccess("");

    if (
      newPassword &&
      newPassword.length < 4
    ) {
      setUpdateError(
        "New password must be at least 4 characters."
      );
      return;
    }

    if (
      newPassword &&
      newPassword !== confirmPassword
    ) {
      setUpdateError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (newPassword && !currentPassword) {
      setUpdateError(
        "Current password is required to change password."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setIsUpdating(true);

    try {
      const body: {
        email?: string;
        currentPassword?: string;
        newPassword?: string;
      } = {};

      if (email.trim() !== (profile?.email || "")) {
        body.email = email.trim();
      }

      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      if (Object.keys(body).length === 0) {
        setUpdateError(
          "Please make at least one change."
        );
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/customer/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      setProfile(data.customer);

      localStorage.setItem(
        "customer",
        JSON.stringify(data.customer)
      );

      setEmail(data.customer.email || "");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setUpdateSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error("Update Profile Error:", error);

      setUpdateError(
        error instanceof Error
          ? error.message
          : "Unable to update profile."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  /* =========================================================
     CLOSE UPDATE
     ========================================================= */

  const closeUpdateProfile = () => {
    setShowUpdate(false);

    setUpdateError("");
    setUpdateSuccess("");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    if (profile) {
      setEmail(profile.email || "");
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="profile-page">

      {/* ================= TOP BAR ================= */}

      <div className="profile-top-bar">
        <button
          className="home-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>

      {/* ================= PROFILE CARD ================= */}

      <div className="profile-card">

        <div className="profile-card-header">

          <h1>My Profile</h1>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        <div className="profile-main-info">

          <div className="profile-avatar">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="profile-details">

            <div className="profile-name-section">

              <span className="profile-label">
                Full Name
              </span>

              <h2>{profile.name}</h2>

            </div>

            <div className="profile-info-grid">

              <div className="profile-info-item">

                <span className="profile-label">
                  Email Address
                </span>

                <p
                  className={
                    !profile.email
                      ? "not-added"
                      : ""
                  }
                >
                  {profile.email || "Not added"}
                </p>

              </div>

              <div className="profile-info-item">

                <span className="profile-label">
                  Member Since
                </span>

                <p>
                  {formatDate(
                    profile.created_at.split("T")[0]
                  )}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ACTION CARD ================= */}

      <div className="profile-actions-card">

        {!showUpdate ? (
          <>
            <h2>Account Actions</h2>

            <p className="actions-subtitle">
              Manage your bookings and account
              information.
            </p>

            <div className="profile-actions">

              {/* BOOKING HISTORY */}

              <div className="profile-action-item">

                <div className="profile-action-content">

                  <div className="action-icon booking-icon">
                    📋
                  </div>

                  <div>
                    <h3>Booking History</h3>

                    <p>
                      View your previous and
                      current bookings.
                    </p>
                  </div>

                </div>

                <button
                  className="action-button"
                  onClick={fetchBookingHistory}
                >
                  View Bookings
                </button>

              </div>

              {/* UPDATE PROFILE */}

              <div className="profile-action-item">

                <div className="profile-action-content">

                  <div className="action-icon profile-icon">
                    ⚙
                  </div>

                  <div>
                    <h3>Update Profile</h3>

                    <p>
                      Change your email or password.
                    </p>
                  </div>

                </div>

                <button
                  className="action-button"
                  onClick={() => {
                    setShowUpdate(true);
                    setUpdateError("");
                    setUpdateSuccess("");
                  }}
                >
                  Update Profile
                </button>

              </div>

            </div>
          </>
        ) : (
          /* =================================================
             UPDATE PROFILE
             ================================================= */

          <div className="update-profile-section">

            <div className="update-profile-header">

              <div>
                <h2>Update Profile</h2>

                <p className="actions-subtitle">
                  Update your account information.
                </p>
              </div>

              <button
                className="update-close-button"
                onClick={closeUpdateProfile}
              >
                ×
              </button>

            </div>

            <form
              className="update-profile-form"
              onSubmit={handleUpdateProfile}
            >

              <div className="update-form-group">

                <label htmlFor="profile-email">
                  Email Address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                />

              </div>

              <div className="password-section-title">
                Change Password
                <span>
                  (Leave blank if you don't want
                  to change it)
                </span>
              </div>

              <div className="update-form-group">

                <label htmlFor="current-password">
                  Current Password
                </label>

                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  placeholder="Enter current password"
                />

              </div>

              <div className="update-form-group">

                <label htmlFor="new-password">
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                />

              </div>

              <div className="update-form-group">

                <label htmlFor="confirm-password">
                  Confirm New Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                />

              </div>

              {updateError && (
                <div className="update-error">
                  {updateError}
                </div>
              )}

              {updateSuccess && (
                <div className="update-success">
                  {updateSuccess}
                </div>
              )}

              <div className="update-buttons">

                <button
                  type="button"
                  className="cancel-update-button"
                  onClick={closeUpdateProfile}
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
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>
        )}

      </div>

      {/* =====================================================
          BOOKING HISTORY MODAL
          ===================================================== */}

      {showBookingHistory && (
        <div
          className="booking-modal-overlay"
          onClick={() =>
            setShowBookingHistory(false)
          }
        >

          <div
            className="booking-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="booking-modal-header">

              <div>
                <h2>Booking History</h2>

                <p>
                  {bookings.length}{" "}
                  {bookings.length === 1
                    ? "booking"
                    : "bookings"}{" "}
                  found
                </p>
              </div>

              <button
                className="booking-modal-close"
                onClick={() =>
                  setShowBookingHistory(false)
                }
              >
                ×
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="booking-modal-content">

              {bookingLoading ? (
                <div className="booking-history-loading">
                  Loading bookings...
                </div>
              ) : bookingError ? (
                <div className="booking-history-error">
                  {bookingError}
                </div>
              ) : bookings.length === 0 ? (
                <div className="booking-empty">

                  <div className="booking-empty-icon">
                    📋
                  </div>

                  <h3>No bookings yet</h3>

                  <p>
                    You haven't made any bookings
                    yet.
                  </p>

                  <button
                    className="booking-browse-button"
                    onClick={() => {
                      setShowBookingHistory(false);
                      navigate("/");
                    }}
                  >
                    Browse Vehicles
                  </button>

                </div>
              ) : (
                <div className="booking-list">

                  {bookings.map((booking) => {

                    const rentalDays =
                      calculateRentalDays(
                        booking.start_date,
                        booking.end_date
                      );

                    return (
                      <div
                        className="booking-history-card"
                        key={booking.id}
                      >

                        {/* CARD HEADER */}

                        <div className="booking-card-header">

                          <div>
                            <h3>
                              {booking.vehicle_name}
                            </h3>

                            <span className="booking-registration">
                              Registration:{" "}
                              {booking.registration_number}
                            </span>
                          </div>

                          <span
                            className={`booking-status booking-status-${booking.status.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>

                        </div>

                        {/* VEHICLE INFO */}

                        <div className="booking-info-grid">

                          <div className="booking-info-item">
                            <span>
                              Vehicle Type
                            </span>
                            <strong>
                              {booking.vehicle_type}
                            </strong>
                          </div>

                          <div className="booking-info-item">
                            <span>City</span>
                            <strong>
                              {booking.city}
                            </strong>
                          </div>

                          <div className="booking-info-item booking-info-full">
                            <span>
                              Pickup Point
                            </span>
                            <strong>
                              {booking.pickup_point}
                            </strong>
                          </div>

                          <div className="booking-info-item booking-info-full">
                            <span>
                              Rental Period
                            </span>
                            <strong>
                              {formatDate(
                                booking.start_date
                              )}{" "}
                              →{" "}
                              {formatDate(
                                booking.end_date
                              )}
                            </strong>
                          </div>

                          <div className="booking-info-item">
                            <span>
                              Rental Duration
                            </span>
                            <strong>
                              {rentalDays}{" "}
                              {rentalDays === 1
                                ? "Day"
                                : "Days"}
                            </strong>
                          </div>

                          <div className="booking-info-item">
                            <span>
                              Daily Rent
                            </span>
                            <strong>
                              ৳
                              {Number(
                                booking.daily_rent_price
                              ).toLocaleString("en-BD")}
                            </strong>
                          </div>

                        </div>

                        {/* TOTAL */}

                        <div className="booking-total-row">

                          <div>
                            <span>
                              Total Rent
                            </span>

                            <strong>
                              ৳
                              {Number(
                                booking.total_rent
                              ).toLocaleString("en-BD")}
                            </strong>
                          </div>

                          {/* CANCEL BUTTON */}

                          {booking.status ===
                            "Booked" && (
                            <button
                              className="booking-cancel-button"
                              onClick={() =>
                                handleCancelBooking(
                                  booking.id
                                )
                              }
                              disabled={
                                cancellingId ===
                                booking.id
                              }
                            >
                              {cancellingId ===
                              booking.id
                                ? "Cancelling..."
                                : "Cancel Booking"}
                            </button>
                          )}

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>

            {/* MODAL FOOTER */}

            <div className="booking-modal-footer">

              <button
                className="booking-modal-done"
                onClick={() =>
                  setShowBookingHistory(false)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Profile;