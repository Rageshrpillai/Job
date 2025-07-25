import React from "react";

const EventTypeModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Is this a ticketed event?
        </h2>
        <p className="text-gray-600 mb-6">
          A ticketed event allows you to sell tickets, manage attendees, and
          offer coupons. A non-ticketed event is for display and information
          only.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            No, it's for Info
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Yes, it's Ticketed
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventTypeModal;
