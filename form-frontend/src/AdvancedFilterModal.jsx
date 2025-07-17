import React, { useState } from "react";
import DatePicker from "react-datepicker";

function AdvancedFilterModal({ onApply, onClear, initialFilters }) {
  const [startDate, setStartDate] = useState(initialFilters.startDate || null);
  const [endDate, setEndDate] = useState(initialFilters.endDate || null);
  // **NEW**: State for the date type dropdown
  const [dateType, setDateType] = useState(
    initialFilters.dateType || "created_at"
  );

  const [sortBy, setSortBy] = useState(initialFilters.sortBy || "created_at");
  const [sortDirection, setSortDirection] = useState(
    initialFilters.sortDirection || "desc"
  );

  const handleApply = () => {
    // Pass all filter and sort states back to the parent
    onApply({ startDate, endDate, dateType, sortBy, sortDirection });
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setDateType("created_at");
    setSortBy("created_at");
    setSortDirection("desc");
    onClear();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border rounded-lg shadow-xl z-20 p-4">
      <h4 className="font-bold mb-4 text-gray-800">
        Advanced Filters & Sorting
      </h4>

      {/* **MODIFIED**: Date Filter Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Date
        </label>
        <select
          value={dateType}
          onChange={(e) => setDateType(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm mb-2"
        >
          <option value="created_at">Date Joined</option>
          <option value="last_login_at">Last Login Date</option>
        </select>
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
          />
        </div>
      </div>

      {/* Sorting Controls Section (no change here) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full ..."
          >
            <option value="created_at">Date Joined</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
          </select>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            className="w-full ..."
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={handleClear}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Clear All
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default AdvancedFilterModal;
