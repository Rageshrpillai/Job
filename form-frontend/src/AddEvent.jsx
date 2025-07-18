// File: src/AddEvent.jsx
// This code REPLACES the previous version of this file entirely.

// What's new:
// 1. Added all the new form fields: Image, Category, Event Type, Venue, Max Attendees.
// 2. Renamed date fields to start_time and end_time and changed input type to "datetime-local".
// 3. The `handleSubmit` function now uses `FormData` to properly package the form data and the image for the API call.

import React, { useState } from "react";
import api from "./api";

const AddEvent = () => {
  // State to hold form data, including the file
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    event_type: "in-person", // Default value
    venue: "",
    start_time: "",
    end_time: "",
    max_attendees: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Use FormData to send both text and file data
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("event_type", formData.event_type);
    data.append("venue", formData.venue);
    data.append("start_time", formData.start_time);
    data.append("end_time", formData.end_time);
    data.append("max_attendees", formData.max_attendees);
    if (mainImage) {
      data.append("main_image", mainImage);
    }

    try {
      await api.post("/api/events", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Event created successfully!");
      // Optionally reset the form here
      e.target.reset();
      setMainImage(null);
    } catch (err) {
      console.error("Failed to create event:", err);
      // Handle validation errors from the backend
      if (err.response && err.response.status === 422) {
        const validationErrors = err.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat().join(" ");
        setError(`Validation failed: ${errorMessages}`);
      } else {
        setError("Error: Could not create the event.");
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create a New Event
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}
        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        {/* Text Inputs */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Event Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="main_image"
            className="block text-sm font-medium text-gray-700"
          >
            Main Image (Max 500KB)
          </label>
          <input
            type="file"
            name="main_image"
            id="main_image"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Event Type and Venue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="event_type"
              className="block text-sm font-medium text-gray-700"
            >
              Event Type
            </label>
            <select
              name="event_type"
              id="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="in-person">In-Person</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="venue"
              className="block text-sm font-medium text-gray-700"
            >
              Venue / Platform
            </label>
            <input
              type="text"
              name="venue"
              id="venue"
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Date/Time and Attendees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="start_time"
              className="block text-sm font-medium text-gray-700"
            >
              Start Time
            </label>
            <input
              type="datetime-local"
              name="start_time"
              id="start_time"
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="end_time"
              className="block text-sm font-medium text-gray-700"
            >
              End Time
            </label>
            <input
              type="datetime-local"
              name="end_time"
              id="end_time"
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="max_attendees"
            className="block text-sm font-medium text-gray-700"
          >
            Max Attendees (Optional)
          </label>
          <input
            type="number"
            name="max_attendees"
            id="max_attendees"
            min="1"
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
