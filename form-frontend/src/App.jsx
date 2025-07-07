import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthPage from "./AuthPage";
import AdminDashboard from "./AdminDashboard";

// Configure axios
axios.defaults.withCredentials = true;
// Change this line to send requests to the proxy
axios.defaults.baseURL = "http://localhost:5173";
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is already logged in when the app loads
  useEffect(() => {
    axios
      .get("/api/user")
      .then((response) => setUser(response.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // This function will be called on successful login or registration
  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  // This is the corrected, more robust logout function
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      // This ensures the user is logged out on the frontend
      // even if the server request fails.
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="antialiased bg-slate-100 text-slate-800">
      {user ? (
        // Pass the corrected logout function to the dashboard
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        // Pass the correct prop to the authentication page
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
