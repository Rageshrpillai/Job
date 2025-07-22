import React, { useState, useEffect } from "react";
import api from "./api";
import SubUserManagement from "./SubUserManagement"; // The main table component

// A new, cleaner modal for adding sub-users without the role dropdown
const AddSubUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    api
      .post("/api/sub-users", formData)
      .then(() => {
        onUserAdded();
        onClose();
      })
      .catch((err) => {
        setError(err.response?.data?.message || "An error occurred.");
      })
      .finally(() => setLoading(false));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Add New Team Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength="8"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// The main page container
const SubUserManagementPage = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [showAddModal, setShowAddModal] = useState(false);

  // We need a key to force the SubUserManagement component to re-render
  const [manageKey, setManageKey] = useState(0);

  const handleUserAdded = () => {
    // Increment the key to trigger a re-fetch in the child component
    setManageKey((prevKey) => prevKey + 1);
    setShowAddModal(false);
  };

  const baseTabStyles =
    "py-3 px-6 font-semibold transition-colors duration-200";
  const activeTabStyles =
    "border-b-4 border-indigo-600 text-indigo-600 bg-white rounded-t-lg";
  const inactiveTabStyles =
    "text-gray-500 hover:text-gray-800 border-b-4 border-transparent";

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-[-1px]">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("manage")}
              className={`${baseTabStyles} ${
                activeTab === "manage" ? activeTabStyles : inactiveTabStyles
              }`}
            >
              Manage Users
            </button>
            {/* You can add more tabs here if needed in the future */}
          </div>
          <div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add New User
            </button>
          </div>
        </div>

        <div className="mt-0">
          {/* The key prop is important here to trigger a refresh */}
          {activeTab === "manage" && <SubUserManagement key={manageKey} />}
        </div>

        <AddSubUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onUserAdded={handleUserAdded}
        />
      </div>
    </div>
  );
};

export default SubUserManagementPage;
