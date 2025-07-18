// File: src/EventManagementPage.jsx
// This is a new file that will act as a container for managing and adding events.

import React, { useState } from "react";
import ManageEvents from "./ManageEvents"; // We will create this component next
import AddEvent from "./AddEvent"; // We will create this component next

const EventManagementPage = () => {
  // State to control which tab is active
  const [activeTab, setActiveTab] = useState("manage");

  const tabStyles =
    "py-2 px-4 font-semibold rounded-t-lg transition-colors duration-300 focus:outline-none";
  const activeTabStyles = "bg-indigo-600 text-white";
  const inactiveTabStyles = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div className="p-6 sm:p-8">
      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab("manage")}
          className={`${tabStyles} ${
            activeTab === "manage" ? activeTabStyles : inactiveTabStyles
          }`}
        >
          Manage Events
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`${tabStyles} ${
            activeTab === "add" ? activeTabStyles : inactiveTabStyles
          }`}
        >
          Add New Event
        </button>
      </div>

      <div>
        {/* Conditionally render the component based on the active tab */}
        {activeTab === "manage" ? <ManageEvents /> : <AddEvent />}
      </div>
    </div>
  );
};

export default EventManagementPage;
