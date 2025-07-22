import React, { useState, useEffect, useRef } from "react";
import api from "./api";
import { Editor } from "@tinymce/tinymce-react";

const EventFormModal = ({ isOpen, onClose, onSubmitSuccess, eventData }) => {
  const [formData, setFormData] = useState({
    event_name: "",
    event_date: "",
    event_start_time: "",
    event_end_time: "",
    location: "",
    state: "",
    zip_code: "",
    event_type: "in-person",
    ticket_status: "non-ticketed",
  });

  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const isEditMode = Boolean(eventData);
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (isOpen && isEditMode) {
      const venueParts = eventData.venue
        ? eventData.venue.split(", ")
        : ["", ""];
      const location = venueParts[0];
      const stateZip = venueParts[1] ? venueParts[1].split(" ") : ["", ""];
      const state = stateZip[0];
      const zip_code = stateZip[1];

      const startDate = eventData.start_time
        ? new Date(eventData.start_time)
        : null;
      const endDate = eventData.end_time ? new Date(eventData.end_time) : null;

      setFormData({
        event_name: eventData.title || "",
        event_date: startDate ? startDate.toISOString().split("T")[0] : "",
        event_start_time: startDate ? startDate.toTimeString().slice(0, 5) : "",
        event_end_time: endDate ? endDate.toTimeString().slice(0, 5) : "",
        location: location || "",
        state: state || "",
        zip_code: zip_code || "",
        event_type: eventData.event_type || "in-person",
        ticket_status: "non-ticketed", // This field is not on the backend, so we default it
      });
      setDescription(eventData.description || "");
    }
  }, [eventData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Mapping to backend fields
    data.append("title", formData.event_name);
    data.append("description", description);
    data.append(
      "venue",
      `${formData.location}, ${formData.state} ${formData.zip_code}`
    );
    data.append(
      "start_time",
      `${formData.event_date} ${formData.event_start_time}`
    );
    data.append(
      "end_time",
      `${formData.event_date} ${formData.event_end_time}`
    );
    data.append("event_type", formData.event_type);

    if (mainImage) {
      data.append("main_image", mainImage);
    }
    data.append("_method", "PUT");

    try {
      await api.post(`/api/events/${eventData.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Event updated successfully!");
      onSubmitSuccess();
    } catch (error) {
      console.error("Error updating event:", error.response?.data);
      alert("Failed to update event.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div>
            <label
              htmlFor="modal_event_name"
              className="block text-sm font-medium text-gray-700"
            >
              Event Name
            </label>
            <input
              type="text"
              name="event_name"
              id="modal_event_name"
              required
              value={formData.event_name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Update Image (Optional)
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {/* Conditionally render preview or placeholder */}
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="New Preview"
                  className="h-24 w-24 object-cover rounded-lg"
                />
              ) : (
                <div className="h-24 w-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  Preview
                </div>
              )}
              <div>
                <input
                  type="file"
                  name="main_image"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                  id="modal_main_image_upload"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
                >
                  Choose New Photo
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="modal_event_date"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                name="event_date"
                id="modal_event_date"
                required
                value={formData.event_date}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="modal_event_start_time"
                className="block text-sm font-medium text-gray-700"
              >
                Start Time
              </label>
              <input
                type="time"
                name="event_start_time"
                id="modal_event_start_time"
                required
                value={formData.event_start_time}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="modal_event_end_time"
                className="block text-sm font-medium text-gray-700"
              >
                End Time
              </label>
              <input
                type="time"
                name="event_end_time"
                id="modal_event_end_time"
                required
                value={formData.event_end_time}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="modal_location"
              className="block text-sm font-medium text-gray-700"
            >
              Location / Address
            </label>
            <input
              type="text"
              name="location"
              id="modal_location"
              required
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="modal_state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <input
                type="text"
                name="state"
                id="modal_state"
                required
                value={formData.state}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="modal_zip_code"
                className="block text-sm font-medium text-gray-700"
              >
                Zip Code
              </label>
              <input
                type="text"
                name="zip_code"
                id="modal_zip_code"
                required
                value={formData.zip_code}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* This is the NEW code to ADD to the modal form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <div className="mt-2 flex items-center space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="event_type"
                    value="in-person"
                    checked={formData.event_type === "in-person"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm">In-Person</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="event_type"
                    value="online"
                    checked={formData.event_type === "online"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm">Online</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ticket Status
              </label>
              <div className="mt-2 flex items-center space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="ticket_status"
                    value="ticketed"
                    checked={formData.ticket_status === "ticketed"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm">Ticketed</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="ticket_status"
                    value="non-ticketed"
                    checked={formData.ticket_status === "non-ticketed"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm">Non-Ticketed</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-white bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
