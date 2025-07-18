// File: src/AnalysisPage.jsx
// This code REPLACES the previous version of this file.

// What's new:
// 1. It now uses useState and useEffect to fetch data from the backend.
// 2. It connects to a new API endpoint: '/api/dashboard-stats'.
// 3. It shows a "Loading..." message while fetching.
// 4. It displays the real stats once they are loaded.

import React, { useState, useEffect } from "react";
import api from "./api"; // Ensure this path is correct for your api service

const AnalysisPage = () => {
  const [stats, setStats] = useState({ events: 0, tickets: 0, subUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from the backend when the component loads
    api
      .get("/api/dashboard-stats")
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // The empty array ensures this effect runs only once

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard Analysis
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Total Events Created
          </h2>
          <p className="text-4xl font-bold text-indigo-600">{stats.events}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Tickets Sold
          </h2>
          <p className="text-4xl font-bold text-indigo-600">{stats.tickets}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Active Sub-Users
          </h2>
          <p className="text-4xl font-bold text-indigo-600">{stats.subUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
