import React, { useState, useEffect } from "react";
import api from "./api";
import { Link } from "react-router-dom";

// Helper components for icons
const UsersIcon = () => (
  <svg
    className="w-8 h-8 text-blue-500"
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
const ClockIcon = () => (
  <svg
    className="w-8 h-8 text-yellow-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const RolesIcon = () => (
  <svg
    className="w-8 h-8 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 0h4"
    />
  </svg>
);
const NewUsersIcon = () => (
  <svg
    className="w-8 h-8 text-indigo-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />
  </svg>
);

// Stat Card Component
const StatCard = ({ title, value, icon, linkTo }) => (
  <Link
    to={linkTo}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4"
  >
    {icon}
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </Link>
);

function DashboardSummary() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/admin/dashboard-stats")
      .then((response) => {
        setStats(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard stats:", err);
        setError("Could not load dashboard data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading Dashboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  return (
    <div>
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pending Users"
          value={stats.pending_users}
          icon={<ClockIcon />}
          linkTo="/admin/users?filter=pending"
        />
        <StatCard
          title="New Users (Last 7 Days)"
          value={stats.new_users_weekly}
          icon={<NewUsersIcon />}
          linkTo="/admin/users"
        />
        <StatCard
          title="Total Users"
          value={stats.total_users}
          icon={<UsersIcon />}
          linkTo="/admin/users"
        />
        <StatCard
          title="Total Roles"
          value={stats.total_roles}
          icon={<RolesIcon />}
          linkTo="/admin/roles"
        />
      </div>

      {/* Recent Activity List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Logins</h2>
        <ul className="divide-y divide-gray-200">
          {stats.recent_logins && stats.recent_logins.length > 0 ? (
            stats.recent_logins.map((login) => (
              <li
                key={login.id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-700">
                    {login.user?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-500">{login.user?.email}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(login.login_at).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No recent login activity.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default DashboardSummary;
