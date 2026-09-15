import { useEffect, useState } from "react";
import "./AdminList.css";

interface Admin {
  id: number;
  name: string;
  phone: string;
  role: string;
  status: string;
  disabled_by: number | null;
  disabled_by_name: string | null;
  disabled_at: string | null;
}

interface AdminListProps {
  onBack: () => void;
}

function AdminList({ onBack }: AdminListProps) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/admin",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load admin list.");
        return;
      }

      setAdmins(data.admins);
    } catch (error) {
      console.error("Admin List Error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleToggleStatus = async (
    id: number,
    currentStatus: string
  ) => {
    const isActive = currentStatus === "active";

    const action = isActive
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      isActive
        ? "Are you sure you want to deactivate this admin?"
        : "Are you sure you want to activate this admin?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || `Failed to ${action} admin.`);
        return;
      }

      fetchAdmins();
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("Unable to connect to the server.");
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="admin-list-container">

      <button
        type="button"
        className="admin-list-back"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="admin-list-header">
        <div>
          <h2>Admin List</h2>
          <p>View and manage Rentwise administrators</p>
        </div>

        <button
          type="button"
          className="refresh-admin-btn"
          onClick={fetchAdmins}
        >
          ↻ Refresh
        </button>
      </div>

      {loading && (
        <div className="admin-list-message">
          Loading admins...
        </div>
      )}

      {error && (
        <div className="admin-list-error">
          {error}
        </div>
      )}

      {!loading && !error && admins.length === 0 && (
        <div className="admin-list-empty">
          No normal admin found.
        </div>
      )}

      {!loading && !error && admins.length > 0 && (
        <div className="admin-table-wrapper">
          <table className="admin-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Deactivated By</th>
                <th>Deactivated At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => {
                const isActive = admin.status === "active";

                return (
                  <tr key={admin.id}>

                    <td>
                      <div className="admin-name">
                        {admin.name}
                      </div>
                    </td>

                    <td>
                      {admin.phone}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          isActive
                            ? "active"
                            : "deactivated"
                        }`}
                      >
                        <span className="status-dot"></span>

                        {isActive
                          ? "Active"
                          : "Deactivated"}
                      </span>
                    </td>

                    <td>
                      {admin.disabled_by_name || "—"}
                    </td>

                    <td>
                      {formatDate(admin.disabled_at)}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`status-action-btn ${
                          isActive
                            ? "deactivate-btn"
                            : "activate-btn"
                        }`}
                        onClick={() =>
                          handleToggleStatus(
                            admin.id,
                            admin.status
                          )
                        }
                      >
                        {isActive
                          ? "Deactivate Admin"
                          : "Activate Admin"}
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default AdminList;