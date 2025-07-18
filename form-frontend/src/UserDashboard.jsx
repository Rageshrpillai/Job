// File: src/UserDashboard.jsx
// This is the complete, corrected code for this file.
// It REPLACES the previous version entirely.

// What's new:
// 1. Correct NavLink 'to' paths: Changed from "/user-dashboard" to "/dashboard" to match your App.jsx routes.
// 2. Added a Logout button at the bottom of the sidebar. It calls the 'onLogout' function passed from App.jsx.
// 3. Passed the 'user' prop to display the user's name.

import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { PowerIcon, UserCircleIcon } from "@heroicons/react/24/outline"; // Using icons for a better UI

const UserDashboard = ({ user, onLogout }) => {
  // These styles help indicate the active page
  const linkClasses =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition duration-200";
  const activeLinkClasses = "bg-indigo-700 text-white font-semibold";
  const inactiveLinkClasses =
    "text-indigo-100 hover:bg-indigo-500 hover:text-white";

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="px-4 py-5 text-2xl font-bold border-b border-indigo-700">
          My Dashboard
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow p-2 space-y-1">
          <NavLink
            to="/dashboard"
            end // 'end' ensures this link is only active on the exact path
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive ? activeLinkClasses : inactiveLinkClasses
              }`
            }
          >
            Analysis
          </NavLink>
          <NavLink
            to="/dashboard/events"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive ? activeLinkClasses : inactiveLinkClasses
              }`
            }
          >
            Events
          </NavLink>
          <NavLink
            to="/dashboard/sub-users"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive ? activeLinkClasses : inactiveLinkClasses
              }`
            }
          >
            Sub-Users
          </NavLink>
        </nav>

        {/* User Info and Logout Button */}
        <div className="p-4 border-t border-indigo-700">
          <div className="flex items-center gap-3 mb-4">
            <UserCircleIcon className="h-10 w-10 text-indigo-300" />
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-sm text-indigo-300">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-red-500 rounded-md text-white font-semibold transition-colors duration-200"
          >
            <PowerIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* The Outlet component renders the matched child route component */}
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
