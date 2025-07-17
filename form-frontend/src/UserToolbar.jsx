import React from "react";

function UserToolbar({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  selectedUserCount,
  onBulkAction,
  children,
}) {
  const filterButtons = ["all", "pending", "active", "blocked", "deleted"];

  return (
    <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
      <div className="flex items-center gap-4 flex-grow">
        <div
          className={`transition-opacity duration-300 ${
            selectedUserCount > 0
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {selectedUserCount > 0 && (
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                {selectedUserCount} selected
              </span>
              <select
                onChange={(e) => {
                  onBulkAction(e.target.value);
                  e.target.value = "";
                }}
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Bulk Actions...
                </option>
                <option value="approve">Approve Selected</option>
                <option value="block">Block Selected</option>

                <option value="unblock">Unblock Selected</option>
                <option value="restore">Restore Selected</option>
                <option value="delete">Delete Selected</option>
              </select>
            </div>
          )}
        </div>

        <div className="relative flex-grow max-w-xs">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* The parent component now passes the "More Filters" button here */}
        {children}

        {filterButtons.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeFilter === filter
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserToolbar;
