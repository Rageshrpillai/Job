import React, { useState, useEffect } from "react";
import api from "./api";

function UserDetailModal({ user, onClose, onAction }) {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    // This effect will run whenever the 'user' prop changes.
    // It ensures that when you click "View" on a new user, their history is fetched.
    if (user && user.id) {
      setLoadingHistory(true);
      api
        .get(`/api/admin/users/${user.id}/login-history`)
        .then((response) => {
          setHistory(response.data);
        })
        .catch((err) => {
          console.error("Failed to fetch login history", err);
          setHistory([]); // Ensure history is cleared on an error
        })
        .finally(() => setLoadingHistory(false));
    }
  }, [user]); // The dependency array makes this effect re-run when the user object changes.

  if (!user) {
    return null; // Don't render anything if no user is selected
  }

  return (
    // The z-50 class ensures it has a base layer index
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">{user.name}</h3>

        {/* User Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Phone:</strong> {user.phone || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Status:</strong> {user.status}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Joined:</strong>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-600">
              <strong>Address:</strong> {user.address || "N/A"}
            </p>
          </div>
        </div>

        {/* Conditional Reason Display */}
        {user.is_blocked && user.blocked_reason && (
          <div className="bg-red-50 p-3 rounded-md mb-4">
            <p className="text-sm text-red-700">
              <strong>Blocked Reason:</strong> {user.blocked_reason}
            </p>
          </div>
        )}
        {user.deleted_at && user.deleted_reason && (
          <div className="bg-gray-100 p-3 rounded-md mb-4">
            <p className="text-sm text-gray-700">
              <strong>Deletion Reason:</strong> {user.deleted_reason}
            </p>
          </div>
        )}

        {/* Login History Section */}
        <div className="mt-4">
          <h4 className="font-bold text-gray-700 mb-2">
            Recent Login History (Last 5)
          </h4>
          <div className="border rounded-md max-h-48 overflow-y-auto">
            {loadingHistory ? (
              <p className="p-3 text-gray-500">Loading history...</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {history.length > 0 ? (
                  history.map((log) => (
                    <li
                      key={log.id}
                      className="p-3 flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">
                        {new Date(log.login_at).toLocaleString()}
                      </span>
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {log.ip_address}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="p-3 text-gray-500">No login history found.</p>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {user.status === "pending_approval" && (
            <button
              onClick={() => onAction("approve", user.id)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Approve
            </button>
          )}
          {!user.is_blocked && !user.deleted_at && user.status === "active" && (
            <button
              onClick={() => onAction("block", user.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Block
            </button>
          )}
          {user.is_blocked && !user.deleted_at && (
            <button
              onClick={() => onAction("unblock", user.id)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Unblock
            </button>
          )}
          {!user.deleted_at && (
            <button
              onClick={() => onAction("soft-delete", user.id)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Delete
            </button>
          )}
          {user.deleted_at && (
            <button
              onClick={() => onAction("restore", user.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Restore
            </button>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;
