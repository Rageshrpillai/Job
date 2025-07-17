import React from "react";
import UserTableRow from "./UserTableRow";

// **MODIFIED**: Removed all sorting-related props (onSort, sortBy, sortDirection)
function UserTable({
  users,
  onAction,
  onViewDetails,
  showReasonColumn,
  selectedUserIds,
  onSelectUser,
  onSelectAll,
}) {
  if (!users) {
    return <p className="text-center text-gray-500 py-4">Loading...</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* **MODIFIED**: Headers are no longer clickable buttons */}
            <th className="px-6 py-3">
              <input
                type="checkbox"
                onChange={(e) => onSelectAll(e.target.checked)}
                checked={
                  users.length > 0 && selectedUserIds.length === users.length
                }
                className="h-4 w-4 ..."
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {showReasonColumn && (
              <th className="px-6 py-3 text-left ...">Reason</th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.filter(Boolean).map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onAction={onAction}
              onViewDetails={onViewDetails}
              showReasonColumn={showReasonColumn}
              isSelected={selectedUserIds.includes(user.id)}
              onSelectUser={onSelectUser}
            />
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <p className="text-center text-gray-500 py-4">No users found.</p>
      )}
    </div>
  );
}

export default UserTable;
