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
  daily_rent_price: number;
  city: string;
  availability_status: "available" | "booked" | "maintenance";
  image?: string | null;
  created_at?: string;
}

interface VehicleManagementProps {
  onBack: () => void;
}

interface VehicleForm {
  vehicle_name: string;
  type: string;
  registration_number: string;
  ac_type: string;
  total_seats: string;
  fuel_type: string;
  suitcase_capacity: string;
  daily_rent_price: string;
  city: string;
  image: File | null;
}

interface SearchResult {
  vehicle: Vehicle;
  available: boolean;
  message?: string;
}

const initialForm: VehicleForm = {
  vehicle_name: "",
  type: "",
  registration_number: "",
  ac_type: "",
  total_seats: "",
  fuel_type: "",
  suitcase_capacity: "",
  daily_rent_price: "",
  city: "",
  image: null,
};

const VehicleManagement = ({
  onBack,
}: VehicleManagementProps) => {
  const [activeTab, setActiveTab] = useState<
    "none" | "add" | "manage"
  >("none");

  const [form, setForm] =
    useState<VehicleForm>(initialForm);

  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [searchRegistration, setSearchRegistration] =
    useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchStartTime, setSearchStartTime] =
    useState("");
  const [searchEndTime, setSearchEndTime] =
    useState("");

  const [searchResult, setSearchResult] =
    useState<SearchResult | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    setError("");
    setMessage("");

    if (!file) {
      setForm((prev) => ({
        ...prev,
        image: null,
      }));
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Invalid image format. Please select JPG, JPEG, PNG or WEBP."
      );

      e.target.value = "";

      setForm((prev) => ({
        ...prev,
        image: null,
      }));

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image size must not exceed 5 MB.");

      e.target.value = "";

      setForm((prev) => ({
        ...prev,
        image: null,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setError("");
  };

  const handleAddVehicle = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    if (!form.image) {
      setError(
        "Vehicle image is required. Please select an image."
      );
      return;
    }

    if (
      !form.vehicle_name ||
      !form.type ||
      !form.registration_number ||
      !form.ac_type ||
      !form.total_seats ||
      !form.fuel_type ||
      form.suitcase_capacity === "" ||
      !form.daily_rent_price ||
      !form.city
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "vehicle_name",
        form.vehicle_name
      );

      formData.append("type", form.type);

      formData.append(
        "registration_number",
        form.registration_number
      );

      formData.append("ac_type", form.ac_type);

      formData.append(
        "total_seats",
        form.total_seats
      );

      formData.append(
        "fuel_type",
        form.fuel_type
      );

      formData.append(
        "suitcase_capacity",
        form.suitcase_capacity
      );

      formData.append(
        "daily_rent_price",
        form.daily_rent_price
      );

      formData.append("city", form.city);

      formData.append("image", form.image);

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

      setMessage("Vehicle added successfully.");
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

  const handleSearchVehicle = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setSearchResult(null);

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    if (!searchRegistration.trim()) {
      setError(
        "Please enter a registration number."
      );
      return;
    }

    if (!searchDate) {
      setError("Please select a date.");
      return;
    }

    if (!searchStartTime || !searchEndTime) {
      setError(
        "Please select start and end time."
      );
      return;
    }

    if (searchEndTime <= searchStartTime) {
      setError(
        "End time must be later than start time."
      );
      return;
    }

    try {
      setSearching(true);

      const params = new URLSearchParams({
        registration_number:
          searchRegistration.trim(),
        date: searchDate,
        start_time: searchStartTime,
        end_time: searchEndTime,
      });

      const response = await fetch(
        `http://localhost:5000/api/vehicle/search?${params.toString()}`,
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
          data.message || "Vehicle search failed."
        );
      }

      setSearchResult({
        vehicle: data.vehicle,
        available:
          data.available ??
          data.vehicle?.availability_status ===
            "available",
        message: data.message,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Vehicle search failed."
      );
    } finally {
      setSearching(false);
    }
  };

  const handleSendToMaintenance = async () => {
    setMessage("");
    setError("");

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    if (!searchResult?.vehicle) {
      setError(
        "Please search for a vehicle first."
      );
      return;
    }

    if (!searchResult.available) {
      setError(
        "This vehicle is not available for the selected time."
      );
      return;
    }

    try {
      setMaintenanceLoading(true);

      const startDateTime = `${searchDate}T${searchStartTime}`;
      const endDateTime = `${searchDate}T${searchEndTime}`;

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
              searchResult.vehicle
                .registration_number,
            start_date: startDateTime,
            end_date: endDateTime,
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
        "Vehicle has been scheduled for maintenance successfully."
      );

      setSearchResult((prev) =>
        prev
          ? {
              ...prev,
              available: false,
              message:
                "Vehicle is scheduled for maintenance for the selected period.",
            }
          : null
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send vehicle to maintenance."
      );
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const getStatusClass = (
    status: Vehicle["availability_status"]
  ) => {
    switch (status) {
      case "available":
        return "available";

      case "booked":
        return "booked";

      case "maintenance":
        return "maintenance";

      default:
        return "";
    }
  };

  const getStatusText = (
    status: Vehicle["availability_status"]
  ) => {
    switch (status) {
      case "available":
        return "Available";

      case "booked":
        return "Booked";

      case "maintenance":
        return "Maintenance";

      default:
        return status;
    }
  };

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
          Add new vehicles and manage vehicle
          availability.
        </p>
      </div>

      <div className="vehicle-management-options">

        <button
          type="button"
          className={`vehicle-option-button ${
            activeTab === "add" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab(
              activeTab === "add" ? "none" : "add"
            );
            setMessage("");
            setError("");
          }}
        >
          <span className="vehicle-option-icon">
            ＋
          </span>

          <span>
            <strong>Add New Vehicle</strong>
            <small>
              Add a vehicle to Rentwise
            </small>
          </span>
        </button>

        <button
          type="button"
          className={`vehicle-option-button ${
            activeTab === "manage" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab(
              activeTab === "manage"
                ? "none"
                : "manage"
            );
            setMessage("");
            setError("");
          }}
        >
          <span className="vehicle-option-icon">
          🛠️
          </span>

          <span>
            <strong>Maintenance</strong>
            <small>
              Send vehicles for repair and maintenance
            </small>
          </span>
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

      {activeTab === "add" && (
        <div className="vehicle-section-card">

          <div className="vehicle-section-header">
            <div>
              <h3>Add New Vehicle</h3>
              <p>
                Enter the vehicle information below.
              </p>
            </div>

            <button
              type="button"
              className="vehicle-close-button"
              onClick={() => setActiveTab("none")}
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
                <label>
                  Vehicle Name *
                </label>

                <input
                  type="text"
                  name="vehicle_name"
                  value={form.vehicle_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Toyota Premio"
                />
              </div>

              <div className="vehicle-form-group">
                <label>
                  Registration Number *
                </label>

                <input
                  type="text"
                  name="registration_number"
                  value={
                    form.registration_number
                  }
                  onChange={handleInputChange}
                  placeholder="e.g. DHA-METRO-GA-1234"
                />
              </div>

              <div className="vehicle-form-group">
                <label>
                  Vehicle Type *
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                >
                  <option value="">
                    Select vehicle type
                  </option>

                  <option value="car">
                    Car
                  </option>

                  <option value="SUV">
                    SUV
                  </option>

                  <option value="HiAce">
                    HiAce
                  </option>
                </select>
              </div>

              <div className="vehicle-form-group">
                <label>
                  AC Type *
                </label>

                <select
                  name="ac_type"
                  value={form.ac_type}
                  onChange={handleInputChange}
                >
                  <option value="">
                    Select AC type
                  </option>

                  <option value="AC">
                    AC
                  </option>

                  <option value="Non-AC">
                    Non-AC
                  </option>
                </select>
              </div>

              <div className="vehicle-form-group">
                <label>
                  Total Seats *
                </label>

                <input
                  type="number"
                  min="1"
                  name="total_seats"
                  value={form.total_seats}
                  onChange={handleInputChange}
                  placeholder="e.g. 5"
                />
              </div>

              <div className="vehicle-form-group">
                <label>
                  Fuel Type *
                </label>

                <select
                  name="fuel_type"
                  value={form.fuel_type}
                  onChange={handleInputChange}
                >
                  <option value="">
                    Select fuel type
                  </option>

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
                <label>
                  Suitcase Capacity *
                </label>

                <input
                  type="number"
                  min="0"
                  name="suitcase_capacity"
                  value={
                    form.suitcase_capacity
                  }
                  onChange={handleInputChange}
                  placeholder="e.g. 3"
                />
              </div>

              <div className="vehicle-form-group">
                <label>
                  Daily Rent Price *
                </label>

                <input
                  type="number"
                  min="1"
                  name="daily_rent_price"
                  value={
                    form.daily_rent_price
                  }
                  onChange={handleInputChange}
                  placeholder="e.g. 3500"
                />
              </div>

              <div className="vehicle-form-group">
                <label>
                  City *
                </label>

                <select
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                >
                  <option value="">
                    Select city
                  </option>

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
                <label>
                  Vehicle Image *
                </label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  required
                  onChange={handleImageChange}
                />

                <small className="vehicle-image-help">
                  Supported formats: JPG, JPEG, PNG,
                  WEBP • Maximum size: 5 MB
                </small>

                {form.image && (
                  <span className="vehicle-file-name">
                    {form.image.name}
                  </span>
                )}
              </div>

            </div>

            <div className="vehicle-form-actions">

              <button
                type="button"
                className="vehicle-reset-button"
                onClick={resetForm}
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

      {activeTab === "manage" && (
        <div className="vehicle-section-card">

          <div className="vehicle-section-header">
            <div>
              <h3>Manage Vehicles</h3>

              <p>
                Search a vehicle by registration
                number and check its availability
                for a specific time.
              </p>
            </div>

            <button
              type="button"
              className="vehicle-close-button"
              onClick={() => setActiveTab("none")}
            >
              ×
            </button>
          </div>

          <form
            className="vehicle-search-form"
            onSubmit={handleSearchVehicle}
          >

            <div className="vehicle-search-field">
              <label>
                Registration Number *
              </label>

              <input
                type="text"
                value={searchRegistration}
                onChange={(e) =>
                  setSearchRegistration(
                    e.target.value
                  )
                }
                placeholder="Enter registration number"
              />
            </div>

            <div className="vehicle-search-field">
              <label>Date *</label>

              <input
                type="date"
                value={searchDate}
                onChange={(e) =>
                  setSearchDate(e.target.value)
                }
              />
            </div>

            <div className="vehicle-search-field">
              <label>Start Time *</label>

              <input
                type="time"
                value={searchStartTime}
                onChange={(e) =>
                  setSearchStartTime(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="vehicle-search-field">
              <label>End Time *</label>

              <input
                type="time"
                value={searchEndTime}
                onChange={(e) =>
                  setSearchEndTime(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              type="submit"
              className="vehicle-search-button"
              disabled={searching}
            >
              {searching
                ? "Searching..."
                : "Search Vehicle"}
            </button>

          </form>

          {searchResult && (
            <div className="vehicle-search-result">

              <div className="vehicle-result-header">
                <div>
                  <h3>
                    {
                      searchResult.vehicle
                        .vehicle_name
                    }
                  </h3>

                  <p>
                    {
                      searchResult.vehicle
                        .registration_number
                    }
                  </p>
                </div>

                <span
                  className={`vehicle-status ${
                    searchResult.available
                      ? "available"
                      : "booked"
                  }`}
                >
                  {searchResult.available
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>

              <div className="vehicle-result-details">

                <div>
                  <span>Type</span>

                  <strong>
                    {searchResult.vehicle.type}
                  </strong>
                </div>

                <div>
                  <span>AC Type</span>

                  <strong>
                    {
                      searchResult.vehicle
                        .ac_type
                    }
                  </strong>
                </div>

                <div>
                  <span>Seats</span>

                  <strong>
                    {
                      searchResult.vehicle
                        .total_seats
                    }
                  </strong>
                </div>

                <div>
                  <span>Fuel</span>

                  <strong>
                    {
                      searchResult.vehicle
                        .fuel_type
                    }
                  </strong>
                </div>

                <div>
                  <span>City</span>

                  <strong>
                    {
                      searchResult.vehicle.city
                    }
                  </strong>
                </div>

                <div>
                  <span>Current Status</span>

                  <strong
                    className={`result-status ${getStatusClass(
                      searchResult.vehicle
                        .availability_status
                    )}`}
                  >
                    {getStatusText(
                      searchResult.vehicle
                        .availability_status
                    )}
                  </strong>
                </div>

              </div>

              <div className="vehicle-maintenance-info">

                <div>
                  <strong>
                    Selected Maintenance Period
                  </strong>

                  <p>
                    {searchDate} &nbsp;
                    {searchStartTime}
                    {" — "}
                    {searchEndTime}
                  </p>
                </div>

                <button
                  type="button"
                  className="vehicle-maintenance-button"
                  disabled={
                    !searchResult.available ||
                    maintenanceLoading
                  }
                  onClick={
                    handleSendToMaintenance
                  }
                >
                  {maintenanceLoading
                    ? "Scheduling..."
                    : "Send to Maintenance"}
                </button>

              </div>

              {searchResult.message && (
                <div className="vehicle-result-message">
                  {searchResult.message}
                </div>
              )}

            </div>
          )}

          {!searchResult && !searching && (
            <div className="vehicle-search-empty">

              <div className="vehicle-search-empty-icon">
                ⌕
              </div>

              <h3>
                Search for a Vehicle
              </h3>

              <p>
                Enter a registration number and
                select the date and time to check
                whether the vehicle is available
                for maintenance.
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default VehicleManagement;







