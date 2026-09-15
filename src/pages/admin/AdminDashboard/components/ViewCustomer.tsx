import { useState } from "react";
import "./ViewCustomer.css";

interface Customer {
  id: number;
  name: string;
  phone: string;
}

interface CustomerDetails extends Customer {
  email: string | null;
  created_at: string;
}

interface ViewCustomerProps {
  onBack: () => void;
}

function ViewCustomer({ onBack }: ViewCustomerProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetails | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  // =====================================================
  // FETCH ALL CUSTOMERS
  // =====================================================

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/customer",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to load customers."
        );
        return;
      }

      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Get Customers Error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // VIEW CUSTOMER DETAILS
  // =====================================================

  const handleViewDetails = async (id: number) => {
    setIsDetailsLoading(true);
    setDetailsError("");
    setSelectedCustomer(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setDetailsError(
          "Authentication token not found."
        );
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/customer/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setDetailsError(
          data.message ||
            "Failed to load customer details."
        );
        return;
      }

      setSelectedCustomer(data.customer);
    } catch (error) {
      console.error(
        "Get Customer Details Error:",
        error
      );

      setDetailsError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsDetailsLoading(false);
    }
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setDetailsError("");
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="view-customer">

      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        type="button"
        className="view-customer-back"
        onClick={onBack}
      >
        ← Back
      </button>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="view-customer-header">

        <div>
          <h2>View Customers</h2>

          <p>
            View and manage Rentwise customer information.
          </p>
        </div>

        <button
          type="button"
          className="refresh-customers-btn"
          onClick={fetchCustomers}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "↻ Refresh"}
        </button>

      </div>

      {/* =================================================
          FIRST LOAD / CUSTOMER LIST
      ================================================= */}

      {customers.length === 0 && !isLoading && !error && (
        <div className="customer-initial-state">

          {/* <div className="customer-initial-icon">
            ♙
          </div>

          <h3>Customer List</h3> */}

          <p>
            Click below to load all registered customers.
          </p>

          <button
            type="button"
            className="load-customers-btn"
            onClick={fetchCustomers}
          >
            Load Customers
          </button>

        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="customer-error">
          {error}
        </div>
      )}

      {/* =================================================
          CUSTOMER TABLE
      ================================================= */}

      {(customers.length > 0 || isLoading) && (

        <div className="customer-table-card">

          {isLoading ? (

            <div className="customer-loading">
              Loading customers...
            </div>

          ) : customers.length === 0 ? (

            <div className="customer-empty">
              No customers found.
            </div>

          ) : (

            <div className="customer-table-wrapper">

              <table className="customer-table">

                <thead>

                  <tr>
                    <th>SL</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {customers.map(
                    (customer, index) => (

                      <tr key={customer.id}>

                        {/* Serial */}

                        <td>
                          {index + 1}
                        </td>

                        {/* Name */}

                        <td>
                          {customer.name}
                        </td>

                        {/* Phone */}

                        <td>
                          {customer.phone}
                        </td>

                        {/* Action */}

                        <td>

                          <button
                            type="button"
                            className="view-details-btn"
                            onClick={() =>
                              handleViewDetails(
                                customer.id
                              )
                            }
                          >
                            View Details
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}

      {/* =================================================
          CUSTOMER DETAILS LOADING MODAL
      ================================================= */}

      {isDetailsLoading && (

        <div className="customer-modal-overlay">

          <div className="customer-loading-modal">

            Loading customer details...

          </div>

        </div>

      )}

      {/* =================================================
          DETAILS ERROR MODAL
      ================================================= */}

      {detailsError && !isDetailsLoading && (

        <div className="customer-modal-overlay">

          <div className="customer-modal error-modal">

            <button
              type="button"
              className="customer-modal-close"
              onClick={handleCloseModal}
            >
              ×
            </button>

            <h3>
              Unable to Load Details
            </h3>

            <p>
              {detailsError}
            </p>

            <button
              type="button"
              className="modal-ok-btn"
              onClick={handleCloseModal}
            >
              OK
            </button>

          </div>

        </div>

      )}

      {/* =================================================
          CUSTOMER DETAILS MODAL
      ================================================= */}

      {selectedCustomer && (

        <div
          className="customer-modal-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="customer-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Close */}

            <button
              type="button"
              className="customer-modal-close"
              onClick={handleCloseModal}
            >
              ×
            </button>

            {/* Header */}

            <div className="customer-modal-header">

              <h3>
                Customer Details
              </h3>

              <p>
                Complete customer information
              </p>

            </div>

            {/* Details */}

            <div className="customer-details">

              <div className="customer-detail-row">

                <span className="detail-label">
                  Customer ID
                </span>

                <span className="detail-value">
                  {selectedCustomer.id}
                </span>

              </div>

              <div className="customer-detail-row">

                <span className="detail-label">
                  Full Name
                </span>

                <span className="detail-value">
                  {selectedCustomer.name}
                </span>

              </div>

              <div className="customer-detail-row">

                <span className="detail-label">
                  Email
                </span>

                <span className="detail-value">
                  {selectedCustomer.email ||
                    "Not provided"}
                </span>

              </div>

              <div className="customer-detail-row">

                <span className="detail-label">
                  Phone Number
                </span>

                <span className="detail-value">
                  {selectedCustomer.phone}
                </span>

              </div>

              <div className="customer-detail-row">

                <span className="detail-label">
                  Account Created
                </span>

                <span className="detail-value">
                  {formatDate(
                    selectedCustomer.created_at
                  )}
                </span>

              </div>

            </div>

            {/* Close */}

            <button
              type="button"
              className="modal-close-btn"
              onClick={handleCloseModal}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default ViewCustomer;