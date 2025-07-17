import React from "react";

function UserTableRow({
  user,
  onAction,
  onViewDetails,
  showReasonColumn,
  isSelected,
  onSelectUser,
}) {
  const getStatusBadge = (status, isBlocked) => {
    if (isBlocked)
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          Blocked
        </span>
      );
    if (user.deleted_at)
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
          Deleted
        </span>
      );

    switch (status) {
      case "active":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        );
      case "pending_approval":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    // Add a subtle background color change if the row is selected
    <tr className={isSelected ? "bg-blue-50" : ""}>
      {/* **NEW**: Individual Checkbox Cell */}
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelectUser(user.id, e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {user.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.phone || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
        {user.address || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(user.status, user.is_blocked)}
      </td>

      {showReasonColumn && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
          {user.blocked_reason || user.deleted_reason}
        </td>
      )}

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          {user.latest_login
            ? new Date(user.latest_login.login_at).toLocaleString()
            : "Never"}
        </div>
        <div className="font-mono text-xs">
          {user.latest_login ? user.latest_login.ip_address : "N/A"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewDetails(user)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            View
          </button>
          {user.status === "pending_approval" && (
            <button
              onClick={() => onAction("approve", user.id)}
              className="text-green-600 hover:text-green-900"
            >
              Approve
            </button>
          )}
          {!user.is_blocked && !user.deleted_at && user.status === "active" && (
            <button
              onClick={() => onAction("block", user.id)}
              className="text-red-600 hover:text-red-900"
            >
              Block
            </button>
          )}
          {user.is_blocked && !user.deleted_at && (
            <button
              onClick={() => onAction("unblock", user.id)}
              className="text-yellow-600 hover:text-yellow-900"
            >
              Unblock
            </button>
          )}
          {!user.deleted_at && (
            <button
              onClick={() => onAction("soft-delete", user.id)}
              className="text-gray-600 hover:text-gray-900"
            >
              Delete
            </button>
          )}
          {user.deleted_at && (
            <button
              onClick={() => onAction("restore", user.id)}
              className="text-blue-600 hover:text-blue-900"
            >
              Restore
            </button>
          )}
          {user.deleted_at && (
            <button
              onClick={() =>
                onAction(
                  "force-delete",
                  user.id,
                  "Are you sure you want to permanently delete this user? This cannot be undone."
                )
              }
              className="text-red-800 hover:text-red-900"
            >
              Force Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default UserTableRow;
