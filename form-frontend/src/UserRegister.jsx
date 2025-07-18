import React, { useState } from "react";
import api from "./api";

function UserRegister({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    organization_type: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    terms1: false,
    terms2: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms1 || !formData.terms2) {
      setError("You must accept all terms and policies.");
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/register", formData);
      onRegisterSuccess();
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = !formData.terms1 || !formData.terms2 || loading;
  const isCompany =
    formData.organization_type === "corporate" ||
    formData.organization_type === "company";

  return (
    <div className="bg-white rounded-lg shadow-2xl flex w-full max-w-4xl mx-auto my-8">
      {/* Left Column */}
      <div className="w-1/2 p-8 border-r">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          General Information
        </h2>
        <div className="space-y-4">
          <select
            name="organization_type"
            value={formData.organization_type}
            onChange={handleChange}
            required
            className="w-full p-2 border-b bg-white focus:outline-none focus:border-indigo-500"
          >
            <option value="" disabled>
              Type of Organization...
            </option>
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
            <option value="company">Company</option>
            <option value="non-profit">Non-profit</option>
            <option value="event-organizer">Event Organizer</option>
          </select>

          {isCompany ? (
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company Name"
              required={isCompany}
              className="w-full p-2 border-b focus:outline-none focus:border-indigo-500"
            />
          ) : (
            <div className="flex gap-4">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                required={!isCompany}
                className="w-1/2 p-2 border-b focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                required={!isCompany}
                className="w-1/2 p-2 border-b focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="w-1/2 p-8 bg-indigo-600 text-white rounded-r-lg flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Contact Details</h2>
        <div className="space-y-4 flex-grow">
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, City, Zip, Country"
            className="w-full p-2 border-b bg-indigo-600 placeholder-indigo-200 focus:outline-none focus:border-white h-20 resize-none"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 border-b bg-indigo-600 placeholder-indigo-200 focus:outline-none focus:border-white"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full p-2 border-b bg-indigo-600 placeholder-indigo-200 focus:outline-none focus:border-white"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 border-b bg-indigo-600 placeholder-indigo-200 focus:outline-none focus:border-white"
          />
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="w-full p-2 border-b bg-indigo-600 placeholder-indigo-200 focus:outline-none focus:border-white"
          />
        </div>

        <div className="space-y-3 mt-4">
          <label htmlFor="terms1" className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="terms1"
              checked={formData.terms1}
              onChange={handleChange}
              id="terms1"
              className="h-4 w-4 rounded"
            />
            <span className="ml-2 text-sm">
              I do accept the{" "}
              <a href="#" className="font-bold underline hover:text-indigo-200">
                Terms and Conditions
              </a>
              .
            </span>
          </label>
          <label htmlFor="terms2" className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="terms2"
              checked={formData.terms2}
              onChange={handleChange}
              id="terms2"
              className="h-4 w-4 rounded"
            />
            <span className="ml-2 text-sm">
              I do accept the{" "}
              <a href="#" className="font-bold underline hover:text-indigo-200">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        {error && (
          <p className="text-red-300 text-sm pt-2 text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className="w-full py-3 mt-4 bg-white text-indigo-600 font-bold rounded-lg shadow-md hover:bg-gray-100 transition-colors disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Register Badge"}
        </button>
      </div>
    </div>
  );
}

export default UserRegister;
