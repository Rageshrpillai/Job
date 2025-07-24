import React, { useState, useEffect } from "react";
import api from "./api";

const UserRoleFormModal = ({ isOpen, onClose, onSubmitSuccess, roleData }) => {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(roleData);

  useEffect(() => {
    if (isOpen) {
      api
        .get("/api/user/roles/permissions")
        .then((response) => {
          console.log("[DEBUG] Permissions API response:", response.data);
          setAvailablePermissions(
            Array.isArray(response.data) ? response.data : []
          );
        })
        .catch((error) => {
          console.error("[DEBUG] Error fetching permissions:", error);
          setAvailablePermissions([]);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isEditMode) {
      setName(roleData.name || "");
      setSelectedPermissions(roleData.permissions || []);
    } else {
      setName("");
      setSelectedPermissions([]);
    }
  }, [roleData, isOpen]);

  const handlePermissionChange = (permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { name, permissions: selectedPermissions };

    // --- FIX: Removed '/api' prefix ---
    const apiCall = isEditMode
      ? api.put(`/api/user/roles/${roleData.id}`, payload)
      : api.post("/api/user/roles", payload);

    try {
      await apiCall;
      alert(`Role ${isEditMode ? "updated" : "created"} successfully!`);
      onSubmitSuccess();
    } catch (error) {
      console.error("Error saving role:", error.response?.data);
      alert("Failed to save role.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "Edit Team Role" : "Add New Team Role"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="role_name"
              className="block text-sm font-medium text-gray-700"
            >
              Role Name
            </label>
            <input
              type="text"
              id="role_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Permissions
            </label>
            <div className="mt-2 p-4 border rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availablePermissions.length > 0 ? (
                availablePermissions.map((permission) => (
                  <label
                    key={permission}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                      className="h-4 w-4 text-indigo-600 rounded"
                    />
                    <span className="text-gray-700 capitalize">
                      {permission.replace(/_/g, " ")}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No permissions available to assign.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
            >
              {loading ? "Saving..." : "Save Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRoleFormModal;
