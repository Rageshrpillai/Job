import React, { useState, useEffect, useCallback } from "react";
import api from "./api";
import AddAdminModal from "./AddAdminModal";
import AssignRoleModal from "./AssignRoleModal";

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for managing the modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Fetches the list of admin users from the new endpoint
  const fetchAdmins = useCallback(() => {
    setLoading(true);
    api
      .get("/api/admin/admins")
      .then((response) => setAdmins(response.data))
      .catch((err) => console.error("Failed to fetch admins", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Handler to open the "Assign Role" modal for a specific user
  const handleAssignRoleClick = (user) => {
    setEditingUser(user);
    setIsAssignRoleModalOpen(true);
  };

  // Generic save handler to close modals and refresh the list
  const handleSaveSuccess = () => {
    setIsAddModalOpen(false);
    setIsAssignRoleModalOpen(false);
    fetchAdmins();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Admin
        </button>
      </div>

      {loading ? (
        <p className="text-center py-4">Loading admins...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles Assigned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {admin.name}
                    </div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {admin.roles &&
                        admin.roles.map((role) => (
                          <span
                            key={role.id}
                            className="px-2 py-1 text-xs font-semibold leading-5 bg-blue-100 text-blue-800 rounded-full"
                          >
                            {role.name}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      {admin.latest_login
                        ? new Date(admin.latest_login.login_at).toLocaleString()
                        : "Never"}
                    </div>
                    <div className="font-mono text-xs">
                      {admin.latest_login
                        ? admin.latest_login.ip_address
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleAssignRoleClick(admin)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Modify Roles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {admins.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No admin users found.
            </p>
          )}
        </div>
      )}

      {isAddModalOpen && (
        <AddAdminModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveSuccess}
        />
      )}

      {isAssignRoleModalOpen && (
        <AssignRoleModal
          user={editingUser}
          onClose={() => setIsAssignRoleModalOpen(false)}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
}

export default AdminManagement;
