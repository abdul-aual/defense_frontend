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
  availability_status: "available" | "Booked";
  image?: string | null;
  created_at?: string;
}

interface VehicleManagementProps {
  onBack: () => void;
}

const VehicleManagement = ({
  onBack,
}: VehicleManagementProps) => {
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState<
    "none" | "add" | "view"
  >("none");

  // =========================
  // ADD VEHICLE STATES
  // =========================

  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [registrationNumber, setRegistrationNumber] = useState("");
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

      // If View Vehicles was previously opened,
      // refresh the vehicle list after adding.
      if (activeTab === "view") {
        handleViewVehicles();
      }
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
  // STATUS
  // =========================

  const getStatusClass = (
    status: Vehicle["availability_status"]
  ) => {
    if (status === "available") {
      return "available";
    }

    if (status === "Booked") {
      return "booked";
    }

    return "";
  };

  const getStatusText = (
    status: Vehicle["availability_status"]
  ) => {
    if (status === "available") {
      return "Available";
    }

    if (status === "Booked") {
      return "Booked";
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
    tab: "add" | "view"
  ) => {
    setMessage("");
    setError("");
    setActiveTab(tab);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="vehicle-management">
      {/* =========================
          HEADER
      ========================= */}

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
          Add new vehicles and view all vehicles registered
          in Rentwise.
        </p>
      </div>

      {/* =========================
          TOP OPTIONS
      ========================= */}

      <div className="vehicle-management-options">
        {/* ADD VEHICLE */}

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

        {/* VIEW VEHICLES */}

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
      </div>

      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {message && (
        <div className="vehicle-success-message">
          {message}
        </div>
      )}

      {/* =========================
          ERROR MESSAGE
      ========================= */}

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
              {/* VEHICLE NAME */}

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

              {/* VEHICLE TYPE */}

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

              {/* REGISTRATION */}

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

              {/* AC TYPE */}

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

              {/* SEATS */}

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

              {/* FUEL */}

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

              {/* SUITCASE */}

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

              {/* DAILY RENT */}

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

              {/* CITY */}

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

              {/* IMAGE */}

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

            {/* FORM ACTIONS */}

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

          {/* LOADING */}

          {loadingVehicles ? (
            <div className="vehicle-loading">
              <div className="vehicle-loading-spinner"></div>

              <p>Loading vehicles...</p>
            </div>
          ) : vehicles.length === 0 ? (
            /* EMPTY */

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
            /* TABLE */

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
                        {/* ID */}

                        <td>{vehicle.id}</td>

                        {/* VEHICLE */}

                        <td>
                          <span className="vehicle-table-name">
                            {vehicle.vehicle_name}
                          </span>
                        </td>

                        {/* TYPE */}

                        <td>{vehicle.type}</td>

                        {/* REGISTRATION */}

                        <td>
                          <span className="vehicle-registration">
                            {
                              vehicle.registration_number
                            }
                          </span>
                        </td>

                        {/* AC */}

                        <td>{vehicle.ac_type}</td>

                        {/* SEATS */}

                        <td>{vehicle.total_seats}</td>

                        {/* FUEL */}

                        <td>{vehicle.fuel_type}</td>

                        {/* SUITCASE */}

                        <td>
                          {vehicle.suitcase_capacity}
                        </td>

                        {/* DAILY RENT */}

                        <td>
                          ৳{" "}
                          {Number(
                            vehicle.daily_rent_price
                          ).toLocaleString("en-BD", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        {/* CITY */}

                        <td>{vehicle.city}</td>

                        {/* STATUS */}

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

                        {/* ADDED */}

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

              {/* TABLE FOOTER */}

              <div className="vehicle-table-footer">
                Total Vehicles:{" "}
                <strong>{vehicles.length}</strong>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;