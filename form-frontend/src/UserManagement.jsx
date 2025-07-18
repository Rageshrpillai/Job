import React, { useState, useEffect, useCallback } from "react";
import api from "./api";
import UserToolbar from "./UserToolbar";
import UserTable from "./UserTable";
import ReasonInputModal from "./ReasonInputModal";
import UserDetailModal from "./UserDetailModal";
import AdvancedFilterModal from "./AdvancedFilterModal";

// **NEW**: A robust, timezone-safe date formatting function
const formatDateForAPI = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [dateFilters, setDateFilters] = useState({
    startDate: null,
    endDate: null,
  });
  const [dateType, setDateType] = useState("created_at");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonModalConfig, setReasonModalConfig] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = {
      filter: activeFilter,
      search: searchTerm,
      sort_by: sortBy,
      sort_direction: sortDirection,
      date_type: dateFilters.startDate ? dateType : null,
      // **FIX**: Use the new timezone-safe formatting function
      date_from: formatDateForAPI(dateFilters.startDate),
      date_to: formatDateForAPI(dateFilters.endDate),
    };

    Object.keys(params).forEach((key) => {
      if (params[key] === null || params[key] === "") {
        delete params[key];
      }
    });

    api
      .get("/api/admin/users", { params })
      .then((response) => setUsers(response.data))
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setError("Could not load user data.");
      })
      .finally(() => setLoading(false));
  }, [activeFilter, searchTerm, sortBy, sortDirection, dateFilters, dateType]);

  useEffect(() => {
    const handler = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(handler);
  }, [fetchUsers]);

  const handleSelectUser = (userId, isSelected) => {
    if (isSelected) {
      setSelectedUserIds((prev) => [...prev, userId]);
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedUserIds(users.map((user) => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleBulkAction = (action) => {
    if (!action || selectedUserIds.length === 0) return;

    if (
      ["delete", "block", "restore", "unblock"].includes(action) &&
      !window.confirm(
        `Are you sure you want to ${action} ${selectedUserIds.length} selected users?`
      )
    ) {
      return;
    }

    api
      .post("/api/admin/users/bulk-action", {
        action,
        userIds: selectedUserIds,
      })
      .then(() => {
        fetchUsers();
        setSelectedUserIds([]);
      })
      .catch((err) =>
        alert(
          `Error performing bulk action: ${
            err.response?.data?.message || "An error occurred."
          }`
        )
      );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      // If the same column is clicked, toggle the direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If a new column is clicked, set it as the sort column and default to ascending
      setSortBy(column);
      setSortDirection("asc");
    }
  };
  const handleAction = (action, userId, confirmationMessage = null) => {
    if (confirmationMessage && !window.confirm(confirmationMessage)) return;

    const requiresReason = ["block", "soft-delete"].includes(action);
    if (requiresReason) {
      setReasonModalConfig({
        title: `Reason for ${action.replace("-", " ")}ing User`,
        onConfirm: (reason) => performAction(action, userId, { reason }),
      });
      setShowReasonModal(true);
    } else {
      performAction(action, userId);
    }
  };

  const performAction = (action, userId, data = {}) => {
    const urlMap = {
      approve: `/api/admin/users/${userId}/approve`,
      block: `/api/admin/users/${userId}/block`,
      unblock: `/api/admin/users/${userId}/unblock`,
      "soft-delete": `/api/admin/users/${userId}`,
      restore: `/api/admin/users/${userId}/restore`,
      "force-delete": `/api/admin/users/${userId}/force-delete`,
    };
    const url = urlMap[action];
    let apiPromise;

    if (action === "soft-delete" || action === "force-delete") {
      apiPromise = api.delete(url, { data: data });
    } else {
      apiPromise = api.post(url, data);
    }

    apiPromise
      .then(() => {
        fetchUsers();
        setShowDetailModal(false);
        setShowReasonModal(false);
      })
      .catch((err) =>
        alert(
          `Error: ${err.response?.data?.message || "Could not perform action."}`
        )
      );
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleApplyAdvancedFilters = (filters) => {
    setDateFilters({ startDate: filters.startDate, endDate: filters.endDate });
    setSortBy(filters.sortBy);
    setSortDirection(filters.sortDirection);
    setDateType(filters.dateType);
    setShowAdvancedFilters(false);
  };

  const handleClearAdvancedFilters = () => {
    setDateFilters({ startDate: null, endDate: null });
    setSortBy("created_at");
    setSortDirection("desc");
    setDateType("created_at");
    setShowAdvancedFilters(false);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      <UserToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedUserCount={selectedUserIds.length}
        onBulkAction={handleBulkAction}
      >
        <div className="relative">
          <button
            onClick={() => setShowAdvancedFilters((prev) => !prev)}
            className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-50 flex items-center"
          >
            More Filters
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {showAdvancedFilters && (
            <AdvancedFilterModal
              initialFilters={{
                ...dateFilters,
                sortBy,
                sortDirection,
                dateType,
              }}
              onApply={handleApplyAdvancedFilters}
              onClear={handleClearAdvancedFilters}
            />
          )}
        </div>
      </UserToolbar>

      {loading ? (
        <p className="text-center py-4">Loading users...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-4">{error}</p>
      ) : (
        <UserTable
          users={users}
          onAction={handleAction}
          onViewDetails={handleViewDetails}
          showReasonColumn={
            activeFilter === "blocked" || activeFilter === "deleted"
          }
          selectedUserIds={selectedUserIds}
          onSelectUser={handleSelectUser}
          onSelectAll={handleSelectAll}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      {showReasonModal && (
        <ReasonInputModal
          title={reasonModalConfig.title}
          onClose={() => setShowReasonModal(false)}
          onConfirm={reasonModalConfig.onConfirm}
        />
      )}
      {showDetailModal && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setShowDetailModal(false)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}

export default UserManagement;
