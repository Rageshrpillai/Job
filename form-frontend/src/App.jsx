import React, { useState, useEffect } from "react";
import api from "./api";
import AuthPage from "./AuthPage";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard"; // Import the new component

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/user")
      .then((response) => setUser(response.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
    } finally {
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="antialiased bg-slate-100">
      {user ? (
        user.is_admin ? (
          <AdminDashboard user={user} onLogout={handleLogout} />
        ) : (
          <UserDashboard user={user} onLogout={handleLogout} />
        )
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
