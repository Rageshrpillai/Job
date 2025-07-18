import React, { useState } from "react";
import api from "./api";

function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    event_type: "in-person",
    venue: "",
    start_time: "",
    end_time: "",
    max_attendees: "",
    main_image: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // We use FormData because we are uploading a file
    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }

    api
      .post("/api/events", submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        onEventCreated(); // This will be used to refresh the event list later
        onClose(); // Close the modal on success
      })
      .catch((err) => {
        const message =
          err.response?.data?.message ||
          "An error occurred creating the event.";
        setError(message);
        console.error("Failed to create event:", err);
      })
      .finally(() => setLoading(false));
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const closePreview = () => setShowPreview(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Create a New Event
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Event Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              required
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label
              htmlFor="main_image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Main Image (Max 500KB)
            </label>
            <input
              type="file"
              name="main_image"
              id="main_image"
              required
              onChange={handleChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Type */}
            <div>
              <label
                htmlFor="event_type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Type
              </label>
              <select
                name="event_type"
                id="event_type"
                value={formData.event_type}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="in-person">In-Person</option>
                <option value="online">Online</option>
              </select>
            </div>

            {/* Venue */}
            <div>
              <label
                htmlFor="venue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Venue / Platform
              </label>
              <input
                type="text"
                name="venue"
                id="venue"
                required
                onChange={handleChange}
                placeholder={
                  formData.event_type === "in-person"
                    ? "e.g., Grand Hyatt Hotel"
                    : "e.g., Zoom, Google Meet"
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Start Time & End Time */}
            <div>
              <label
                htmlFor="start_time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Time
              </label>
              <input
                type="datetime-local"
                name="start_time"
                id="start_time"
                required
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="end_time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Time
              </label>
              <input
                type="datetime-local"
                name="end_time"
                id="end_time"
                required
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold"
            >
              Preview
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-indigo-400"
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-0 w-full max-w-sm mx-auto relative overflow-hidden">
              <button
                onClick={closePreview}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl z-10"
              >
                &times;
              </button>
              {/* Event Image */}
              {(() => { const url = formData.main_image ? URL.createObjectURL(formData.main_image) : null; if (url) { console.log('[CreateEventModal Preview] Image URL:', url); } return null; })()}
              {formData.main_image ? (
                <img
                  src={URL.createObjectURL(formData.main_image)}
                  alt="Event Preview"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  No image selected
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-purple-900">
                  {formData.title || "(No Title)"}
                </h3>
                <p className="text-gray-700 mb-2 line-clamp-3">
                  {formData.description || "(No Description)"}
                </p>
                <div className="mb-2">
                  <span className="font-semibold text-sm text-gray-700">Event Organizer:</span>{" "}
                  <span className="text-purple-700 font-semibold">(You)</span>
                </div>
                <div className="flex items-center text-green-700 text-sm mb-1">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {formData.start_time ? new Date(formData.start_time).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : "No start time"}
                </div>
                <div className="flex items-center text-blue-700 text-sm mb-1">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" /></svg>
                  {formData.venue || "No venue"}
                </div>
                <div className="flex items-center text-gray-600 text-xs mt-2">
                  <span>Type: {formData.event_type}</span>
                  {formData.max_attendees && (
                    <span className="ml-4">Max Attendees: {formData.max_attendees}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateEventModal;
