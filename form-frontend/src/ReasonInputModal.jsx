// form-frontend/src/ReasonInputModal.jsx
import React, { useState } from "react";

function ReasonInputModal({ actionType, userId, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (reason.trim().length < 10) {
      // Require a minimum reason length
      setError("Reason must be at least 10 characters long.");
      return;
    }
    setError("");
    onConfirm(userId, reason); // Pass userId and reason back to parent
  };

  const actionTitle = actionType === "block" ? "Block User" : "Delete User";
  const actionPrompt = actionType === "block" ? "blocking" : "deleting";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {actionTitle} Reason
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        <p className="text-gray-700 mb-4">
          Please provide a reason for {actionPrompt} this user's account.
        </p>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={`Reason for ${actionPrompt} user...`}
        ></textarea>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-6 py-2 font-semibold rounded-md transition-colors ${
              actionType === "block"
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            Confirm {actionTitle}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReasonInputModal;
