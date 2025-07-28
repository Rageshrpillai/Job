import React, { useState, useEffect, useRef } from "react";
import api from "./api";
import { Editor } from "@tinymce/tinymce-react";

const EventDetailsForm = ({ eventId, onNext }) => {
  const [formData, setFormData] = useState({
    title: "",
    event_date: "",
    start_time: "",
    end_time: "",
    venue: "",
    event_type: "in-person",
    category: "",
    max_attendees: "",
  });

  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      setIsLoading(true);
      api
        .get(`/api/events/${eventId}`)
        .then((response) => {
          const event = response.data;
          const startDate = new Date(event.start_time);
          const endDate = new Date(event.end_time);

          setFormData({
            title: event.title || "",
            event_date: startDate.toISOString().split("T")[0],
            start_time: startDate.toTimeString().slice(0, 5),
            end_time: endDate.toTimeString().slice(0, 5),
            venue: event.venue || "",
            event_type: event.event_type || "in-person",
            category: event.category || "",
            max_attendees: event.max_attendees || "",
          });
          setDescription(event.description || "");
          if (event.main_image_path) {
            setPhotoPreview(`/storage/${event.main_image_path}`);
          }
        })
        .catch((error) => console.error("Failed to fetch event details", error))
        .finally(() => setIsLoading(false));
    }
  }, [eventId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setIsLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", description);
    data.append("venue", formData.venue);
    data.append("start_time", `${formData.event_date} ${formData.start_time}`);
    data.append("end_time", `${formData.event_date} ${formData.end_time}`);
    data.append("event_type", formData.event_type);
    data.append("category", formData.category);
    data.append("max_attendees", formData.max_attendees);
    data.append("status", "draft");
    data.append("_method", "PUT"); // Important for Laravel to handle as an update

    if (mainImage) {
      data.append("main_image", mainImage);
    }

    try {
      await api.post(`/api/events/${eventId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onNext();
    } catch (error) {
      console.error("Error updating event details:", error.response?.data);
      alert("Failed to update event details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formData.title) {
    return <div>Loading event details...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Details</h2>
      <p className="text-gray-600 mb-6">
        Step 1 of 3: Confirm or edit the main details for your event.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Event Name
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Photo
          </label>
          <div className="mt-1 flex items-center space-x-4">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Event Preview"
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
                id="main_image_upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
              >
                Change Photo
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="event_date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              name="event_date"
              id="event_date"
              required
              value={formData.event_date}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="start_time"
              className="block text-sm font-medium text-gray-700"
            >
              Start Time
            </label>
            <input
              type="time"
              name="start_time"
              id="start_time"
              required
              value={formData.start_time}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
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
              type="time"
              name="end_time"
              id="end_time"
              required
              value={formData.end_time}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="venue"
            className="block text-sm font-medium text-gray-700"
          >
            Venue / Address
          </label>
          <input
            type="text"
            name="venue"
            id="venue"
            required
            value={formData.venue}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Event Description
        </label>
        <Editor
          apiKey="ea27sqk1uwrlxc5aftiz9b604xwtz8l8n4hqa4ashqoq2k6i"
          value={description}
          onEditorChange={handleEditorChange}
          init={{
            height: 300,
            menubar: true,
            plugins:
              "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
            toolbar:
              "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
          }}
        />

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventDetailsForm;
