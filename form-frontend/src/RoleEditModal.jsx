import React, { useState, useEffect } from "react";
import api from "./api";

function RoleEditModal({ role, onClose, onSave }) {
  const [name, setName] = useState(role ? role.name : "");
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState(
    new Set(role ? role.permissions.map((p) => p.id) : [])
  );

  useEffect(() => {
    // **MODIFIED**: Fetch all available permissions from the backend
    setLoading(true);
    api
      .get("/api/admin/permissions")
      .then((response) => {
        setAllPermissions(response.data);
      })
      .catch((err) => console.error("Failed to fetch permissions", err))
      .finally(() => setLoading(false));
  }, []);

  const handlePermissionChange = (permissionId, isChecked) => {
    const newSelection = new Set(selectedPermissions);
    if (isChecked) {
      newSelection.add(permissionId);
    } else {
      newSelection.delete(permissionId);
    }
    setSelectedPermissions(newSelection);
  };

  const handleSubmit = () => {
    const payload = {
      name,
      permissions: Array.from(selectedPermissions),
    };

    const request = role
      ? api.put(`/api/admin/roles/${role.id}`, payload)
      : api.post("/api/admin/roles", payload);

    request
      .then(() => onSave())
      .catch((err) =>
        alert(`Error: ${err.response?.data?.message || "Could not save role."}`)
      );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">
          {role ? "Edit Role" : "Create New Role"}
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm p-2"
            disabled={role && role.name === "Super Admin"} // Don't allow renaming Super Admin
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Permissions
          </label>
          {loading ? (
            <p>Loading permissions...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border p-2 rounded-md">
              {allPermissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.has(permission.id)}
                    onChange={(e) =>
                      handlePermissionChange(permission.id, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">{permission.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Role
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleEditModal;
