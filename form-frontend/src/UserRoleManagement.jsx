import React, { useState, useEffect } from "react";
import api from "./api";
import UserRoleFormModal from "./UserRoleFormModal";

const UserRoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const fetchUserRoles = () => {
    setLoading(true);
    // --- FIX: Removed '/api' prefix ---
    api
      .get("/api/user/roles")
      .then((response) => {
        setRoles(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching user roles:", error);
        setRoles([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const handleDeleteRole = (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      // --- FIX: Removed '/api' prefix ---
      api
        .delete(`/api/user/roles/${roleId}`)
        .then(() => {
          alert("Role deleted successfully.");
          fetchUserRoles();
        })
        .catch((error) => alert("Failed to delete role.", error));
    }
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    setIsModalOpen(false);
    fetchUserRoles();
  };

  if (loading) return <div className="text-center p-10">Loading roles...</div>;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Team Role Management
        </h2>
        <button
          onClick={handleAddRole}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          + Add New Role
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Role Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {roles.length > 0 ? (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                    {role.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                    {role.permissions?.length > 0
                      ? role.permissions.join(", ").replace(/_/g, " ")
                      : "None"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-4">
                    <button
                      onClick={() => handleEditRole(role)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-500">
                  You have not created any custom roles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <UserRoleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleModalSubmit}
        roleData={editingRole}
      />
    </div>
  );
};

export default UserRoleManagement;
