// form-frontend/src/AdminLogin.jsx
import React, { useState } from "react";
import api from "./api";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.post("/api/admin/login", { email, password });
      onLogin(response.data);
    } catch (err) {
      setError("Invalid credentials or admin access required.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen flex items-center justify-center">
      <div className="bg-blue-50 bg-opacity-80 p-10 rounded-3xl shadow-xl border border-blue-200 w-full max-w-md backdrop-blur-sm">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="text-base font-medium text-gray-700 block mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
            />
          </div>
          <div>
            <label className="text-base font-medium text-gray-700 block mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm text-center pt-2 font-semibold">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 text-white bg-blue-700 rounded-lg font-bold hover:bg-blue-800 focus:outline-none focus:ring-3 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
