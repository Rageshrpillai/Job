import React, { useState, useRef } from "react";
import api from "./api";
import { Editor } from "@tinymce/tinymce-react";

const EventDetailsForm = ({ onNextStep }) => {
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
  const [isLoading, setIsLoading] = useState(false);

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
    data.append("status", "draft"); // Save as draft

    if (mainImage) {
      data.append("main_image", mainImage);
    }

    try {
      const response = await api.post("/api/events", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // On success, call the onNextStep prop with the new event data
      onNextStep(response.data);
    } catch (error) {
      console.error("Error creating event draft:", error.response?.data);
      alert("Failed to create event draft. Please check the form.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Create a Ticketed Event
      </h2>
      <p className="text-gray-600 mb-8">
        Step 1 of 4: Enter the main event details.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* All the input fields from AddEvent.jsx go here */}
        {/* The full form JSX is omitted for brevity, but it's the same as your AddEvent.jsx form */}

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center py-3 px-8 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? "Saving Draft..." : "Save & Continue to Tickets"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventDetailsForm;
