import React, { useState } from "react";
import axios from "axios";

function AdminRegister({ onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/api/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess("Registration successful! Redirecting to login...");
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const messages = Object.values(err.response.data.errors).flat();
        setError(messages.join(" "));
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Create Admin Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
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
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center pt-2">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm text-center pt-2">{success}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Registering..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default AdminRegister;
