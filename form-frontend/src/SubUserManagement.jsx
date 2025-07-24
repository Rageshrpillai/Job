import React, { useState, useEffect, useMemo } from "react";
import api from "./api";
import AssignRoleModal from "./AssignRoleModal";
import ReasonInputModal from "./ReasonInputModal"; // <-- Now correctly importing your existing modal

const SubUserManagement = () => {
  const [subUsers, setSubUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State for modals
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentAction, setCurrentAction] = useState({ type: "", title: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subUsersResponse, rolesResponse] = await Promise.all([
        api.get("/api/sub-users"),
        api.get("/api/roles"),
      ]);
      setSubUsers(subUsersResponse.data);
      setRoles(rolesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return subUsers;
    return subUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, subUsers]);

  // --- Action Handlers ---

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleOpenActionModal = (user, actionType, title) => {
    setSelectedUser(user);
    setCurrentAction({ type: actionType, title });
    setIsActionModalOpen(true);
  };

  const handleUnblock = (user) => {
    if (window.confirm("Are you sure you want to unblock this user?")) {
      api
        .post(`/api/sub-users/${user.id}/action`, { action: "unblock" })
        .then(() => {
          alert("User unblocked successfully.");
          fetchData();
        })
        .catch((err) => alert("Failed to unblock user."));
    }
  };

  // This function is called from your existing ReasonInputModal
  const handleActionSubmit = (reason) => {
    if (!selectedUser || !currentAction.type) return;

    api
      .post(`/api/sub-users/${selectedUser.id}/action`, {
        action: currentAction.type,
        reason,
      })
      .then(() => {
        alert(`User has been ${currentAction.type}d successfully.`);
        fetchData();
        closeModals();
      })
      .catch((err) => {
        alert(`Failed to ${currentAction.type} user.`);
        console.error(err);
      });
  };

  const handleWarn = (user) => {
    const warningMessage = prompt(
      `Enter a warning message to send to ${user.name}:`
    );
    if (warningMessage) {
      console.log(`Warning user ${user.id} with message: "${warningMessage}"`);
      alert("Warning has been logged to the console.");
    }
  };

  const closeModals = () => {
    setSelectedUser(null);
    setIsRoleModalOpen(false);
    setIsActionModalOpen(false);
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Your Team Members
        </h2>
        <div className="relative w-full sm:w-auto">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className={`${
                  user.status === "blocked"
                    ? "bg-red-50 hover:bg-red-100"
                    : "hover:bg-gray-50"
                } transition-colors`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {user.name}
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                      user.status === "blocked"
                        ? "bg-red-200 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                  {user.roles.length > 0 ? user.roles[0].name : "No Role"}
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-4">
                  <button
                    onClick={() => handleOpenRoleModal(user)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Role
                  </button>
                  <button
                    onClick={() => handleWarn(user)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    Warn
                  </button>
                  {user.status === "blocked" ? (
                    <button
                      onClick={() => handleUnblock(user)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleOpenActionModal(
                          user,
                          "block",
                          "Reason for Blocking User"
                        )
                      }
                      className="text-orange-600 hover:text-orange-800"
                    >
                      Block
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleOpenActionModal(
                        user,
                        "remove",
                        "Reason for Removing User"
                      )
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && isRoleModalOpen && (
        <AssignRoleModal
          isOpen={isRoleModalOpen}
          onClose={closeModals}
          user={selectedUser}
          roles={roles}
          onSave={() => {
            fetchData();
            closeModals();
          }}
          assignRoleEndpoint={`/api/sub-users/${selectedUser.id}/assign-role`}
          rolesEndpoint="/api/roles"
        />
      )}

      {/* This now correctly uses your existing modal component */}
      {selectedUser && isActionModalOpen && (
        <ReasonInputModal
          isOpen={isActionModalOpen}
          onClose={closeModals}
          onConfirm={handleActionSubmit}
          title={currentAction.title}
        />
      )}
    </div>
  );
};

export default SubUserManagement;
