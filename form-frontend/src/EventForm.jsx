import React, { useState, useEffect } from "react";

function EventForm({ participant, onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college_name: "",
    year_of_study: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (participant) {
      setFormData(participant);
      setStatus("Viewing participant data. No updates will be saved.");
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        college_name: "",
        year_of_study: "",
        message: "",
      });
      setStatus("");
    }
  }, [participant]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!formData.phone) newErrors.phone = "Phone Number is required.";
    if (!formData.college_name)
      newErrors.college_name = "College Name is required.";
    if (!formData.year_of_study)
      newErrors.year_of_study = "Year of Study is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (participant) {
      setStatus(
        "This is a view-only form. To register a new user, please clear the form."
      );
      return;
    }
    if (!validate()) {
      setStatus("Please fix the errors above.");
      return;
    }
    setStatus("Submitting...");
    try {
      const response = await fetch(
        "https://form-backend.test/api/event-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...formData,
            event_name: "Laravel Conference",
          }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setStatus("✅ Registration successful! Thank you.");
        e.target.reset();
        setFormData({
          name: "",
          email: "",
          phone: "",
          college_name: "",
          year_of_study: "",
          message: "",
        });
        setErrors({});
      } else {
        setStatus(`❌ Error: ${result.message || "Something went wrong."}`);
      }
    } catch (error) {
      setStatus("Network error. Please check your connection.", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {participant ? "View Participant" : "Event Registration"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5 border-" noValidate>
        <div>
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name.toUpperCase()}
            onChange={handleChange}
            disabled={!!participant}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none transition ${
              errors.name ? "border-red-500" : "border-gray-300"
            } disabled:bg-gray-100`}
          />
          {errors.name && !participant && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            disabled={!!participant}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            } disabled:bg-gray-100`}
          />
          {errors.email && !participant && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            disabled={!!participant}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none transition ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } disabled:bg-gray-100`}
          />
          {errors.phone && !participant && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
        <div>
          <input
            name="college_name"
            type="text"
            placeholder="College Name"
            value={formData.college_name}
            onChange={handleChange}
            disabled={!!participant}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none transition ${
              errors.college_name ? "border-red-500" : "border-gray-300"
            } disabled:bg-gray-100`}
          />
          {errors.college_name && !participant && (
            <p className="text-red-500 text-sm mt-1">{errors.college_name}</p>
          )}
        </div>
        <div>
          <input
            name="year_of_study"
            type="text"
            placeholder="Year of Study"
            value={formData.year_of_study}
            onChange={handleChange}
            disabled={!!participant}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none transition ${
              errors.year_of_study ? "border-red-500" : "border-gray-300"
            } disabled:bg-gray-100`}
          />
          {errors.year_of_study && !participant && (
            <p className="text-red-500 text-sm mt-1">{errors.year_of_study}</p>
          )}
        </div>
        <textarea
          name="message"
          placeholder="Your Message (Optional)"
          value={formData.message}
          onChange={handleChange}
          disabled={!!participant}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none transition h-24 disabled:bg-gray-100"
        ></textarea>

        <div className="flex items-center space-x-4">
          {participant && (
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 text-white bg-blue-600 rounded-md font-semibold hover:bg-gray-300 hover:text-black "
            >
              Back to List
            </button>
          )}
          <button
            type="submit"
            disabled={!!participant}
            className="w-full py-3 text-white bg-blue-600 rounded-md font-semibold hover:bg-blue-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {participant ? "Viewing Details" : "Register Now"}
          </button>
        </div>
      </form>
      {status && (
        <p className="text-center mt-4 font-semibold text-gray-700">{status}</p>
      )}
    </div>
  );
}

export default EventForm;
