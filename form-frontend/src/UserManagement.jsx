// form-frontend/src/UserManagement.jsx
import React, { useState, useEffect } from "react";
import api from "./api"; //
import UserDetailModal from "./UserDetailModal"; //
import ReasonInputModal from "./ReasonInputModal"; //

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonAction, setReasonAction] = useState(null);
  const [actionUserId, setActionUserId] = useState(null);

  // New state for tab selection: 'all', 'pending', 'blocked', 'deleted'
  const [activeTab, setActiveTab] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch all non-admin users, including soft-deleted ones
      const response = await api.get("/api/admin/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Modal Control Functions ---
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
  };

  const handleOpenReasonModal = (userId, actionType) => {
    setActionUserId(userId);
    setReasonAction(actionType);
    setShowReasonModal(true);
  };

  const handleCloseReasonModal = () => {
    setShowReasonModal(false);
    setActionUserId(null);
    setReasonAction(null);
  };

  // --- User Action Functions (called from modals or directly) ---
  const handleApprove = async (userId) => {
    try {
      await api.post(`/api/admin/users/${userId}/approve`); //
      handleCloseDetailModal(); // Close detail modal after action
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(
        "Failed to approve user: " +
          (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  const handleBlock = async (userId, reason) => {
    try {
      await api.post(`/api/admin/users/${userId}/block`, { reason }); //
      handleCloseReasonModal(); // Close reason modal
      handleCloseDetailModal(); // Close detail modal
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(
        "Failed to block user: " + (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await api.post(`/api/admin/users/${userId}/unblock`); //
      handleCloseDetailModal(); // Close detail modal
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(
        "Failed to unblock user: " +
          (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  const handleSoftDelete = async (userId, reason) => {
    try {
      await api.delete(`/api/admin/users/${userId}`, { data: { reason } }); //
      handleCloseReasonModal(); // Close reason modal
      handleCloseDetailModal(); // Close detail modal
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(
        "Failed to delete user: " + (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  const handleRestore = async (userId) => {
    try {
      await api.post(`/api/admin/users/${userId}/restore`); //
      handleCloseDetailModal(); // Close detail modal
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(
        "Failed to restore user: " +
          (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  const handleForceDelete = async (userId) => {
    if (
      window.confirm(
        "Are you absolutely sure you want to permanently delete this user? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/api/admin/users/${userId}/force-delete`); //
        handleCloseDetailModal(); // Close detail modal
        fetchUsers(); // Refresh the list
      } catch (err) {
        alert(
          "Failed to permanently delete user: " +
            (err.response?.data?.message || err.message)
        );
        console.error(err);
      }
    }
  };

  // --- User Filtering Logic ---
  const filteredUsers = users.filter((user) => {
    const isTrashed = user.deleted_at !== null;
    switch (activeTab) {
      case "all":
        return true; // Show all non-admin users
      case "pending":
        return (
          user.status === "pending_approval" && !isTrashed && !user.is_blocked
        );
      case "blocked":
        return user.is_blocked && !isTrashed;
      case "deleted":
        return isTrashed;
      default:
        return true;
    }
  });

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full">
      {/* This is the single User Management heading */}
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        User Management
      </h2>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "all"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Users ({users.length})
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "pending"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Approval (
          {
            users.filter(
              (u) =>
                u.status === "pending_approval" &&
                u.deleted_at === null &&
                u.is_blocked === false
            ).length
          }
          )
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "blocked"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("blocked")}
        >
          Blocked Users (
          {users.filter((u) => u.is_blocked && u.deleted_at === null).length})
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "deleted"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("deleted")}
        >
          Deleted Users ({users.filter((u) => u.deleted_at !== null).length})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No users found for this category.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isTrashed = user.deleted_at !== null;
                const displayStatus = isTrashed
                  ? "Deleted"
                  : user.is_blocked
                  ? "Blocked"
                  : user.status.replace("_", " ");

                return (
                  <tr
                    key={user.id}
                    className={
                      isTrashed
                        ? "bg-red-50"
                        : user.is_blocked
                        ? "bg-yellow-50"
                        : ""
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.name}
                      {user.is_blocked && !isTrashed && (
                        <span className="ml-2 text-red-500 text-xs">
                          (Blocked)
                        </span>
                      )}
                      {isTrashed && (
                        <span className="ml-2 text-gray-500 text-xs">
                          (Deleted)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isTrashed
                            ? "bg-gray-100 text-gray-800"
                            : user.is_blocked
                            ? "bg-red-100 text-red-800"
                            : user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={handleCloseDetailModal}
          onApprove={handleApprove}
          onBlock={() => handleOpenReasonModal(selectedUser.id, "block")}
          onUnblock={handleUnblock}
          onSoftDelete={() =>
            handleOpenReasonModal(selectedUser.id, "softDelete")
          }
          onRestore={handleRestore}
          onForceDelete={handleForceDelete}
        />
      )}

      {/* Reason Input Modal */}
      {showReasonModal && (
        <ReasonInputModal
          actionType={reasonAction}
          userId={actionUserId}
          onClose={handleCloseReasonModal}
          onConfirm={
            reasonAction === "block"
              ? handleBlock
              : reasonAction === "softDelete"
              ? handleSoftDelete
              : null
          }
        />
      )}
    </div>
  );
}

export default UserManagement;
