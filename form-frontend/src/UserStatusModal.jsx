// form-frontend/src/UserStatusModal.jsx
import React from "react";

function UserStatusModal({ message, onClose }) {
  if (!message) return null;

  return (
    // Outer overlay: Stronger blur and higher opacity for the background overlay
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-lg">
      {/* Inner modal content: Slightly more translucent white with a subtle border and enhanced shadow */}
      <div className="bg-white bg-opacity-70 rounded-lg shadow-2xl p-8 w-full max-w-sm mx-auto text-center border border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Notification</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Got It!
        </button>
      </div>
    </div>
  );
}

export default UserStatusModal;
