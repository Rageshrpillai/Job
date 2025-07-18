// File: src/SubUserManagementPage.jsx
// This is the complete, corrected code for this file.
// It REPLACES the previous version entirely.

// What's new:
// 1. It now also checks the API response for sub-users and roles to ensure they are arrays before setting state.
// 2. Added `Array.isArray(subUsers)` in the JSX as a safeguard.

import React, { useState, useEffect } from "react";
import api from "./api"; // Ensure this path is correct for your api service

const SubUserManagementPage = () => {
  const [subUsers, setSubUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
  });

  // Helper to safely get array from API response
  const getArray = (data) => {
    return Array.isArray(data)
      ? data
      : data && Array.isArray(data.data)
      ? data.data
      : [];
  };

  useEffect(() => {
    Promise.all([api.get("/api/sub-users"), api.get("/api/roles")])
      .then(([subUsersRes, rolesRes]) => {
        setSubUsers(getArray(subUsersRes.data));
        setRoles(getArray(rolesRes.data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setSubUsers([]); // Set to empty on error
        setRoles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    api
      .post("/api/sub-users", newUser)
      .then((res) => {
        setSubUsers([...subUsers, res.data]);
        setShowAddModal(false);
        setNewUser({ name: "", email: "", password: "", role_id: "" });
      })
      .catch((err) => console.error("Error adding sub-user:", err));
  };

  const handleAction = (userId, action) => {
    if (
      action === "delete" &&
      !window.confirm("Are you sure you want to permanently delete this user?")
    ) {
      return;
    }

    api
      .post(`/api/sub-users/${userId}/action`, { action })
      .then((response) => {
        if (action === "delete") {
          setSubUsers(subUsers.filter((user) => user.id !== userId));
        } else {
          setSubUsers(
            subUsers.map((user) => (user.id === userId ? response.data : user))
          );
        }
      })
      .catch((err) => console.error(`Error performing action: ${action}`, err));
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Sub-User Management
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Add Sub-User
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Name
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Email
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Role
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Status
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(subUsers) && subUsers.length > 0 ? (
              subUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    {user.roles && user.roles.length > 0
                      ? user.roles[0].name
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {user.deleted_at ? (
                      <span className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-xs">
                        Removed
                      </span>
                    ) : user.is_blocked ? (
                      <span className="bg-yellow-200 text-yellow-800 py-1 px-3 rounded-full text-xs">
                        Blocked
                      </span>
                    ) : (
                      <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleAction(user.id, "block")}
                      className="text-yellow-600 hover:underline"
                    >
                      {user.is_blocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => handleAction(user.id, "remove")}
                      className="text-red-600 hover:underline"
                    >
                      {user.deleted_at ? "Restore" : "Remove"}
                    </button>
                    <button
                      onClick={() => handleAction(user.id, "delete")}
                      className="text-red-800 hover:underline ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No sub-users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Add New Sub-User
            </h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <select
                name="role_id"
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a Role</option>
                {Array.isArray(roles) &&
                  roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
              </select>
              <div className="flex items-center justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubUserManagementPage;
