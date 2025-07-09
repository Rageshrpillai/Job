// form-frontend/src/UserDetailModal.jsx
import React from "react";

function UserDetailModal({
  user,
  onClose,
  onApprove,
  onBlock, // New prop for blocking
  onUnblock, // New prop for unblocking
  onSoftDelete, // New prop for soft deleting
  onRestore, // New prop for restoring
  onForceDelete, // New prop for force deleting
}) {
  if (!user) return null;

  // Helper to determine if user is soft-deleted
  const isTrashed = user.deleted_at !== null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4 text-left">
          <p>
            <strong className="text-gray-700">Name:</strong> {user.name}
          </p>
          <p>
            <strong className="text-gray-700">Email:</strong> {user.email}
          </p>
          <p>
            <strong className="text-gray-700">Status:</strong>{" "}
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                isTrashed
                  ? "bg-gray-100 text-gray-800"
                  : user.is_blocked
                  ? "bg-red-100 text-red-800"
                  : user.status === "active"
                  ? "bg-green-100 text-green-800"
                  : user.status === "pending_approval"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800" // Fallback for other statuses
              }`}
            >
              {isTrashed
                ? "Deleted"
                : user.is_blocked
                ? "Blocked"
                : user.status.replace("_", " ")}
            </span>
          </p>
          {user.is_blocked && user.blocked_reason && (
            <p>
              <strong className="text-gray-700">Blocked Reason:</strong>{" "}
              {user.blocked_reason}
            </p>
          )}
          {user.blocked_at && (
            <p>
              <strong className="text-gray-700">Blocked At:</strong>{" "}
              {new Date(user.blocked_at).toLocaleString()}
            </p>
          )}
          {isTrashed && user.deleted_reason && (
            <p>
              <strong className="text-gray-700">Deleted Reason:</strong>{" "}
              {user.deleted_reason}
            </p>
          )}
          {isTrashed && (
            <p>
              <strong className="text-gray-700">Deleted At:</strong>{" "}
              {new Date(user.deleted_at).toLocaleString()}
            </p>
          )}
          {user.last_login_at && (
            <p>
              <strong className="text-gray-700">Last Login:</strong>{" "}
              {new Date(user.last_login_at).toLocaleString()}
            </p>
          )}
          {user.last_login_ip && (
            <p>
              <strong className="text-gray-700">Last Login IP:</strong>{" "}
              {user.last_login_ip}
            </p>
          )}
          {user.created_at && (
            <p>
              <strong className="text-gray-700">Registered On:</strong>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          {/* Action Buttons based on User Status */}
          {!user.is_admin &&
            !isTrashed &&
            user.status === "pending_approval" && (
              <button
                onClick={() => onApprove(user.id)}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
              >
                Approve User
              </button>
            )}

          {!user.is_admin &&
            !isTrashed &&
            !user.is_blocked &&
            user.status === "active" && (
              <button
                onClick={() => onBlock(user)}
                className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition-colors"
              >
                Block User
              </button>
            )}

          {!user.is_admin && !isTrashed && user.is_blocked && (
            <button
              onClick={() => onUnblock(user.id)}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Unblock User
            </button>
          )}

          {/* Show Soft Delete for active, blocked, pending users (if not already trashed) */}
          {!user.is_admin &&
            !isTrashed &&
            (user.status === "active" ||
              user.status === "blocked" ||
              user.status === "pending_approval") && (
              <button
                onClick={() => onSoftDelete(user)}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
              >
                Soft Delete
              </button>
            )}

          {!user.is_admin && isTrashed && (
            <button
              onClick={() => onRestore(user.id)}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
            >
              Restore
            </button>
          )}

          {!user.is_admin && isTrashed && (
            <button
              onClick={() => onForceDelete(user.id)}
              className="px-4 py-2 bg-red-800 text-white font-semibold rounded-md hover:bg-red-900 transition-colors"
            >
              Force Delete
            </button>
          )}

          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;
