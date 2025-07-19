// File: src/ManageEvents.jsx
// This code REPLACES the previous version of this file entirely.

// What's new:
// 1. Updated the table to display `event.start_time` instead of `start_date`.
// 2. Used `new Date().toLocaleString()` to format the date and time nicely.

import React, { useState, useEffect } from "react";
import api from "./api";

// Helper to format date string for datetime-local input
function formatForDatetimeLocal(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

const EventPreviewModal = ({ event, onClose, editable, onSave }) => {
  const [editData, setEditData] = useState(event || {});
  const [editImage, setEditImage] = useState(null);
  if (!event) return null;
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setEditImage(files[0]);
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };
  // Image logic: show new upload if present, else show main_image_path (with /storage/ if needed)
  let imageUrl = null;
  if (editImage) {
    imageUrl = URL.createObjectURL(editImage);
  } else if (event.main_image_path) {
    imageUrl = event.main_image_path.startsWith("http")
      ? event.main_image_path
      : `/storage/${event.main_image_path.replace(/^\/+/, "")}`;
  } else if (event.main_image) {
    imageUrl =
      typeof event.main_image === "string"
        ? event.main_image
        : URL.createObjectURL(event.main_image);
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-0 w-full max-w-sm mx-auto relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl z-10"
        >
          &times;
        </button>
        {/* Event Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Event Preview"
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2 text-purple-900">
            {editable ? (
              <input
                name="title"
                value={editData.title || ""}
                onChange={handleChange}
                className="border rounded p-1 ml-2 w-full font-bold text-purple-900"
              />
            ) : (
              event.title || "(No Title)"
            )}
          </h3>
          <p className="text-gray-700 mb-2 line-clamp-3">
            {editable ? (
              <textarea
                name="description"
                value={editData.description || ""}
                onChange={handleChange}
                className="border rounded p-1 ml-2 w-full"
              />
            ) : (
              event.description || "(No Description)"
            )}
          </p>
          <div className="mb-2">
            <span className="font-semibold text-sm text-gray-700">
              Event Organizer:
            </span>{" "}
            <span className="text-purple-700 font-semibold">
              {event.organizer || "(You)"}
            </span>
          </div>
          <div className="flex items-center text-green-700 text-sm mb-1">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {editable ? (
              <input
                name="start_time"
                type="datetime-local"
                value={
                  editData.start_time
                    ? formatForDatetimeLocal(editData.start_time)
                    : ""
                }
                onChange={handleChange}
                className="border rounded p-1 ml-2"
              />
            ) : event.start_time ? (
              new Date(event.start_time).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })
            ) : (
              "No start time"
            )}
          </div>
          <div className="flex items-center text-green-700 text-sm mb-1">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {editable ? (
              <input
                name="end_time"
                type="datetime-local"
                value={
                  editData.end_time
                    ? formatForDatetimeLocal(editData.end_time)
                    : ""
                }
                onChange={handleChange}
                className="border rounded p-1 ml-2"
              />
            ) : event.end_time ? (
              new Date(event.end_time).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })
            ) : (
              "No end time"
            )}
          </div>
          <div className="flex items-center text-blue-700 text-sm mb-1">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z"
              />
            </svg>
            {editable ? (
              <input
                name="venue"
                value={editData.venue || ""}
                onChange={handleChange}
                className="border rounded p-1 ml-2"
              />
            ) : (
              event.venue || "No venue"
            )}
          </div>
          <div className="flex items-center text-gray-600 text-xs mt-2">
            <span>
              Type:{" "}
              {editable ? (
                <select
                  name="event_type"
                  value={editData.event_type || ""}
                  onChange={handleChange}
                  className="border rounded p-1 ml-2"
                >
                  <option value="in-person">In-Person</option>
                  <option value="online">Online</option>
                </select>
              ) : (
                event.event_type
              )}
            </span>
            {editable ? (
              <input
                name="max_attendees"
                type="number"
                value={editData.max_attendees || ""}
                onChange={handleChange}
                className="border rounded p-1 ml-2 w-24"
                placeholder="Max Attendees"
              />
            ) : (
              event.max_attendees && (
                <span className="ml-4">
                  Max Attendees: {event.max_attendees}
                </span>
              )
            )}
          </div>
          <div className="flex items-center text-gray-600 text-xs mt-2">
            <span>
              Status: {event.is_approved ? "Active" : "Pending Approval"}
            </span>
          </div>
          {editable && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Change Image
              </label>
              <input
                type="file"
                name="main_image"
                accept="image/*"
                onChange={handleChange}
                className="mb-2"
              />
            </div>
          )}
          {editable && (
            <button
              onClick={() => onSave({ ...editData, main_image: editImage })}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);

  useEffect(() => {
    api
      .get("/api/events")
      .then((response) => {
        console.log("[ManageEvents] API response:", response.data);
        const eventsData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
          ? response.data.data
          : [];
        console.log("[ManageEvents] Parsed eventsData:", eventsData);
        setEvents(eventsData);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleEdit = (event) => {
    setEditEvent(event);
  };
  const handleDelete = (event) => {
    console.log("[ManageEvents] Delete clicked for event:", event);
    alert("Delete functionality coming soon!");
  };
  const handlePreview = (event) => {
    setPreviewEvent(event);
  };
  const handleSaveEdit = async (updatedEvent) => {
    try {
      let formData = new FormData();
      formData.append("title", updatedEvent.title || "");
      formData.append("description", updatedEvent.description || "");
      formData.append("category", updatedEvent.category || "");
      formData.append("event_type", updatedEvent.event_type || "in-person");
      formData.append("venue", updatedEvent.venue || "");
      formData.append("start_time", updatedEvent.start_time || "");
      formData.append("end_time", updatedEvent.end_time || "");
      formData.append("max_attendees", updatedEvent.max_attendees || "");
      if (updatedEvent.main_image) {
        formData.append("main_image", updatedEvent.main_image);
      }
      formData.append("_method", "PUT");
      const response = await api.post(
        `/api/events/${updatedEvent.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // Refresh the event list from backend to get the latest image path
      const refreshed = await api.get("/api/events");
      const eventsData = Array.isArray(refreshed.data)
        ? refreshed.data
        : Array.isArray(refreshed.data.data)
        ? refreshed.data.data
        : [];
      setEvents(eventsData);
      setEditEvent(null);
      alert("Event updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update event.");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading events...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Events</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Title
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Start Time
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Venue
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Status
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(events) && events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{event.title}</td>
                  <td className="py-3 px-4">
                    {new Date(event.start_time).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">{event.venue}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        (event.is_approved
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-100 text-yellow-700") +
                        " py-1 px-3 rounded-full text-xs font-semibold"
                      }
                    >
                      {event.is_approved ? "Active" : "Pending Approval"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="text-indigo-600 hover:underline mr-4"
                      onClick={() => handlePreview(event)}
                    >
                      Preview
                    </button>
                    <button
                      className="text-indigo-600 hover:underline mr-4"
                      onClick={() => handleEdit(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(event)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  You have not created any events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {previewEvent && (
        <EventPreviewModal
          event={previewEvent}
          onClose={() => setPreviewEvent(null)}
          editable={false}
          onSave={handleSaveEdit}
        />
      )}
      {editEvent && (
        <EventPreviewModal
          event={editEvent}
          onClose={() => setEditEvent(null)}
          editable={true}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default ManageEvents;
