import React from "react";
import { NavLink, Outlet } from "react-router-dom"; // Import NavLink and Outlet

// --- Helper Components for Icons ---
const UsersIcon = () => (
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
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0112 10a5.995 5.995 0 015 5.197"
    />
  </svg>
);

// **NEW**: Icon for Role Management
const RolesIcon = () => (
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
      strokeWidth="2"
      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 0h4"
    />
  </svg>
);

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
// --- End of Icons ---

function AdminDashboard({ user, onLogout }) {
  // Style for active NavLink
  const activeLinkStyle = {
    backgroundColor: "#2563EB", // This is bg-blue-600
    color: "white",
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col flex-shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* **MODIFIED**: Changed button to NavLink */}
          <NavLink
            to="/admin/users"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700"
          >
            <UsersIcon />
            <span>User Management</span>
          </NavLink>

          {/* **NEW**: Added NavLink for Role Management */}
          <NavLink
            to="/admin/admins"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700"
          >
            <RolesIcon />
            <span>Admin Management</span>
          </NavLink>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* **MODIFIED**: Main Content now uses an Outlet to render the active route's component */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user.name}!
          </h1>
        </header>
        {/* The Outlet component from react-router-dom will render UserManagement or RoleManagement here */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard;
