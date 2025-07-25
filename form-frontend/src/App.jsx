import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import api from "./api";

// Import all page components
import RoleManagement from "./RoleManagement";
import AuthPage from "./AuthPage";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import UserManagement from "./UserManagement";
import AdminManagement from "./AdminManagement";
import DashboardSummary from "./DashboardSummary";
import AnalysisPage from "./AnalysisPage";
import EventManagementPage from "./EventManagementPage";
import SubUserManagementPage from "./SubUserManagementPage";
import UserRoleManagement from "./UserRoleManagement";
import CreateEventWizard from "./CreateEventWizard"; // Import the wizard

// This is a helper component to protect routes based on login status and role
const ProtectedRoute = ({ isAllowed, redirectPath = "/login", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  // The <Outlet /> component is used to render nested routes
  return children ? children : <Outlet />;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for an authenticated user on initial application load
  useEffect(() => {
    api
      .get("/api/user")
      .then((response) => setUser(response.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    // After a successful login, navigate to the correct dashboard
    if (userData.is_admin) {
      window.location.href = "/admin"; // Navigate to the main admin dashboard
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleLogout = async () => {
    const wasAdmin = user?.is_admin;
    try {
      await api.post("/api/logout");
    } catch (error) {
      console.error("Logout API call failed, but redirecting anyway:", error);
    } finally {
      setUser(null);
      if (wasAdmin) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
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
      <Router>
        <Routes>
          {/* Public Routes (for users who are not logged in) */}
          <Route
            path="/login"
            element={
              !user ? (
                <AuthPage onAuthSuccess={handleAuthSuccess} />
              ) : (
                <Navigate to={user.is_admin ? "/admin" : "/dashboard"} />
              )
            }
          />
          <Route
            path="/admin/login"
            element={
              !user ? (
                <AdminLogin onLogin={handleAuthSuccess} />
              ) : (
                <Navigate to="/admin" />
              )
            }
          />

          {/* Protected Routes for Standard Users (with nested pages) */}
          <Route
            element={
              <ProtectedRoute
                isAllowed={!!user && !user.is_admin}
                redirectPath="/login"
              />
            }
          >
            <Route
              path="/dashboard"
              element={<UserDashboard user={user} onLogout={handleLogout} />}
            >
              {/* Default page for /dashboard */}
              <Route index element={<AnalysisPage />} />

              {/* Other user dashboard pages */}
              <Route path="events" element={<EventManagementPage />} />
              {/* THIS IS THE NEWLY ADDED ROUTE */}
              <Route
                path="events/create-wizard/:eventId"
                element={<CreateEventWizard />}
              />
              <Route path="sub-users" element={<SubUserManagementPage />} />
              <Route path="team-roles" element={<UserRoleManagement />} />
            </Route>
          </Route>

          {/* Protected Routes for Admins (with nested pages) */}
          <Route
            element={
              <ProtectedRoute
                isAllowed={!!user && user.is_admin}
                redirectPath="/admin/login"
              />
            }
          >
            <Route
              path="/admin"
              element={<AdminDashboard user={user} onLogout={handleLogout} />}
            >
              {/* These nested routes render inside AdminDashboard's <Outlet /> */}

              {/* This is the default page for /admin */}
              <Route index element={<DashboardSummary />} />

              <Route path="users" element={<UserManagement />} />
              <Route path="admins" element={<AdminManagement />} />

              {/* The path is now relative, which is correct */}
              <Route path="roles" element={<RoleManagement />} />
            </Route>
          </Route>

          {/* Fallback Route: Redirects to the correct starting page */}
          <Route
            path="*"
            element={
              <Navigate
                to={user ? (user.is_admin ? "/admin" : "/dashboard") : "/login"}
                replace
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
