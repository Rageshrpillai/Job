// form-frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; //
import api from "./api"; //
import AuthPage from "./AuthPage"; //
import AdminDashboard from "./AdminDashboard"; //
import UserDashboard from "./UserDashboard"; //
import AdminLogin from "./AdminLogin"; //

function App() {
  const [user, setUser] = useState(null); //
  const [loading, setLoading] = useState(true); //

  useEffect(() => {
    //
    api
      .get("/api/user") //
      .then((response) => setUser(response.data)) //
      .catch(() => setUser(null)) //
      .finally(() => setLoading(false)); //
  }, []); //

  const handleAuthSuccess = (userData) => {
    //
    setUser(userData); //
  }; //

  const handleLogout = async () => {
    //
    try {
      //
      await api.post("/api/logout"); //
    } finally {
      //
      setUser(null); //
    } //
  }; //

  if (loading) {
    //
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="antialiased bg-slate-100">
      <Router>
        {" "}
        {/* */}
        <Routes>
          {" "}
          {/* */}
          {/* If user is authenticated */}
          {user ? ( //
            <>
              {user.is_admin ? ( //
                <Route
                  path="/admin/*"
                  element={
                    <AdminDashboard user={user} onLogout={handleLogout} />
                  }
                /> //
              ) : (
                <Route
                  path="/dashboard"
                  element={
                    <UserDashboard user={user} onLogout={handleLogout} />
                  }
                /> //
              )}
              {/* Redirect authenticated users from login pages */}
              <Route
                path="/login"
                element={
                  <Navigate
                    to={user.is_admin ? "/admin" : "/dashboard"}
                    replace
                  />
                }
              />{" "}
              {/* */}
              <Route
                path="/admin/login"
                element={<Navigate to="/admin" replace />}
              />{" "}
              {/* */}
              <Route
                path="/"
                element={
                  <Navigate
                    to={user.is_admin ? "/admin" : "/dashboard"}
                    replace
                  />
                }
              />{" "}
              {/* */}
            </>
          ) : (
            // If user is not authenticated
            <>
              <Route
                path="/login"
                element={<AuthPage onAuthSuccess={handleAuthSuccess} />}
              />{" "}
              {/* */}
              <Route
                path="/admin/login"
                element={<AdminLogin onLogin={handleAuthSuccess} />}
              />{" "}
              {/* */}
              {/* Redirect root to user login if not authenticated */}
              <Route path="/" element={<Navigate to="/login" replace />} />{" "}
              {/* */}
              {/* Fallback for unknown paths when not authenticated, redirect to user login */}
              <Route path="*" element={<Navigate to="/login" replace />} />{" "}
              {/* */}
            </>
          )}
        </Routes>{" "}
        {/* */}
      </Router>{" "}
      {/* */}
    </div>
  );
}

export default App;
