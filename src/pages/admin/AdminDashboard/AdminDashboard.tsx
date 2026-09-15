import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminDashboard.css";

import AdminManagement from "./components/AdminManagement";
import ViewCustomer from "./components/ViewCustomer";
import VehicleManagement from "./components/VehicleManagement";
import ChangePassword from "./components/ChangePassword";

interface Admin {
  id: number;
  name: string;
  phone: string;
  role: string;
}

type ActiveSection =
  | "dashboard"
  | "vehicle-management"
  | "admin-management"
  | "view-customer"
  | "profile";

function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState<Admin | null>(null);

  const [activeSection, setActiveSection] =
    useState<ActiveSection>("dashboard");

  // =====================================================
  // CHECK ADMIN LOGIN
  // =====================================================

  useEffect(() => {
    const loadAdmin = () => {
      const token = localStorage.getItem("token");
      const adminData = localStorage.getItem("admin");

      if (!token || !adminData) {
        navigate("/admin-login");
        return;
      }

      try {
        const parsedAdmin: Admin = JSON.parse(adminData);

        setAdmin(parsedAdmin);
      } catch (error) {
        console.error("Admin data error:", error);

        localStorage.removeItem("admin");
        localStorage.removeItem("token");

        navigate("/admin-login");
      }
    };

    loadAdmin();
  }, [navigate]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/admin-login");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (!admin) {
    return null;
  }

  const isSuperAdmin = admin.role === "super admin";

  // =====================================================
  // TOPBAR TITLE
  // =====================================================

  const getPageTitle = () => {
    switch (activeSection) {
      case "vehicle-management":
        return "Vehicle Management";

      case "admin-management":
        return "Admin Management";

      case "view-customer":
        return "View Customers";

      case "profile":
        return "Profile";

      default:
        return "Dashboard";
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="admin-sidebar">

        {/* Logo */}

        <div className="sidebar-logo">
          Rentwise
        </div>

        {/* Role */}

        <div className="sidebar-role">
          {isSuperAdmin ? "SUPER ADMIN" : "ADMIN"}
        </div>

        {/* Navigation */}

        <nav className="sidebar-nav">

          {/* ================= DASHBOARD ================= */}

          <button
            className={`sidebar-item ${
              activeSection === "dashboard"
                ? "active"
                : ""
            }`}
            type="button"
            onClick={() =>
              setActiveSection("dashboard")
            }
          >
            <span>▣</span>
            Dashboard
          </button>

          {/* ================= HOME ================= */}

          <button
            className="sidebar-item"
            type="button"
            onClick={() => navigate("/")}
          >
            <span>⌂</span>
            Home
          </button>

          {/* ================= VEHICLES ================= */}

          <button
            className={`sidebar-item ${
              activeSection === "vehicle-management"
                ? "active"
                : ""
            }`}
            type="button"
            onClick={() =>
              setActiveSection(
                "vehicle-management"
              )
            }
          >
            <span>🚗</span>
            Vehicles
          </button>

          {/* ================= BOOKINGS ================= */}

          <button
            className="sidebar-item"
            type="button"
          >
            <span>▤</span>
            Bookings
          </button>

          {/* ================= CUSTOMERS ================= */}

          <button
            className={`sidebar-item ${
              activeSection === "view-customer"
                ? "active"
                : ""
            }`}
            type="button"
            onClick={() =>
              setActiveSection("view-customer")
            }
          >
            <span>♙</span>
            Customers
          </button>

          {/* ================= ADMIN MANAGEMENT ================= */}

          {isSuperAdmin && (
            <button
              className={`sidebar-item ${
                activeSection === "admin-management"
                  ? "active"
                  : ""
              }`}
              type="button"
              onClick={() =>
                setActiveSection(
                  "admin-management"
                )
              }
            >
              <span>♙</span>
              Admin Management
            </button>
          )}

          {/* ================= PROFILE ================= */}

          <button
            className={`sidebar-item ${
              activeSection === "profile"
                ? "active"
                : ""
            }`}
            type="button"
            onClick={() =>
              setActiveSection("profile")
            }
          >
            <span>⚙</span>
            Update Profile
          </button>

        </nav>

        {/* ================= LOGOUT ================= */}

        <button
          className="sidebar-logout"
          type="button"
          onClick={handleLogout}
        >
          ↪ Logout
        </button>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="admin-main">

        {/* ===================================================
            TOPBAR
        =================================================== */}

        <header className="admin-topbar">

          <div>

            <h1>
              {getPageTitle()}
            </h1>

            <p>
              Welcome back, {admin.name}
            </p>

          </div>

          {/* ================= ADMIN INFO ================= */}

          <div className="admin-user">

            <div className="admin-avatar">
              {admin.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="admin-user-info">

              <strong>
                {admin.name}
              </strong>

              <span>
                {isSuperAdmin
                  ? "Super Admin"
                  : "Admin"}
              </span>

            </div>

          </div>

        </header>

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        {activeSection === "dashboard" && (
          <section className="dashboard-content">

            {/* ================= WELCOME ================= */}

            <div className="dashboard-welcome">

              <h2>
                Welcome to Rentwise Admin Panel
              </h2>

              <p>
                Manage vehicles, bookings, customers
                and rental operations from one place.
              </p>

            </div>

            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="dashboard-stats">

              {/* Total Vehicles */}

              <div className="stat-card">

                <div className="stat-icon">
                  🚗
                </div>

                <div>
                  <span>
                    Total Vehicles
                  </span>

                  <strong>
                    0
                  </strong>
                </div>

              </div>

              {/* Active Bookings */}

              <div className="stat-card">

                <div className="stat-icon">
                  ▤
                </div>

                <div>
                  <span>
                    Active Bookings
                  </span>

                  <strong>
                    0
                  </strong>
                </div>

              </div>

              {/* Total Customers */}

              <div className="stat-card">

                <div className="stat-icon">
                  ♙
                </div>

                <div>
                  <span>
                    Total Customers
                  </span>

                  <strong>
                    0
                  </strong>
                </div>

              </div>

              {/* Available Vehicles */}

              <div className="stat-card">

                <div className="stat-icon">
                  ✓
                </div>

                <div>
                  <span>
                    Available Vehicles
                  </span>

                  <strong>
                    0
                  </strong>
                </div>

              </div>

            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="dashboard-section">

              <h2>
                Quick Actions
              </h2>

              <div className="quick-actions">

                {/* Add Vehicle */}

                <button
                  type="button"
                  onClick={() =>
                    setActiveSection(
                      "vehicle-management"
                    )
                  }
                >
                  <span>🚗</span>
                  Vehicle Management
                </button>

                {/* View Bookings */}

                <button
                  type="button"
                >
                  <span>▤</span>
                  View Bookings
                </button>

                {/* View Customers */}

                <button
                  type="button"
                  onClick={() =>
                    setActiveSection(
                      "view-customer"
                    )
                  }
                >
                  <span>♙</span>
                  View Customers
                </button>

                {/* Manage Admins */}

                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        "admin-management"
                      )
                    }
                  >
                    <span>＋</span>
                    Manage Admins
                  </button>
                )}

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            VEHICLE MANAGEMENT
        =================================================== */}

        {activeSection === "vehicle-management" && (
          <VehicleManagement
            onBack={() =>
              setActiveSection("dashboard")
            }
          />
        )}

        {/* ===================================================
            ADMIN MANAGEMENT
        =================================================== */}

        {activeSection === "admin-management" &&
          isSuperAdmin && (
            <AdminManagement />
          )}

        {/* ===================================================
            VIEW CUSTOMER
        =================================================== */}

        {activeSection === "view-customer" && (
          <ViewCustomer
            onBack={() =>
              setActiveSection("dashboard")
            }
          />
        )}

        {/* ===================================================
            PROFILE
        =================================================== */}

        {activeSection === "profile" && (
          <ChangePassword />
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;

