import React, { useState, useEffect } from "react";
import api from "./api";

function AssignRoleModal({ user, onClose, onSave, assignRoleEndpoint, rolesEndpoint }) {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState(
    new Set(user ? (user.roles ? user.roles.map((r) => r.id) : []) : [])
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all available roles from the backend to display as checkboxes
    api
      .get(rolesEndpoint || "/api/admin/roles")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((err) => console.error("Failed to fetch roles", err))
      .finally(() => setLoading(false));
  }, [rolesEndpoint]);

  const handleRoleChange = (roleId, isChecked) => {
    const newSelection = new Set(selectedRoles);
    if (isChecked) {
      newSelection.add(roleId);
    } else {
      newSelection.delete(roleId);
    }
    setSelectedRoles(newSelection);
  };

  const handleSubmit = () => {
    const payload = {
      roles: Array.from(selectedRoles),
    };

    api
      .post(assignRoleEndpoint || `/api/admin/users/${user.id}/assign-roles`, payload)
      .then(() => onSave && onSave()) // Call the onSave prop to close modal and refresh list
      .catch((err) =>
        alert(
          `Error: ${err.response?.data?.message || "Could not assign roles."}`
        )
      );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Assign Roles to {user.name}</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Roles
          </label>
          {loading ? (
            <p>Loading roles...</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto border p-3 rounded-md">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedRoles.has(role.id)}
                    onChange={(e) =>
                      handleRoleChange(role.id, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">{role.name}</span>
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
            Save Roles
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignRoleModal;
