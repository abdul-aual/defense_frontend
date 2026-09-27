
import { useState } from "react";
import "./BookingManagement.css";

interface BookingManagementProps {
  onBack: () => void;
}

interface Booking {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  vehicle_id: number;
  vehicle_name: string;
  registration_number: string;
  city: string;
  pickup_point: string;
  start_date: string;
  end_date: string;
  daily_rent_price: string | number;
  total_rent: string | number;
  status: "Booked" | "Cancelled" | "Completed";
  booked_by_type: "own" | "admin";
  booked_by_admin_id: number | null;
  booked_by_admin_name?: string | null;
  created_at: string;
}

interface Vehicle {
  id: number;
  vehicle_name: string;
  type: string;
  registration_number: string;
  ac_type: string;
  total_seats: number;
  fuel_type: string;
  suitcase_capacity: number;
  daily_rent_price: string | number;
  city: string;
  availability_status: string;
  image: string;
}

type ActiveTab = "all" | "search" | "book";

const API_BASE = "http://localhost:5000/api";

/* =========================
   DATE HELPERS
========================= */

const getToday = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getMaxDate = (): string => {
  const date = new Date();

  // Today + 10 days
  date.setDate(date.getDate() + 10);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* =========================
   FORMAT HELPERS
========================= */

const formatDate = (dateString: string): string => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMoney = (amount: string | number): string => {
  const value = Number(amount);

  if (Number.isNaN(value)) {
    return String(amount);
  }

  return `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getStatusClass = (
  status: "Booked" | "Cancelled" | "Completed"
): string => {
  if (status === "Booked") {
    return "booked";
  }

  if (status === "Cancelled") {
    return "cancelled";
  }

  return "completed";
};

const getBookedByText = (booking: Booking): string => {
  if (booking.booked_by_type === "admin") {
    return booking.booked_by_admin_name
      ? `Admin - ${booking.booked_by_admin_name}`
      : "Admin";
  }

  return "Customer";
};

/* =========================
   COMPONENT
========================= */

const BookingManagement = ({
  onBack,
}: BookingManagementProps) => {
  const [activeTab, setActiveTab] =
    useState<ActiveTab | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Search customer
  const [searchPhone, setSearchPhone] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Book for customer
  const [vehicleType, setVehicleType] = useState("car");
  const [city, setCity] = useState("Dhaka");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] =
    useState<number | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");

  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  /* =========================
     FETCH ALL BOOKINGS
  ========================= */

  const fetchAllBookings = async () => {
    const token = getToken();

    if (!token) {
      setError("Authorization token is required.");
      return;
    }

    try {
      setLoading(true);
      clearMessages();

      const response = await fetch(
        `${API_BASE}/booking`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load bookings."
        );
      }

      const bookingList = Array.isArray(data)
        ? data
        : data.bookings || [];

      setBookings(bookingList);
    } catch (err) {
      setBookings([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllBookings = async () => {
    setActiveTab("all");
    await fetchAllBookings();
  };

  /* =========================
     SEARCH CUSTOMER BOOKINGS
  ========================= */

  const searchBookings = async () => {
    const token = getToken();

    if (!token) {
      setError("Authorization token is required.");
      return;
    }

    if (!searchPhone.trim()) {
      setError("Please enter customer phone number.");
      return;
    }

    try {
      setSearchLoading(true);
      clearMessages();

      const response = await fetch(
        `${API_BASE}/booking/customer/${encodeURIComponent(
          searchPhone.trim()
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to search bookings."
        );
      }

      const bookingList = Array.isArray(data)
        ? data
        : data.bookings || [];

      setBookings(bookingList);

      if (bookingList.length === 0) {
        setMessage(
          "No booking history found for this customer."
        );
      }
    } catch (err) {
      setBookings([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to search bookings."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  /* =========================
     CANCEL BOOKING
  ========================= */

  const handleCancelBooking = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Authorization token is required.");
      return;
    }

    try {
      clearMessages();

      const response = await fetch(
        `${API_BASE}/booking/${id}/cancel`,
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

      if (activeTab === "search") {
        await searchBookings();
      } else {
        await fetchAllBookings();
      }

      setMessage("Booking cancelled successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to cancel booking."
      );
    }
  };

  /* =========================
     COMPLETE BOOKING
  ========================= */

  const handleCompleteBooking = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this booking as completed?"
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Authorization token is required.");
      return;
    }

    try {
      clearMessages();

      const response = await fetch(
        `${API_BASE}/booking/${id}/complete`,
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
          data.message || "Failed to complete booking."
        );
      }

      if (activeTab === "search") {
        await searchBookings();
      } else {
        await fetchAllBookings();
      }

      setMessage("Booking completed successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete booking."
      );
    }
  };

  /* =========================
     DATE CHANGE
  ========================= */

  const handleStartDateChange = (
    value: string
  ) => {
    setStartDate(value);

    if (!value) {
      setEndDate("");
      return;
    }

    if (endDate && endDate < value) {
      setEndDate(value);
    }

    clearMessages();
  };

  const handleEndDateChange = (
    value: string
  ) => {
    setEndDate(value);
    setVehicles([]);
    setSelectedVehicleId(null);
    clearMessages();
  };

  /* =========================
     SEARCH AVAILABLE VEHICLES
  ========================= */

  const searchAvailableVehicles = async () => {
    clearMessages();

    if (!startDate || !endDate) {
      setError(
        "Please select both start date and end date."
      );
      return;
    }

    if (startDate > endDate) {
      setError(
        "End date cannot be earlier than start date."
      );
      return;
    }

    if (startDate < getToday()) {
      setError(
        "Past dates cannot be selected."
      );
      return;
    }

    if (startDate > getMaxDate()) {
      setError(
        "Start date cannot be more than 10 days from today."
      );
      return;
    }

    if (endDate > getMaxDate()) {
      setError(
        "End date cannot be more than 10 days from today."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Authorization token is required.");
      return;
    }

    try {
      setVehicleLoading(true);
      setVehicles([]);
      setSelectedVehicleId(null);

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        city,
        type: vehicleType,
      });

      const response = await fetch(
        `${API_BASE}/vehicle/available?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to search available vehicles."
        );
      }

      const vehicleList = Array.isArray(data)
        ? data
        : data.vehicles || [];

      setVehicles(vehicleList);

      if (vehicleList.length === 0) {
        setMessage(
          "No available vehicle found for the selected date range."
        );
      }
    } catch (err) {
      setVehicles([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to search available vehicles."
      );
    } finally {
      setVehicleLoading(false);
    }
  };

  /* =========================
     BOOK FOR CUSTOMER
  ========================= */

  const handleBookForCustomer = async () => {
    clearMessages();

    if (!selectedVehicleId) {
      setError("Please select a vehicle.");
      return;
    }

    if (!startDate || !endDate) {
      setError(
        "Please select start date and end date."
      );
      return;
    }

    if (startDate > endDate) {
      setError(
        "End date cannot be earlier than start date."
      );
      return;
    }

    if (
      startDate < getToday() ||
      startDate > getMaxDate()
    ) {
      setError(
        "Please select a valid start date within 10 days."
      );
      return;
    }

    if (endDate > getMaxDate()) {
      setError(
        "Please select an end date within 10 days from today."
      );
      return;
    }

    if (!customerName.trim()) {
      setError("Please enter customer name.");
      return;
    }

    if (!customerPhone.trim()) {
      setError("Please enter customer phone number.");
      return;
    }

    if (!pickupPoint.trim()) {
      setError("Please enter pickup point.");
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Authorization token is required.");
      return;
    }

    try {
      setBookingLoading(true);

      const response = await fetch(
        `${API_BASE}/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vehicle_id: selectedVehicleId,
            city,
            pickup_point: pickupPoint.trim(),
            start_date: startDate,
            end_date: endDate,
            customer_name: customerName.trim(),
            customer_phone: customerPhone.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create booking."
        );
      }

      setSelectedVehicleId(null);
      setVehicles([]);

      setCustomerName("");
      setCustomerPhone("");
      setPickupPoint("");

      setStartDate("");
      setEndDate("");

      await fetchAllBookings();

      setActiveTab("all");

      setMessage(
        data.message || "Booking created successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create booking."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="booking-management">

      {/* Header */}
      <div className="booking-management-header">
        <div>
          <h2>Booking Management</h2>
          <p>
            Manage customer bookings, search booking
            history and create bookings for customers.
          </p>
        </div>

        <button
          type="button"
          className="booking-back-button"
          onClick={onBack}
        >
          ← Back
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="booking-success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="booking-error-message">
          {error}
        </div>
      )}

      {/* Three Options */}
      <div className="booking-management-options">

        <button
          type="button"
          className={`booking-option-button ${
            activeTab === "all" ? "active" : ""
          }`}
          onClick={handleViewAllBookings}
        >
          <span className="booking-option-icon">
            ▤
          </span>

          <span>
            <strong>View All Bookings</strong>
            <small>
              View complete booking history
            </small>
          </span>
        </button>

        <button
          type="button"
          className={`booking-option-button ${
            activeTab === "search" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("search");
            clearMessages();
            setBookings([]);
          }}
        >
          <span className="booking-option-icon">
            ⌕
          </span>

          <span>
            <strong>Search Customer</strong>
            <small>
              Search bookings by phone number
            </small>
          </span>
        </button>

        <button
          type="button"
          className={`booking-option-button ${
            activeTab === "book" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("book");
            clearMessages();
            setBookings([]);
          }}
        >
          <span className="booking-option-icon">
            +
          </span>

          <span>
            <strong>Book for Customer</strong>
            <small>
              Create a booking for a customer
            </small>
          </span>
        </button>

      </div>

      {/* =========================
          VIEW ALL BOOKINGS
      ========================= */}

      {activeTab === "all" && (
        <section className="booking-section-card">

          <div className="booking-section-header">
            <div>
              <h3>All Bookings</h3>
              <p>
                Complete booking history of all customers.
              </p>
            </div>

            <button
              type="button"
              className="booking-close-button"
              onClick={() => {
                setActiveTab(null);
                setBookings([]);
                clearMessages();
              }}
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className="booking-loading">
              <div className="booking-spinner"></div>
              <p>Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="booking-empty">
              <div className="booking-empty-icon">
                ▤
              </div>
              <h4>No bookings found</h4>
              <p>
                There are currently no bookings to display.
              </p>
            </div>
          ) : (
            <>
              <div className="booking-table-wrapper">
                <table className="booking-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Vehicle</th>
                      <th>Registration</th>
                      <th>City</th>
                      <th>Pickup Point</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Daily Rent</th>
                      <th>Total Rent</th>
                      <th>Status</th>
                      <th>Booked By</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>

                        <td className="booking-id">
                          #{booking.id}
                        </td>

                        <td className="booking-customer">
                          {booking.customer_name}
                        </td>

                        <td>
                          {booking.customer_phone}
                        </td>

                        <td className="booking-vehicle">
                          {booking.vehicle_name}
                        </td>

                        <td className="booking-registration">
                          {booking.registration_number}
                        </td>

                        <td>{booking.city}</td>

                        <td>
                          {booking.pickup_point}
                        </td>

                        <td>
                          {formatDate(
                            booking.start_date
                          )}
                        </td>

                        <td>
                          {formatDate(
                            booking.end_date
                          )}
                        </td>

                        <td className="booking-money">
                          {formatMoney(
                            booking.daily_rent_price
                          )}
                        </td>

                        <td className="booking-money">
                          {formatMoney(
                            booking.total_rent
                          )}
                        </td>

                        <td>
                          <span
                            className={`booking-status ${getStatusClass(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>

                        <td className="booking-booked-by">
                          {getBookedByText(booking)}
                        </td>

                        <td>
                          {booking.status === "Booked" ? (
                            <div className="booking-actions">

                              <button
                                type="button"
                                className="booking-cancel-button"
                                onClick={() =>
                                  handleCancelBooking(
                                    booking.id
                                  )
                                }
                              >
                                Cancel
                              </button>

                              <button
                                type="button"
                                className="booking-complete-button"
                                onClick={() =>
                                  handleCompleteBooking(
                                    booking.id
                                  )
                                }
                              >
                                Complete
                              </button>

                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="booking-table-footer">
                Showing {bookings.length} booking
                {bookings.length !== 1 ? "s" : ""}
              </div>
            </>
          )}
        </section>
      )}

      {/* =========================
          SEARCH CUSTOMER
      ========================= */}

      {activeTab === "search" && (
        <section className="booking-section-card">

          <div className="booking-section-header">
            <div>
              <h3>Search Customer Bookings</h3>
              <p>
                Search all booking history using customer
                phone number.
              </p>
            </div>

            <button
              type="button"
              className="booking-close-button"
              onClick={() => {
                setActiveTab(null);
                setBookings([]);
                clearMessages();
              }}
            >
              ×
            </button>
          </div>

          <div className="booking-search-form">

            <div className="booking-search-group">
              <label htmlFor="search-phone">
                Customer Phone Number
              </label>

              <input
                id="search-phone"
                type="tel"
                placeholder="Enter customer phone number"
                value={searchPhone}
                onChange={(e) =>
                  setSearchPhone(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchBookings();
                  }
                }}
              />
            </div>

            <button
              type="button"
              className="booking-search-button"
              onClick={searchBookings}
              disabled={searchLoading}
            >
              {searchLoading
                ? "Searching..."
                : "Search Bookings"}
            </button>

          </div>

          {searchLoading ? (
            <div className="booking-loading">
              <div className="booking-spinner"></div>
              <p>Searching bookings...</p>
            </div>
          ) : bookings.length > 0 ? (
            <>
              <div className="booking-table-wrapper">
                <table className="booking-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Vehicle</th>
                      <th>Registration</th>
                      <th>City</th>
                      <th>Pickup Point</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Daily Rent</th>
                      <th>Total Rent</th>
                      <th>Status</th>
                      <th>Booked By</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>

                        <td className="booking-id">
                          #{booking.id}
                        </td>

                        <td className="booking-customer">
                          {booking.customer_name}
                        </td>

                        <td>
                          {booking.customer_phone}
                        </td>

                        <td className="booking-vehicle">
                          {booking.vehicle_name}
                        </td>

                        <td className="booking-registration">
                          {booking.registration_number}
                        </td>

                        <td>{booking.city}</td>

                        <td>
                          {booking.pickup_point}
                        </td>

                        <td>
                          {formatDate(
                            booking.start_date
                          )}
                        </td>

                        <td>
                          {formatDate(
                            booking.end_date
                          )}
                        </td>

                        <td className="booking-money">
                          {formatMoney(
                            booking.daily_rent_price
                          )}
                        </td>

                        <td className="booking-money">
                          {formatMoney(
                            booking.total_rent
                          )}
                        </td>

                        <td>
                          <span
                            className={`booking-status ${getStatusClass(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>

                        <td className="booking-booked-by">
                          {getBookedByText(booking)}
                        </td>

                        <td>
                          {booking.status === "Booked" ? (
                            <div className="booking-actions">

                              <button
                                type="button"
                                className="booking-cancel-button"
                                onClick={() =>
                                  handleCancelBooking(
                                    booking.id
                                  )
                                }
                              >
                                Cancel
                              </button>

                              <button
                                type="button"
                                className="booking-complete-button"
                                onClick={() =>
                                  handleCompleteBooking(
                                    booking.id
                                  )
                                }
                              >
                                Complete
                              </button>

                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

              <div className="booking-table-footer">
                Showing {bookings.length} booking
                {bookings.length !== 1 ? "s" : ""}
              </div>
            </>
          ) : (
            <div className="booking-empty">
              <div className="booking-empty-icon">
                ⌕
              </div>

              <h4>No search results</h4>

              <p>
                Enter a customer phone number to view
                booking history.
              </p>
            </div>
          )}

        </section>
      )}

      {/* =========================
          BOOK FOR CUSTOMER
      ========================= */}

      {activeTab === "book" && (
        <section className="booking-section-card">

          <div className="booking-section-header">
            <div>
              <h3>Book for Customer</h3>
              <p>
                Select an available vehicle and create a
                booking for a customer.
              </p>
            </div>

            <button
              type="button"
              className="booking-close-button"
              onClick={() => {
                setActiveTab(null);
                clearMessages();
              }}
            >
              ×
            </button>
          </div>

          {/* Vehicle Search */}

          <div className="booking-form">

            <div className="booking-form-grid">

              <div className="booking-form-group">
                <label htmlFor="vehicle-type">
                  Vehicle Type
                </label>

                <select
                  id="vehicle-type"
                  value={vehicleType}
                  onChange={(e) => {
                    setVehicleType(e.target.value);
                    setVehicles([]);
                    setSelectedVehicleId(null);
                  }}
                >
                  <option value="car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="HiAce">HiAce</option>
                </select>
              </div>

              <div className="booking-form-group">
                <label htmlFor="booking-city">
                  City
                </label>

                <select
                  id="booking-city"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setVehicles([]);
                    setSelectedVehicleId(null);
                  }}
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Chattogram">
                    Chattogram
                  </option>
                </select>
              </div>

              {/* START DATE */}

              <div className="booking-form-group">
                <label htmlFor="start-date">
                  Start Date
                </label>

                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  min={getToday()}
                  max={getMaxDate()}
                  onChange={(e) =>
                    handleStartDateChange(
                      e.target.value
                    )
                  }
                />

                <small>
                  Select a date from today up to 10 days
                  ahead.
                </small>
              </div>

              {/* END DATE */}

              <div className="booking-form-group">
                <label htmlFor="end-date">
                  End Date
                </label>

                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  min={startDate || getToday()}
                  max={getMaxDate()}
                  onChange={(e) =>
                    handleEndDateChange(
                      e.target.value
                    )
                  }
                />

                <small>
                  End date can be the same as start date,
                  but cannot exceed 10 days from today.
                </small>
              </div>

            </div>

            <div className="booking-vehicle-search-actions">

              <button
                type="button"
                className="booking-vehicle-search-button"
                onClick={searchAvailableVehicles}
                disabled={vehicleLoading}
              >
                {vehicleLoading
                  ? "Searching Vehicles..."
                  : "Search Available Vehicles"}
              </button>

            </div>

          </div>

          {/* Available Vehicles */}

          {vehicleLoading ? (
            <div className="booking-loading">
              <div className="booking-spinner"></div>
              <p>
                Searching available vehicles...
              </p>
            </div>
          ) : vehicles.length > 0 ? (
            <div className="booking-vehicle-results">

              <div className="booking-vehicle-results-header">
                <div>
                  <h4>
                    Available Vehicles
                  </h4>

                  <p>
                    Select one vehicle for this booking.
                  </p>
                </div>
              </div>

              <div className="booking-vehicle-table-wrapper">

                <table className="booking-vehicle-table">

                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Vehicle</th>
                      <th>Type</th>
                      <th>Registration</th>
                      <th>Seats</th>
                      <th>AC</th>
                      <th>Fuel</th>
                      <th>City</th>
                      <th>Daily Rent</th>
                    </tr>
                  </thead>

                  <tbody>

                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id}>

                        <td>
                          <input
                            type="radio"
                            name="selectedVehicle"
                            value={vehicle.id}
                            checked={
                              selectedVehicleId ===
                              vehicle.id
                            }
                            onChange={() =>
                              setSelectedVehicleId(
                                vehicle.id
                              )
                            }
                          />
                        </td>

                        <td className="booking-vehicle-name">
                          {vehicle.vehicle_name}
                        </td>

                        <td>
                          {vehicle.type}
                        </td>

                        <td className="booking-registration">
                          {vehicle.registration_number}
                        </td>

                        <td>
                          {vehicle.total_seats}
                        </td>

                        <td>
                          {vehicle.ac_type}
                        </td>

                        <td>
                          {vehicle.fuel_type}
                        </td>

                        <td>
                          {vehicle.city}
                        </td>

                        <td className="booking-money">
                          {formatMoney(
                            vehicle.daily_rent_price
                          )}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            </div>
          ) : null}

          {/* Customer Information */}

          <div className="booking-customer-section">

            <div className="booking-section-header">
              <div>
                <h4>Customer Information</h4>

                <p>
                  Enter customer details for this booking.
                </p>
              </div>
            </div>

            <div className="booking-form-grid">

              <div className="booking-form-group">
                <label htmlFor="customer-name">
                  Customer Name
                </label>

                <input
                  id="customer-name"
                  type="text"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                />
              </div>

              <div className="booking-form-group">
                <label htmlFor="customer-phone">
                  Customer Phone
                </label>

                <input
                  id="customer-phone"
                  type="tel"
                  placeholder="Enter customer phone"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(e.target.value)
                  }
                />
              </div>

              <div className="booking-form-group booking-full-width">

                <label htmlFor="pickup-point">
                  Pickup Point
                </label>

                <input
                  id="pickup-point"
                  type="text"
                  placeholder="Enter pickup point"
                  value={pickupPoint}
                  onChange={(e) =>
                    setPickupPoint(e.target.value)
                  }
                />

              </div>

            </div>

          </div>

          {/* Submit */}

          <div className="booking-submit-actions">

            <button
              type="button"
              className="booking-submit-button"
              onClick={handleBookForCustomer}
              disabled={bookingLoading}
            >
              {bookingLoading
                ? "Creating Booking..."
                : "Confirm Booking"}
            </button>

          </div>

        </section>
      )}

    </div>
  );
};

export default BookingManagement;