import React from "react";

function Pagination({ pagination, onPageChange }) {
  // Don't render if there's only one page or no data
  if (!pagination || pagination.last_page <= 1) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        // **FIX**: Pass the previous page number
        onClick={() => onPageChange(pagination.current_page - 1)}
        disabled={!pagination.prev_page_url}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Page {pagination.current_page} of {pagination.last_page}
      </span>
      <button
        // **FIX**: Pass the next page number
        onClick={() => onPageChange(pagination.current_page + 1)}
        disabled={!pagination.next_page_url}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
