import { useState } from "react";
import "./AdminManagement.css";
import AdminList from "./AdminList";
import CreateAdmin from "./CreateAdmin";

type ManagementSection = "menu" | "list" | "create";

function AdminManagement() {
  const [selectedOption, setSelectedOption] =
    useState<ManagementSection>("menu");

  const handleBackToDashboard = () => {
    setSelectedOption("menu");
  };

  return (
    <div className="admin-management">

  
      {/* ================= MENU ================= */}

      {selectedOption === "menu" && (
        <>
          <div className="management-header">
            <h2>Admin Management</h2>

            <p>
              Manage Rentwise administrators
            </p>
          </div>

          <div className="management-options">

            {/* Admin List */}
            <button
              type="button"
              className="management-card"
              onClick={() =>
                setSelectedOption("list")
              }
            >
              <div className="management-icon">
                ♙
              </div>

              <h3>
                Admin List
              </h3>

              <p>
                View and manage existing administrators
              </p>
            </button>

            {/* Create Admin */}
            <button
              type="button"
              className="management-card"
              onClick={() =>
                setSelectedOption("create")
              }
            >
              <div className="management-icon">
                ＋
              </div>

              <h3>
                Create Admin
              </h3>

              <p>
                Create a new administrator account
              </p>
            </button>

          </div>
        </>
      )}

      {/* ================= ADMIN LIST ================= */}

      {selectedOption === "list" && (
        <AdminList
          onBack={handleBackToDashboard}
        />
      )}

      {/* ================= CREATE ADMIN ================= */}

      {selectedOption === "create" && (
        <CreateAdmin
          onBack={handleBackToDashboard}
        />
      )}

    </div>
  );
}

export default AdminManagement;