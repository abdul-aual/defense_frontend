import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "./Booking.css";

interface Vehicle {
  id: number;
  vehicle_name: string;
  type: "car" | "SUV" | "HiAce";
  registration_number: string;
  ac_type: "AC" | "Non-AC";
  total_seats: number;
  fuel_type: "Petrol" | "Diesel" | "CNG" | "Electric";
  suitcase_capacity: number;
  daily_rent_price: number;
  city: "Dhaka" | "Rangpur" | "Chattogram";
  availability_status: "available" | "booked" | "maintenance";
  image: string;
  created_at: string;
}

interface SearchCriteria {
  vehicleType: string;
  city: string;
  startDate: string;
  endDate: string;
}

interface BookingState {
  vehicle?: Vehicle;
  searchCriteria?: SearchCriteria;
  pickupPoint?: string;
}

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicleId } = useParams();

  const state = location.state as BookingState | null;

  const vehicle = state?.vehicle;
  const searchCriteria = state?.searchCriteria;

  const [pickupPoint, setPickupPoint] = useState(
    state?.pickupPoint || ""
  );

  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);

  /* =========================================================
     IMAGE URL
  ========================================================= */

  const getImageUrl = (image: string) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
  };

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (date: string) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     RENTAL DAYS
     Inclusive calculation
     Example:
     15 - 17 = 3 days
  ========================================================= */

  const calculateRentalDays = () => {
    if (
      !searchCriteria?.startDate ||
      !searchCriteria?.endDate
    ) {
      return 1;
    }

    const start = new Date(
      `${searchCriteria.startDate}T00:00:00`
    );

    const end = new Date(
      `${searchCriteria.endDate}T00:00:00`
    );

    const difference =
      end.getTime() - start.getTime();

    return Math.max(
      1,
      Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const rentalDays = calculateRentalDays();

  /* =========================================================
     PRICE
  ========================================================= */

  const dailyRent = Number(
    vehicle?.daily_rent_price || 0
  );

  const totalRent = dailyRent * rentalDays;

  const formatPrice = (price: number) => {
    return Number(price).toLocaleString("en-BD");
  };

  /* =========================================================
     INVALID BOOKING STATE
  ========================================================= */

  if (!vehicle || !searchCriteria) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <div className="booking-error-page">
            <div className="booking-error-icon">
              🚗
            </div>

            <h2>
              Booking information not found
            </h2>

            <p>
              Please go back to the search results
              and select a vehicle again.
            </p>

            <button
              className="booking-back-btn"
              onClick={() => navigate("/")}
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     CONFIRM BOOKING
  ========================================================= */

  const handleConfirmBooking = async () => {
    // Clear previous messages
    setBookingError("");
    setBookingSuccess("");

    /* ---------------------------------------------------------
       STEP 1:
       Pickup point is mandatory
    --------------------------------------------------------- */

    if (!pickupPoint.trim()) {
      setBookingError(
        "Please enter your pickup point before confirming the booking."
      );

      return;
    }

    /* ---------------------------------------------------------
       STEP 2:
       Check login status
    --------------------------------------------------------- */

    const token = localStorage.getItem("token");

    if (!token) {
      // Show top-right login notification
      setShowLoginToast(true);

      // Save booking information
      localStorage.setItem(
        "rentwisePendingBooking",
        JSON.stringify({
          vehicle,
          searchCriteria,
          vehicleId,
          pickupPoint: pickupPoint.trim(),
        })
      );

      /*
       * Give the user enough time to see the message
       * before redirecting to login page.
       */
      setTimeout(() => {
        navigate("/login", {
          state: {
            returnTo: `/booking/${vehicle.id}`,

            bookingState: {
              vehicle,
              searchCriteria,
              pickupPoint: pickupPoint.trim(),
            },
          },
        });
      }, 1800);

      return;
    }

    /* ---------------------------------------------------------
       STEP 3:
       User is logged in
       Create booking
    --------------------------------------------------------- */

    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/booking",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            vehicle_id: vehicle.id,
            city: searchCriteria.city,
            pickup_point: pickupPoint.trim(),
            start_date: searchCriteria.startDate,
            end_date: searchCriteria.endDate,
          }),
        }
      );

      const data = await response.json();

      /* -------------------------------------------------------
         BACKEND ERROR
      ------------------------------------------------------- */

      if (!response.ok) {
        setBookingError(
          data.message ||
            "Failed to create booking. Please try again."
        );

        return;
      }

      /* -------------------------------------------------------
         BOOKING SUCCESS
      ------------------------------------------------------- */

      setBookingSuccess(
        "Your vehicle has been booked successfully."
      );

      // Remove saved pending booking
      localStorage.removeItem(
        "rentwisePendingBooking"
      );
    } catch (error) {
      console.error("Booking error:", error);

      setBookingError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="booking-page">

      {/* =================================================
          LOGIN REQUIRED TOAST
      ================================================= */}

      {showLoginToast && (
        <div className="login-toast">

          <div className="login-toast-icon">
            🔐
          </div>

          <div className="login-toast-content">

            <strong>
              Login Required
            </strong>

            <span>
              You must log in first to confirm your booking.
            </span>

          </div>

        </div>
      )}

      <div className="booking-container">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="booking-header">

          <button
            className="booking-back-link"
            onClick={() => navigate(-1)}
          >
            ← Back to Search Results
          </button>

          <h1>
            Complete Your Booking
          </h1>

          <p>
            Review your vehicle and rental details
            before confirming your booking.
          </p>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {bookingSuccess && (
          <div className="booking-success-box">

            <div className="booking-success-icon">
              ✓
            </div>

            <div>

              <h3>
                Booking Confirmed
              </h3>

              <p>
                {bookingSuccess}
              </p>

              <button
                onClick={() =>
                  navigate("/profile")
                }
                className="booking-success-btn"
              >
                View My Bookings
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            MAIN BOOKING CONTENT
        ================================================= */}

        {!bookingSuccess && (
          <div className="booking-layout">

            {/* =============================================
                LEFT SIDE
            ============================================= */}

            <div className="booking-main">

              {/* =================================================
                  VEHICLE CARD
              ================================================= */}

              <section className="booking-section">

                <div className="booking-section-title">

                  <h2>
                    Selected Vehicle
                  </h2>

                  <span>
                    {vehicle.city}
                  </span>

                </div>

                <div className="booking-vehicle-card">

                  {/* IMAGE */}

                  <div className="booking-vehicle-image-box">

                    {vehicle.image ? (
                      <img
                        src={getImageUrl(
                          vehicle.image
                        )}
                        alt={
                          vehicle.vehicle_name
                        }
                        className="booking-vehicle-image"
                      />
                    ) : (
                      <div className="booking-no-image">
                        No Image
                      </div>
                    )}

                  </div>

                  {/* VEHICLE INFORMATION */}

                  <div className="booking-vehicle-info">

                    <h2>
                      {vehicle.vehicle_name}
                    </h2>

                    <p className="booking-vehicle-type">
                      {vehicle.type}
                      {" • "}
                      {vehicle.ac_type}
                    </p>

                    <div className="booking-registration">
                      Registration:{" "}
                      <strong>
                        {vehicle.registration_number}
                      </strong>
                    </div>

                    <div className="booking-spec-grid">

                      <div>
                        <span>
                          Seats
                        </span>

                        <strong>
                          {vehicle.total_seats}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Luggage
                        </span>

                        <strong>
                          {vehicle.suitcase_capacity}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Fuel
                        </span>

                        <strong>
                          {vehicle.fuel_type}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Location
                        </span>

                        <strong>
                          {vehicle.city}
                        </strong>
                      </div>

                    </div>

                  </div>

                </div>

              </section>

              {/* =================================================
                  RENTAL DETAILS
              ================================================= */}

              <section className="booking-section">

                <div className="booking-section-title">

                  <h2>
                    Rental Details
                  </h2>

                </div>

                <div className="booking-date-grid">

                  <div className="booking-detail-box">

                    <span>
                      Start Date
                    </span>

                    <strong>
                      {formatDate(
                        searchCriteria.startDate
                      )}
                    </strong>

                  </div>

                  <div className="booking-detail-box">

                    <span>
                      End Date
                    </span>

                    <strong>
                      {formatDate(
                        searchCriteria.endDate
                      )}
                    </strong>

                  </div>

                  <div className="booking-detail-box">

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

                  <div className="booking-detail-box">

                    <span>
                      City
                    </span>

                    <strong>
                      {searchCriteria.city}
                    </strong>

                  </div>

                </div>

              </section>

              {/* =================================================
                  PICKUP POINT
              ================================================= */}

              <section className="booking-section">

                <div className="booking-section-title">

                  <div>

                    <h2>
                      Pickup Point
                    </h2>

                    <p>
                      Enter the location where you
                      want to collect the vehicle.
                    </p>

                  </div>

                </div>

                <div className="pickup-input-wrapper">

                  <label htmlFor="pickupPoint">
                    Pickup Location
                  </label>

                  <input
                    id="pickupPoint"
                    type="text"
                    value={pickupPoint}
                    onChange={(e) => {
                      setPickupPoint(
                        e.target.value
                      );

                      // Clear pickup error when user
                      // starts entering the location
                      if (bookingError) {
                        setBookingError("");
                      }
                    }}
                    placeholder="Enter pickup point"
                    maxLength={200}
                  />

                </div>

              </section>

              {/* =================================================
                  ERROR MESSAGE
              ================================================= */}

              {bookingError && (
                <div className="booking-error-message">
                  {bookingError}
                </div>
              )}

            </div>

            {/* =============================================
                RIGHT SIDE
            ============================================= */}

            <aside className="booking-summary">

              <h2>
                Price Summary
              </h2>

              <div className="summary-vehicle">

                <div>

                  <strong>
                    {vehicle.vehicle_name}
                  </strong>

                  <span>
                    {vehicle.type} •{" "}
                    {vehicle.ac_type}
                  </span>

                </div>

              </div>

              <div className="summary-row">

                <span>
                  Daily Rent
                </span>

                <strong>
                  ৳{formatPrice(dailyRent)}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  Rental Days
                </span>

                <strong>
                  {rentalDays}{" "}
                  {rentalDays === 1
                    ? "day"
                    : "days"}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  Start Date
                </span>

                <strong>
                  {formatDate(
                    searchCriteria.startDate
                  )}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  End Date
                </span>

                <strong>
                  {formatDate(
                    searchCriteria.endDate
                  )}
                </strong>

              </div>

              <div className="summary-divider" />

              <div className="summary-total">

                <span>
                  Total Rent
                </span>

                <strong>
                  ৳{formatPrice(totalRent)}
                </strong>

              </div>

              <button
                className="confirm-booking-btn"
                onClick={handleConfirmBooking}
                disabled={isLoading}
              >
                {isLoading
                  ? "Confirming..."
                  : "Confirm Booking"}
              </button>

              <p className="booking-note">
                Your booking will be confirmed after
                successful verification by the server.
              </p>

            </aside>

          </div>
        )}

      </div>
    </div>
  );
};

export default Booking;