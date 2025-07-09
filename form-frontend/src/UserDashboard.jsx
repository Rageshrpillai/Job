// form-frontend/src/UserDashboard.jsx
import React, { useState, useEffect } from "react"; // Import useEffect and useState

function UserDashboard({ user, onLogout }) {
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);

  useEffect(() => {
    // Show the popup if the user status is pending_approval
    if (user && user.status === "pending_approval") {
      setShowVerificationPopup(true);
    }
  }, [user]); // Re-run effect if user object changes

  const handleClosePopup = () => {
    setShowVerificationPopup(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome, {user.name}!
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Your account status is:
          <span
            className={`ml-2 font-semibold ${
              user.status === "active" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {user.status.replace("_", " ")}
          </span>
        </p>
        <button
          onClick={onLogout}
          className="mt-8 px-6 py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </div>

      {showVerificationPopup && user.status === "pending_approval" && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Account Pending Approval
            </h2>
            <p className="text-gray-700 mb-6">
              Your account is currently in the queue to be verified by an
              administrator. Please be patient.
            </p>
            <p className="text-gray-700 mb-6">
              If it takes longer than usual, please contact us at{" "}
              <a
                href="mailto:admin@gmail.com"
                className="text-blue-600 hover:underline"
              >
                admin@gmail.com
              </a>
              .
            </p>
            <button
              onClick={handleClosePopup}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
