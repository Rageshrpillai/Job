import React from "react";

const EventTypeModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Create a New Event
        </h2>
        <p className="mb-8 text-gray-600">
          Is this a ticketed event? You'll be able to add ticket types and
          coupons in the next step.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => onSelect("ticketed")}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-lg"
          >
            Yes, it's Ticketed
          </button>
          <button
            onClick={() => onSelect("non-ticketed")}
            className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors text-lg"
          >
            No, it's a Free Event
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EventTypeModal;
