import React from "react";

const PreviewEventModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b">
          {/* --- FIX 1: Use 'title' from your backend --- */}
          <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl font-light"
          >
            &times;
          </button>
        </div>

        {/* Display the event image */}
        {event.main_image_path && (
          <div>
            <img
              src={`http://localhost:8000/storage/${event.main_image_path}`}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <h3 className="font-semibold text-gray-700">Start Time:</h3>
            {/* --- FIX 2: Use 'start_time' directly --- */}
            <p className="text-gray-600">
              {new Date(event.start_time).toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">End Time:</h3>
            {/* --- FIX 3: Use 'end_time' from your backend --- */}
            <p className="text-gray-600">
              {new Date(event.end_time).toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Venue:</h3>
            {/* --- FIX 4: Use 'venue' from your backend --- */}
            <p className="text-gray-600">{event.venue}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Event Type:</h3>
            <p className="text-gray-600 capitalize">{event.event_type}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mt-2">Description:</h3>
          {/* This will correctly render the HTML from your rich text editor */}
          <div
            className="prose max-w-none text-gray-600 mt-1"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewEventModal;
