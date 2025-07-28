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
import CouponManagementPage from "./CouponManagementPage";
import TicketManagementPage from "./TicketManagementPage"; // <-- Import the new page

// This is a helper component to protect routes
const ProtectedRoute = ({ isAllowed, redirectPath = "/login", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

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
    if (userData.is_admin) {
      window.location.href = "/admin";
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
          {/* Public Routes */}
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

          {/* Protected Routes for Standard Users */}
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
              <Route index element={<Navigate to="analysis" replace />} />
              <Route path="analysis" element={<AnalysisPage />} />
              <Route path="events" element={<EventManagementPage />} />
              {/* This is the new route for the standalone ticket page */}
              <Route
                path="events/:eventId/tickets"
                element={<TicketManagementPage />}
              />
              <Route
                path="events/:eventId/coupons"
                element={<CouponManagementPage />}
              />
              <Route path="sub-users" element={<SubUserManagementPage />} />
              <Route path="team-roles" element={<UserRoleManagement />} />
            </Route>
          </Route>

          {/* Protected Routes for Admins */}
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
              <Route index element={<Navigate to="summary" replace />} />
              <Route path="summary" element={<DashboardSummary />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="admins" element={<AdminManagement />} />
              <Route path="roles" element={<RoleManagement />} />
            </Route>
          </Route>

          {/* Fallback Route */}
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
