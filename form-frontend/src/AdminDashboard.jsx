import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminList from "./AdminList";

// --- Helper Components for Icons ---
const HomeIcon = () => (
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);
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
  const [activeView, setActiveView] = useState("dashboard");
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/users")
      .then((response) => {
        const admins = response.data.filter((u) => u.is_admin);
        setAdminCount(admins.length);
      })
      .catch((error) => console.error("Failed to fetch users", error))
      .finally(() => setLoading(false));
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case "admins":
        return <AdminList />;
      case "dashboard":
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <p className="text-5xl font-bold text-blue-600">
                  {loading ? "..." : adminCount}
                </p>
                <p className="text-slate-500 mt-2">Total Registered Admins</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    // This is the corrected line. The negative margin (-m-10) has been removed.
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col flex-shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              activeView === "dashboard" ? "bg-blue-600" : "hover:bg-slate-700"
            }`}
          >
            <HomeIcon />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView("admins")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              activeView === "admins" ? "bg-blue-600" : "hover:bg-slate-700"
            }`}
          >
            <UsersIcon />
            <span>Admins</span>
          </button>
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

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user.name}!
          </h1>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;
