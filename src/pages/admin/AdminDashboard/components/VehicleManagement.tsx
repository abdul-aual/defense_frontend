import { useEffect, useState } from "react";
import "./VehicleManagement.css";

interface Vehicle {
  id: number;
  vehicle_name: string;
  type: string;
  registration_number: string;
  ac_type: string;
  total_seats: number;
  fuel_type: string;
  suitcase_capacity: number;
  daily_rent_price: number | string;
  city: string;
  availability_status:
    | "available"
    | "booked"
    | "maintenance";
  image?: string | null;
  created_at?: string;
}

interface MaintenanceVehicle extends Vehicle {
  active_booking?: {
    id: number;
    start_date: string;
    end_date: string;
    status: string;
  } | null;
}

interface VehicleManagementProps {
  onBack: () => void;
}

const VehicleManagement = ({
  onBack,
}: VehicleManagementProps) => {
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState<
    "none" | "add" | "view" | "maintenance"
  >("none");

  // =========================
  // ADD VEHICLE STATES
  // =========================

  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [registrationNumber, setRegistrationNumber] =
    useState("");
  const [acType, setAcType] = useState("AC");
  const [totalSeats, setTotalSeats] = useState("");
  const [fuelType, setFuelType] = useState("Petrol");
  const [suitcaseCapacity, setSuitcaseCapacity] =
    useState("");
  const [dailyRentPrice, setDailyRentPrice] =
    useState("");
  const [city, setCity] = useState("Dhaka");
  const [vehicleImage, setVehicleImage] =
    useState<File | null>(null);

  // =========================
  // GENERAL STATES
  // =========================

  const [saving, setSaving] = useState(false);
  const [loadingVehicles, setLoadingVehicles] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // =========================
  // MAINTENANCE STATES
  // =========================

  const [maintenanceRegistration, setMaintenanceRegistration] =
    useState("");

  const [maintenanceVehicle, setMaintenanceVehicle] =
    useState<MaintenanceVehicle | null>(null);

  const [checkingMaintenance, setCheckingMaintenance] =
    useState(false);

  const [sendingToMaintenance, setSendingToMaintenance] =
    useState(false);

  // =========================
  // LOAD VEHICLES
  // =========================

  const handleViewVehicles = async () => {
    setMessage("");
    setError("");

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      setLoadingVehicles(true);

      const response = await fetch(
        "http://localhost:5000/api/vehicle",
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
          data.message || "Failed to fetch vehicles."
        );
      }

      setVehicles(data.vehicles || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch vehicles."
      );
    } finally {
      setLoadingVehicles(false);
    }
  };

  // =========================
  // VIEW TAB
  // =========================

  useEffect(() => {
    if (activeTab === "view") {
      handleViewVehicles();
    }
  }, [activeTab]);

  // =========================
  // IMAGE HANDLER
  // =========================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      setVehicleImage(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );
      e.target.value = "";
      setVehicleImage(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      setVehicleImage(null);
      return;
    }

    setError("");
    setVehicleImage(file);
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setVehicleName("");
    setVehicleType("car");
    setRegistrationNumber("");
    setAcType("AC");
    setTotalSeats("");
    setFuelType("Petrol");
    setSuitcaseCapacity("");
    setDailyRentPrice("");
    setCity("Dhaka");
    setVehicleImage(null);

    const fileInput = document.getElementById(
      "vehicle-image"
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =========================
  // RESET MAINTENANCE
  // =========================

  const resetMaintenance = () => {
    setMaintenanceRegistration("");
    setMaintenanceVehicle(null);
  };

  // =========================
  // ADD VEHICLE
  // =========================

  const handleAddVehicle = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    if (!vehicleImage) {
      setError("Please select a vehicle image.");
      return;
    }

    if (
      !vehicleName ||
      !registrationNumber ||
      !totalSeats ||
      !suitcaseCapacity ||
      !dailyRentPrice
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (
      Number(totalSeats) <= 0 ||
      Number(suitcaseCapacity) < 0 ||
      Number(dailyRentPrice) <= 0
    ) {
      setError(
        "Please enter valid values for seats, suitcase capacity and daily rent."
      );
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("vehicle_name", vehicleName);
      formData.append("type", vehicleType);
      formData.append(
        "registration_number",
        registrationNumber
      );
      formData.append("ac_type", acType);
      formData.append("total_seats", totalSeats);
      formData.append("fuel_type", fuelType);
      formData.append(
        "suitcase_capacity",
        suitcaseCapacity
      );
      formData.append(
        "daily_rent_price",
        dailyRentPrice
      );
      formData.append("city", city);
      formData.append("image", vehicleImage);

      const response = await fetch(
        "http://localhost:5000/api/vehicle",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add vehicle."
        );
      }

      setMessage(
        data.message || "Vehicle added successfully."
      );

      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add vehicle."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CHECK VEHICLE FOR MAINTENANCE
  // =========================

  const handleCheckMaintenance = async () => {
    setMessage("");
    setError("");
    setMaintenanceVehicle(null);

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    const registration =
      maintenanceRegistration.trim();

    if (!registration) {
      setError(
        "Please enter a vehicle registration number."
      );
      return;
    }

    try {
      setCheckingMaintenance(true);

      const response = await fetch(
        `http://localhost:5000/api/vehicle/maintenance/check?registration_number=${encodeURIComponent(
          registration
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
          data.message ||
            "Failed to check vehicle for maintenance."
        );
      }

      setMaintenanceVehicle(data.vehicle || null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to check vehicle for maintenance."
      );
    } finally {
      setCheckingMaintenance(false);
    }
  };

  // =========================
  // SEND VEHICLE TO MAINTENANCE
  // =========================

  const handleSendToMaintenance = async () => {
    setMessage("");
    setError("");

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    if (!maintenanceVehicle) {
      setError(
        "Please search for a vehicle first."
      );
      return;
    }

    if (
      maintenanceVehicle.availability_status ===
      "maintenance"
    ) {
      setError(
        "This vehicle is already under maintenance."
      );
      return;
    }

    try {
      setSendingToMaintenance(true);

      const response = await fetch(
        "http://localhost:5000/api/vehicle/maintenance",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            registration_number:
              maintenanceVehicle.registration_number,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send vehicle to maintenance."
        );
      }

      setMessage(
        data.message ||
          "Vehicle has been sent to maintenance successfully."
      );

      setMaintenanceVehicle(
        data.vehicle || {
          ...maintenanceVehicle,
          availability_status: "maintenance",
        }
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send vehicle to maintenance."
      );
    } finally {
      setSendingToMaintenance(false);
    }
  };

  // =========================
  // STATUS
  // =========================

  const getStatusClass = (
    status: Vehicle["availability_status"]
  ) => {
    if (status === "available") {
      return "available";
    }

    if (status === "booked") {
      return "booked";
    }

    if (status === "maintenance") {
      return "maintenance";
    }

    return "";
  };

  const getStatusText = (
    status: Vehicle["availability_status"]
  ) => {
    if (status === "available") {
      return "Available";
    }

    if (status === "booked") {
      return "Booked";
    }

    if (status === "maintenance") {
      return "Maintenance";
    }

    return status;
  };

  // =========================
  // DATE FORMAT
  // =========================

  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // TAB CHANGE
  // =========================

  const handleTabChange = (
    tab: "add" | "view" | "maintenance"
  ) => {
    setMessage("");
    setError("");

    if (tab === "maintenance") {
      resetMaintenance();
    }

    setActiveTab(tab);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="vehicle-management">
      <div className="vehicle-management-header">
        <button
          type="button"
          className="vehicle-back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <h2>Vehicle Management</h2>

        <p>
          Add new vehicles, manage maintenance and view all
          vehicles registered in Rentwise.
        </p>
      </div>

      <div className="vehicle-management-options">
        <button
          type="button"
          className={`vehicle-option-button ${
            activeTab === "add" ? "active" : ""
          }`}
          onClick={() => handleTabChange("add")}
        >
          <div className="vehicle-option-icon">
            +
          </div>

          <div>
            <strong>Add New Vehicle</strong>

            <small>
              Register a new vehicle in the system
            </small>
          </div>
        </button>

        <button
          type="button"
          className={`vehicle-option-button ${
            activeTab === "view" ? "active" : ""
          }`}
          onClick={() => handleTabChange("view")}
        >
          <div className="vehicle-option-icon">
            🚗
          </div>

          <div>
            <strong>View Vehicles</strong>

            <small>
              View all vehicles and their current status
            </small>
          </div>
        </button>

        <button
          type="button"
          className={`vehicle-option-button ${
            activeTab === "maintenance"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleTabChange("maintenance")
          }
        >
          <div className="vehicle-option-icon">
            🔧
          </div>

          <div>
            <strong>Maintenance</strong>

            <small>
              Send a vehicle for maintenance
            </small>
          </div>
        </button>
      </div>

      {message && (
        <div className="vehicle-success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="vehicle-error-message">
          {error}
        </div>
      )}

      {/* =========================
          ADD VEHICLE
      ========================= */}

      {activeTab === "add" && (
        <div className="vehicle-section-card">
          <div className="vehicle-section-header">
            <div>
              <h3>Add New Vehicle</h3>

              <p>
                Enter the vehicle information below to add it
                to Rentwise.
              </p>
            </div>

            <button
              type="button"
              className="vehicle-close-button"
              onClick={() => {
                setActiveTab("none");
                setMessage("");
                setError("");
              }}
            >
              ×
            </button>
          </div>

          <form
            className="vehicle-form"
            onSubmit={handleAddVehicle}
          >
            <div className="vehicle-form-grid">
              <div className="vehicle-form-group">
                <label htmlFor="vehicle-name">
                  Vehicle Name *
                </label>

                <input
                  id="vehicle-name"
                  type="text"
                  placeholder="Enter vehicle name"
                  value={vehicleName}
                  onChange={(e) =>
                    setVehicleName(e.target.value)
                  }
                  required
                />
              </div>

              <div className="vehicle-form-group">
                <label htmlFor="vehicle-type">
                  Vehicle Type *
                </label>

                <select
                  id="vehicle-type"
                  value={vehicleType}
                  onChange={(e) =>
                    setVehicleType(e.target.value)
                  }
                >
                  <option value="car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="HiAce">HiAce</option>
                </select>
              </div>

              <div className="vehicle-form-group">
                <label htmlFor="registration-number">
                  Registration Number *
                </label>

                <input
                  id="registration-number"
                  type="text"
                  placeholder="e.g. DHAKA-1234"
                  value={registrationNumber}
                  onChange={(e) =>
                    setRegistrationNumber(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="vehicle-form-group">
                <label htmlFor="ac-type">
                  AC Type *
                </label>

                <select
                  id="ac-type"
                  value={acType}
                  onChange={(e) =>
                    setAcType(e.target.value)
                  }
                >
                  <option value="AC">AC</option>
                  <option value="Non-AC">
                    Non-AC
                  </option>
                </select>
              </div>

              <div className="vehicle-form-group">
                <label htmlFor="total-seats">
                  Total Seats *
                </label>

                <input
                  id="total-seats"
                  type="number"
                  min="1"
                  placeholder="e.g. 5"
                  value={totalSeats}
                  onChange={(e) =>
                    setTotalSeats(e.target.value)
                  }
                  required
                />
              </div>

              <div className="vehicle-form-group">
                <label htmlFor="fuel-type">
                  Fuel Type *
                </label>

                <select
                  id="fuel-type"
                  value={fuelType}
                  onChange={(e) =>
                    setFuelType(e.target.value)
                  }
                >
                  <option value="Petrol">
                    Petrol
                  </option>

                  <option value="Diesel">
                    Diesel
                  </option>

                  <option value="CNG">
                    CNG
                  </option>

                  <option value="Electric">
                    Electric
                  </option>
                </select>
              </div>

              <div className="vehicle-form-group">
                <label htmlFor="suitcase-capacity">
                  Suitcase Capacity *
                </label>

                <input
                  id="suitcase-capacity"
                  type="number"
                  min="0"
                  placeholder="e.g. 5"
                  value={suitcaseCapacity}
                  onChange={(e) =>
                    setSuitcaseCapacity(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="vehicle-form-group">
                <label htmlFor="daily-rent-price">
                  Daily Rent Price (৳) *
                </label>

                <input
                  id="daily-rent-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 350"
                  value={dailyRentPrice}
                  onChange={(e) =>
                    setDailyRentPrice(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="vehicle-form-group">
                <label htmlFor="city">
                  City *
                </label>

                <select
                  id="city"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                >
                  <option value="Dhaka">
                    Dhaka
                  </option>

                  <option value="Rangpur">
                    Rangpur
                  </option>

                  <option value="Chattogram">
                    Chattogram
                  </option>
                </select>
              </div>

              <div className="vehicle-form-group vehicle-image-group">
                <label htmlFor="vehicle-image">
                  Vehicle Image *
                </label>

                <input
                  id="vehicle-image"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  required
                />

                <div className="vehicle-image-help">
                  JPG, JPEG, PNG or WEBP. Maximum size
                  5 MB.
                </div>

                {vehicleImage && (
                  <div className="vehicle-file-name">
                    Selected: {vehicleImage.name}
                  </div>
                )}
              </div>
            </div>

            <div className="vehicle-form-actions">
              <button
                type="button"
                className="vehicle-reset-button"
                onClick={resetForm}
                disabled={saving}
              >
                Reset
              </button>

              <button
                type="submit"
                className="vehicle-submit-button"
                disabled={saving}
              >
                {saving
                  ? "Adding Vehicle..."
                  : "Add Vehicle"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================
          VIEW VEHICLES
      ========================= */}

      {activeTab === "view" && (
        <div className="vehicle-section-card">
          <div className="vehicle-section-header">
            <div>
              <h3>All Vehicles</h3>

              <p>
                View all vehicles currently registered in
                the Rentwise system.
              </p>
            </div>

            <button
              type="button"
              className="vehicle-close-button"
              onClick={() => {
                setActiveTab("none");
                setMessage("");
                setError("");
              }}
            >
              ×
            </button>
          </div>

          {loadingVehicles ? (
            <div className="vehicle-loading">
              <div className="vehicle-loading-spinner"></div>

              <p>Loading vehicles...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="vehicle-view-empty">
              <div className="vehicle-view-empty-icon">
                🚗
              </div>

              <h3>No Vehicles Found</h3>

              <p>
                There are currently no vehicles registered
                in the system.
              </p>
            </div>
          ) : (
            <>
              <div className="vehicle-table-wrapper">
                <table className="vehicle-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vehicle</th>
                      <th>Type</th>
                      <th>Registration</th>
                      <th>AC</th>
                      <th>Seats</th>
                      <th>Fuel</th>
                      <th>Suitcase</th>
                      <th>Daily Rent</th>
                      <th>City</th>
                      <th>Status</th>
                      <th>Added</th>
                    </tr>
                  </thead>

                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td>{vehicle.id}</td>

                        <td>
                          <span className="vehicle-table-name">
                            {vehicle.vehicle_name}
                          </span>
                        </td>

                        <td>{vehicle.type}</td>

                        <td>
                          <span className="vehicle-registration">
                            {
                              vehicle.registration_number
                            }
                          </span>
                        </td>

                        <td>{vehicle.ac_type}</td>

                        <td>{vehicle.total_seats}</td>

                        <td>{vehicle.fuel_type}</td>

                        <td>
                          {vehicle.suitcase_capacity}
                        </td>

                        <td>
                          ৳{" "}
                          {Number(
                            vehicle.daily_rent_price
                          ).toLocaleString("en-BD", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td>{vehicle.city}</td>

                        <td>
                          <span
                            className={`vehicle-table-status ${getStatusClass(
                              vehicle.availability_status
                            )}`}
                          >
                            <span className="vehicle-status-dot"></span>

                            {getStatusText(
                              vehicle.availability_status
                            )}
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            vehicle.created_at
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="vehicle-table-footer">
                Total Vehicles:{" "}
                <strong>{vehicles.length}</strong>
              </div>
            </>
          )}
        </div>
      )}

      {/* =========================
          MAINTENANCE
      ========================= */}

      {activeTab === "maintenance" && (
        <div className="vehicle-section-card">
          <div className="vehicle-section-header">
            <div>
              <h3>Vehicle Maintenance</h3>

              <p>
                Search a vehicle by registration number and
                send it for maintenance if there is no active
                booking.
              </p>
            </div>

            <button
              type="button"
              className="vehicle-close-button"
              onClick={() => {
                setActiveTab("none");
                setMessage("");
                setError("");
                resetMaintenance();
              }}
            >
              ×
            </button>
          </div>

          <div className="vehicle-maintenance-search">
            <div className="vehicle-form-group">
              <label htmlFor="maintenance-registration">
                Registration Number
              </label>

              <input
                id="maintenance-registration"
                type="text"
                placeholder="e.g. DHAKA-1234"
                value={maintenanceRegistration}
                onChange={(e) => {
                  setMaintenanceRegistration(
                    e.target.value
                  );
                  setMaintenanceVehicle(null);
                  setMessage("");
                  setError("");
                }}
              />
            </div>

            <button
              type="button"
              className="vehicle-submit-button"
              onClick={handleCheckMaintenance}
              disabled={checkingMaintenance}
            >
              {checkingMaintenance
                ? "Checking..."
                : "Search Vehicle"}
            </button>
          </div>

          {maintenanceVehicle && (
            <div className="vehicle-maintenance-result">
              <div className="vehicle-maintenance-result-header">
                <div>
                  <h4>
                    {maintenanceVehicle.vehicle_name}
                  </h4>

                  <p>
                    Registration:{" "}
                    <strong>
                      {
                        maintenanceVehicle.registration_number
                      }
                    </strong>
                  </p>
                </div>

                <span
                  className={`vehicle-table-status ${getStatusClass(
                    maintenanceVehicle.availability_status
                  )}`}
                >
                  <span className="vehicle-status-dot"></span>

                  {getStatusText(
                    maintenanceVehicle.availability_status
                  )}
                </span>
              </div>

              <div className="vehicle-maintenance-details">
                <div>
                  <span>Type</span>
                  <strong>
                    {maintenanceVehicle.type}
                  </strong>
                </div>

                <div>
                  <span>City</span>
                  <strong>
                    {maintenanceVehicle.city}
                  </strong>
                </div>

                <div>
                  <span>AC</span>
                  <strong>
                    {maintenanceVehicle.ac_type}
                  </strong>
                </div>

                <div>
                  <span>Seats</span>
                  <strong>
                    {maintenanceVehicle.total_seats}
                  </strong>
                </div>

                <div>
                  <span>Fuel</span>
                  <strong>
                    {maintenanceVehicle.fuel_type}
                  </strong>
                </div>

                <div>
                  <span>Daily Rent</span>
                  <strong>
                    ৳{" "}
                    {Number(
                      maintenanceVehicle.daily_rent_price
                    ).toLocaleString("en-BD", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
              </div>

              {maintenanceVehicle.active_booking ? (
                <div className="vehicle-maintenance-warning">
                  <strong>
                    Maintenance Unavailable
                  </strong>

                  <p>
                    This vehicle cannot be sent for
                    maintenance because it has an active
                    booking from{" "}
                    <strong>
                      {formatDate(
                        maintenanceVehicle.active_booking
                          .start_date
                      )}
                    </strong>{" "}
                    to{" "}
                    <strong>
                      {formatDate(
                        maintenanceVehicle.active_booking
                          .end_date
                      )}
                    </strong>
                    .
                  </p>
                </div>
              ) : maintenanceVehicle.availability_status ===
                "maintenance" ? (
                <div className="vehicle-maintenance-info">
                  This vehicle is already under maintenance.
                </div>
              ) : (
                <div className="vehicle-maintenance-action">
                  <div>
                    <strong>
                      Vehicle is eligible for maintenance
                    </strong>

                    <p>
                      No conflicting active booking was
                      found.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="vehicle-maintenance-button"
                    onClick={
                      handleSendToMaintenance
                    }
                    disabled={sendingToMaintenance}
                  >
                    {sendingToMaintenance
                      ? "Sending..."
                      : "Send to Maintenance"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;