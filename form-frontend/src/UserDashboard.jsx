import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SubUserManagement from "./SubUserManagement";
import CreateEventModal from "./CreateEventModal";

// --- Icon Helper Component ---
const LogoutIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

function UserDashboard({ user, onLogout }) {
  // Check if the user is an organizer (or any type other than individual)
  const isOrganizer =
    user?.organization_type && user.organization_type !== "individual";

  // State to control the visibility of the "Create Event" modal
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col flex-shrink-0">
        <div className="p-6 text-2xl font-bold text-white border-b border-gray-700">
          {user?.company_name || "My Dashboard"}
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* We will add navigation links here in the future for different sections */}
          {/* like Analytics, Events List, etc. */}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening with your organization today.
            </p>
          </div>
          {/* The "Create New Event" button is only shown to organizers */}
          {isOrganizer && (
            <button
              onClick={() => setShowCreateEventModal(true)}
              className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-md transition"
            >
              + Create New Event
            </button>
          )}
        </header>

        {/* Conditionally render the Team Management section for organizers */}
        {isOrganizer ? (
          <SubUserManagement />
        ) : (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <p>
              Welcome to your dashboard. Future features for your account type
              will appear here.
            </p>
          </div>
        )}
      </main>

      {/* The Create Event Modal, which is controlled by the state above */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onEventCreated={() => {
          // This function is called when an event is created successfully.
          // Later, we can add logic here to automatically refresh an event list.
          console.log("Event created successfully!");
        }}
      />
    </div>
  );
}

export default UserDashboard;
