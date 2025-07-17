import React, { useState, useCallback } from "react";
import api from "./api";
import { debounce } from "lodash";

function AddAdminModal({ onClose, onSave }) {
  // State for creating a new admin
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for promoting an existing user
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [error, setError] = useState("");

  // Debounced search function to prevent API calls on every keystroke
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.length < 2) {
        setSearchResults([]);
        return;
      }
      setLoadingSearch(true);
      api
        .get("/api/admin/users/search-for-promotion", {
          params: { search: term },
        })
        .then((response) => setSearchResults(response.data))
        .catch(() => setSearchResults([]))
        .finally(() => setLoadingSearch(false));
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handlePromote = (userId) => {
    if (
      !window.confirm("Are you sure you want to promote this user to an admin?")
    )
      return;
    api
      .post(`/api/admin/users/${userId}/promote`)
      .then(() => onSave())
      .catch((err) =>
        alert(
          `Error: ${err.response?.data?.message || "Could not promote user."}`
        )
      );
  };

  const handleCreate = () => {
    setError("");
    api
      .post("/api/admin/admins", { name, email, password })
      .then(() => onSave())
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to create admin.")
      );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">Add Administrator</h3>

        {/* Section 1: Promote Existing User */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Promote Existing User
          </label>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
          {loadingSearch && (
            <p className="text-sm text-gray-500 mt-2">Searching...</p>
          )}
          {searchResults.length > 0 && (
            <ul className="border rounded-md mt-2 max-h-32 overflow-y-auto">
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  className="p-2 flex justify-between items-center hover:bg-gray-50"
                >
                  <span>
                    {user.name} ({user.email})
                  </span>
                  <button
                    onClick={() => handlePromote(user.id)}
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded"
                  >
                    Promote
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative my-4">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">Or</span>
          </div>
        </div>

        {/* Section 2: Create New Admin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Create New Admin User
          </label>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Set Initial Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            onClick={handleCreate}
            className="w-full mt-3 py-2 bg-blue-600 text-white rounded"
          >
            Create and Add Admin
          </button>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
export default AddAdminModal;
