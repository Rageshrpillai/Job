import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { Editor } from "@tinymce/tinymce-react";
import EventTypeModal from "./EventTypeModal";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    event_name: "",
    event_date: "",
    event_start_time: "",
    event_end_time: "",
    location: "",
    state: "",
    zip_code: "",
    event_type: "in-person",
    category: "",
    max_attendees: "",
  });

  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  // Step 1: The form's submit button calls this function
  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  // Step 2: The modal calls this function after a choice is made
  const handleFinalSubmit = async (ticketStatus) => {
    setIsModalOpen(false);

    const data = new FormData();
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
    data.append("category", formData.category);
    data.append("max_attendees", formData.max_attendees);
    if (mainImage) {
      data.append("main_image", mainImage);
    }

    if (ticketStatus === "ticketed") {
      data.append("status", "draft");
      try {
        const response = await api.post("/api/events", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate(`/dashboard/events/create/${response.data.id}`);
      } catch (error) {
        console.error("Error creating draft event:", error.response?.data);
        alert("Failed to create draft event.");
      }
    } else {
      data.append("status", "published");
      try {
        await api.post("/api/events", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Event created successfully!");
        navigate("/dashboard/events");
      } catch (error) {
        console.error("Error creating event:", error.response?.data);
        alert("Failed to create event.");
      }
    }
  };

  return (
    <>
      <div className="bg-white p-6 sm:p-10 rounded-b-2xl rounded-tr-2xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Create a New Event
          </h2>
          <form className="space-y-6" onSubmit={handleInitialSubmit}>
            <div>
              <label
                htmlFor="event_name"
                className="block text-sm font-medium text-gray-700"
              >
                Event Name
              </label>
              <input
                type="text"
                name="event_name"
                id="event_name"
                required
                value={formData.event_name}
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
                    Upload Photo
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
                  htmlFor="event_start_time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  name="event_start_time"
                  id="event_start_time"
                  required
                  value={formData.event_start_time}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="event_end_time"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <input
                  type="time"
                  name="event_end_time"
                  id="event_end_time"
                  required
                  value={formData.event_end_time}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location / Address
              </label>
              <input
                type="text"
                name="location"
                id="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="zip_code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zip_code"
                  id="zip_code"
                  required
                  value={formData.zip_code}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

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
                    className="form-radio h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">In-Person</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="event_type"
                    value="online"
                    checked={formData.event_type === "online"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Online</span>
                </label>
              </div>
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Event Description
            </label>
            <Editor
              apiKey="ea27sqk1uwrlxc5aftiz9b604xwtz8l8n4hqa4ashqoq2k6i"
              onEditorChange={handleEditorChange}
              init={{
                height: 500,
                menubar: true,
                plugins:
                  "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
                toolbar:
                  "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              }}
            />

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>

      <EventTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleFinalSubmit}
      />
    </>
  );
};

export default AddEvent;
