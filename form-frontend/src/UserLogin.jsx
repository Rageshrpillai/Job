// form-frontend/src/UserLogin.jsx
import React, { useState } from "react";
import api from "./api";
import UserStatusModal from "./UserStatusModal";

function UserLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalMessage, setStatusModalMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowStatusModal(false);
    setStatusModalMessage("");

    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.post("/api/login", { email, password });
      onLogin(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        if (
          err.response.data.message === "This login is for active users only."
        ) {
          setStatusModalMessage(
            <>
              Your account is pending admin approval or has been blocked. Please
              wait for an administrator to activate your account. If it takes
              longer than usual, please contact us at{" "}
              {/* **FIXED**: Changed the link to a specific Gmail URL */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                admin@example.com
              </a>
              .
            </>
          );
          setShowStatusModal(true);
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError("Invalid credentials or an unexpected error occurred.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setStatusModalMessage("");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        User Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center pt-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {showStatusModal && (
        <UserStatusModal
          message={statusModalMessage}
          onClose={handleCloseStatusModal}
        />
      )}
    </div>
  );
}

export default UserLogin;
