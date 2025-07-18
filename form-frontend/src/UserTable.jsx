import React from "react";
import UserTableRow from "./UserTableRow";

/**
 * A small component to display the correct sort arrow or a placeholder.
 * @param {{ direction: 'asc' | 'desc' | null }} props
 */
const SortIcon = ({ direction }) => {
  // Using more visually distinct arrows
  if (direction === "asc") {
    return <span className="ml-1 text-gray-800">▲</span>;
  }
  if (direction === "desc") {
    return <span className="ml-1 text-gray-800">▼</span>;
  }
  // A subtle placeholder to indicate sortability
  return (
    <span className="ml-1 text-gray-300 group-hover:text-gray-400">▲</span>
  );
};

/**
 * A reusable component for creating sortable table headers.
 * @param {{ columnKey: string, title: string, onSort: (key: string) => void, sortBy: string, sortDirection: string }} props
 */
const SortableHeader = ({
  columnKey,
  title,
  onSort,
  sortBy,
  sortDirection,
}) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    <button
      onClick={() => onSort(columnKey)}
      className="flex items-center group focus:outline-none"
    >
      <span>{title}</span>
      <SortIcon direction={sortBy === columnKey ? sortDirection : null} />
    </button>
  </th>
);

function UserTable({
  users,
  onAction,
  onViewDetails,
  showReasonColumn,
  selectedUserIds,
  onSelectUser,
  onSelectAll,
  onSort,
  sortBy,
  sortDirection,
}) {
  if (!users) {
    return <p className="text-center text-gray-500 py-4">Loading users...</p>;
  }

  const isAllSelected =
    users.length > 0 && selectedUserIds.length === users.length;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3">
              <input
                type="checkbox"
                onChange={(e) => onSelectAll(e.target.checked)}
                checked={isAllSelected}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>
            <SortableHeader
              columnKey="name"
              title="Name"
              onSort={onSort}
              sortBy={sortBy}
              sortDirection={sortDirection}
            />
            <SortableHeader
              columnKey="email"
              title="Email"
              onSort={onSort}
              sortBy={sortBy}
              sortDirection={sortDirection}
            />
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
            )}
            <SortableHeader
              columnKey="created_at"
              title="Joined"
              onSort={onSort}
              sortBy={sortBy}
              sortDirection={sortDirection}
            />
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length > 0 ? (
            users
              .filter(Boolean)
              .map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onAction={onAction}
                  onViewDetails={onViewDetails}
                  showReasonColumn={showReasonColumn}
                  isSelected={selectedUserIds.includes(user.id)}
                  onSelectUser={(isChecked) => onSelectUser(user.id, isChecked)}
                />
              ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center text-gray-500 py-6">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
