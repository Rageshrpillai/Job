import React, { useState, useEffect } from "react";
import api from "./api";
import RoleEditModal from "./RoleEditModal"; // We will create this next

function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const fetchRoles = () => {
    setLoading(true);
    api
      .get("/api/admin/roles")
      .then((response) => setRoles(response.data))
      .catch((err) => console.error("Failed to fetch roles", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingRole(null); // No role means we are creating a new one
    setIsModalOpen(true);
  };

  const handleDelete = (roleId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this role? This cannot be undone."
      )
    ) {
      api
        .delete(`/api/admin/roles/${roleId}`)
        .then(() => fetchRoles()) // Refresh list on success
        .catch((err) =>
          alert(
            `Error: ${err.response?.data?.message || "Could not delete role."}`
          )
        );
    }
  };

  const handleModalSave = () => {
    setIsModalOpen(false);
    fetchRoles(); // Refresh the list of roles after saving
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Role Management</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New Role
        </button>
      </div>

      {loading ? (
        <p>Loading roles...</p>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {roles.map((role) => (
              <li
                key={role.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg text-gray-800">{role.name}</p>
                  <p className="text-sm text-gray-500">
                    {role.permissions.map((p) => p.name).join(", ")}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(role)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  {role.name !== "Super Admin" && (
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isModalOpen && (
        <RoleEditModal
          role={editingRole}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

export default RoleManagement;
