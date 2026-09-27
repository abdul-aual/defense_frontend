import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SearchResults.css";

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

interface SearchState {
  vehicles?: Vehicle[];
  searchCriteria?: SearchCriteria;
}

type AcFilter = "all" | "AC" | "Non-AC";

type PriceSort =
  | "recommended"
  | "low-to-high"
  | "high-to-low";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);

  const [acFilter, setAcFilter] =
    useState<AcFilter>("all");

  const [priceSort, setPriceSort] =
    useState<PriceSort>("recommended");

  const state = location.state as SearchState | null;

  const vehicles = state?.vehicles || [];
  const searchCriteria = state?.searchCriteria;

  const calculateDays = () => {
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

  const rentalDays = calculateDays();

  const formatDate = (date: string) => {
    if (!date) return "";

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return Number(price).toLocaleString("en-BD");
  };

  const getImageUrl = (image: string) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:5000/${image.replace(
      /^\/+/,
      ""
    )}`;
  };

  const handleBookNow = (vehicle: Vehicle) => {
    if (!searchCriteria) {
      navigate("/");
      return;
    }
  
    navigate(`/booking/${vehicle.id}`, {
      state: {
        vehicle,
        searchCriteria,
      },
    });
  };

  /*
   * =========================
   * FILTER + SORT
   * =========================
   */

  const filteredVehicles = vehicles
    .filter((vehicle) => {
      if (acFilter === "all") {
        return true;
      }

      return vehicle.ac_type === acFilter;
    })
    .sort((a, b) => {
      if (priceSort === "low-to-high") {
        return (
          Number(a.daily_rent_price) -
          Number(b.daily_rent_price)
        );
      }

      if (priceSort === "high-to-low") {
        return (
          Number(b.daily_rent_price) -
          Number(a.daily_rent_price)
        );
      }

      return 0;
    });

  const hasActiveFilter =
    acFilter !== "all" ||
    priceSort !== "recommended";

  if (!searchCriteria) {
    return (
      <div className="search-results-page">
        <div className="search-results-container">
          <div className="search-error-box">
            <h2>Search information not found</h2>

            <p>
              Please go back to the home page and search
              for a vehicle again.
            </p>

            <button
              onClick={() => navigate("/")}
              className="search-again-btn"
            >
              Search Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-results-container">

        {/* =========================
            SEARCH HEADER
        ========================= */}

        <div className="search-results-header">
          <div>
            <h1>Available Vehicles</h1>

            <div className="search-summary">
              <span>
                <strong>
                  {searchCriteria.vehicleType}
                </strong>
              </span>

              <span>
                <strong>
                  {searchCriteria.city}
                </strong>
              </span>

              <span>
                {formatDate(searchCriteria.startDate)}
                {" – "}
                {formatDate(searchCriteria.endDate)}
              </span>

              <span>
                {rentalDays}{" "}
                {rentalDays === 1
                  ? "day"
                  : "days"}
              </span>
            </div>
          </div>

          {/* =========================
              HEADER ACTIONS
          ========================= */}

          <div className="search-header-actions">

            <button
              className={`filter-search-btn ${
                hasActiveFilter
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setShowFilters(!showFilters)
              }
            >
              <span className="filter-icon">
                ☷
              </span>

              Filter & Sort

              {hasActiveFilter && (
                <span className="filter-active-dot">
                  ●
                </span>
              )}
            </button>

            <button
              className="modify-search-btn"
              onClick={() => navigate("/")}
            >
              Modify Search
            </button>

          </div>
        </div>

        {/* =========================
            FILTER PANEL
        ========================= */}

        {showFilters && (
          <div className="filter-panel">

            <div className="filter-panel-header">
              <div>
                <h3>Filter & Sort</h3>

                <p>
                  Refine vehicles according to your
                  preference.
                </p>
              </div>

              {hasActiveFilter && (
                <button
                  className="clear-filter-btn"
                  onClick={() => {
                    setAcFilter("all");
                    setPriceSort("recommended");
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="filter-options">

              {/* AC FILTER */}

              <div className="filter-group">
                <label>
                  Air Conditioning
                </label>

                <select
                  value={acFilter}
                  onChange={(e) =>
                    setAcFilter(
                      e.target.value as AcFilter
                    )
                  }
                >
                  <option value="all">
                    All Vehicles
                  </option>

                  <option value="AC">
                    AC
                  </option>

                  <option value="Non-AC">
                    Non-AC
                  </option>
                </select>
              </div>

              {/* PRICE SORT */}

              <div className="filter-group">
                <label>
                  Sort by Price
                </label>

                <select
                  value={priceSort}
                  onChange={(e) =>
                    setPriceSort(
                      e.target.value as PriceSort
                    )
                  }
                >
                  <option value="recommended">
                    Recommended
                  </option>

                  <option value="low-to-high">
                    Price: Low to High
                  </option>

                  <option value="high-to-low">
                    Price: High to Low
                  </option>
                </select>
              </div>

            </div>
          </div>
        )}

        {/* =========================
            RESULT COUNT
        ========================= */}

        {vehicles.length > 0 && (
          <div className="result-count">

            {filteredVehicles.length}{" "}
            {filteredVehicles.length === 1
              ? "vehicle"
              : "vehicles"}{" "}
            available

            {hasActiveFilter && (
              <span className="filtered-text">
                {" "}
                • Filtered
              </span>
            )}

          </div>
        )}

        {/* =========================
            NO RESULT
        ========================= */}

        {filteredVehicles.length === 0 ? (
          <div className="no-vehicles">

            <div className="no-vehicles-icon">
              🚗
            </div>

            <h2>
              {vehicles.length === 0
                ? "No vehicles available"
                : "No matching vehicles"}
            </h2>

            <p>
              {vehicles.length === 0
                ? "We couldn't find any vehicle matching your selected dates, vehicle type, and city."
                : "No vehicles match your selected filter. Try changing the AC type or price sorting."}
            </p>

            {vehicles.length === 0 ? (
              <button
                className="search-again-btn"
                onClick={() => navigate("/")}
              >
                Search Again
              </button>
            ) : (
              <button
                className="search-again-btn"
                onClick={() => {
                  setAcFilter("all");
                  setPriceSort("recommended");
                }}
              >
                Clear Filters
              </button>
            )}

          </div>
        ) : (
          /* =========================
             VEHICLE LIST
          ========================= */

          <div className="vehicle-results-list">

            {filteredVehicles.map((vehicle) => {

              const totalRent =
                Number(
                  vehicle.daily_rent_price
                ) * rentalDays;

              return (
                <div
                  className="rental-vehicle-card"
                  key={vehicle.id}
                >

                  {/* =========================
                      LEFT INFORMATION
                  ========================= */}

                  <div className="rental-card-left">

                    <h2 className="rental-vehicle-title">
                      {vehicle.vehicle_name}
                    </h2>

                    <p className="rental-vehicle-type">
                      <strong>
                        {vehicle.type}
                      </strong>

                      {" • "}

                      {vehicle.ac_type}
                    </p>

                    <div className="vehicle-highlight">
                      {vehicle.fuel_type} fuel
                    </div>

                    <div className="vehicle-features">

                      <span>
                        {vehicle.total_seats} Seats
                      </span>

                      <span>
                        {vehicle.suitcase_capacity} Luggage
                      </span>

                    </div>

                    <div className="vehicle-location">

                      <span className="location-icon">
                        ●
                      </span>

                      <span>
                        Available in{" "}
                        <strong>
                          {vehicle.city}
                        </strong>
                      </span>

                    </div>

                  </div>

                  {/* =========================
                      MIDDLE IMAGE
                  ========================= */}

                  <div className="rental-card-middle">

                    <div className="vehicle-image-container">

                      {vehicle.image ? (
                        <img
                          src={getImageUrl(
                            vehicle.image
                          )}
                          alt={
                            vehicle.vehicle_name
                          }
                          className="rental-vehicle-image"
                        />
                      ) : (
                        <div className="vehicle-image-placeholder">
                          No Image
                        </div>
                      )}

                    </div>

                    <div className="capacity-specs">

                      <span>
                        <span className="spec-icon">
                          ♙
                        </span>

                        x {vehicle.total_seats}
                      </span>

                      <span>
                        <span className="spec-icon">
                          ▣
                        </span>

                        x{" "}
                        {vehicle.suitcase_capacity}
                      </span>

                    </div>

                  </div>

                  {/* =========================
                      RIGHT PRICE
                  ========================= */}

                  <div className="rental-card-right">

                    <div className="price-box">

                      <div className="main-price">

                        ৳
                        {formatPrice(
                          Number(
                            vehicle.daily_rent_price
                          )
                        )}

                        <span className="price-unit">
                          /day
                        </span>

                      </div>

                      <div className="total-price">
                        ৳
                        {formatPrice(
                          totalRent
                        )}
                        {" "}total
                      </div>

                      <div className="rental-days-text">
                        {rentalDays}{" "}
                        {rentalDays === 1
                          ? "day"
                          : "days"}{" "}
                        rental
                      </div>

                    </div>

                    <button
  className="book-now-btn"
  onClick={() =>
    handleBookNow(vehicle)
  }
>
  Book Now
</button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default SearchResults;