import React from "react";

function UserDashboard({ user, onLogout }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome, {user.name}!
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Your account status is:
          <span
            className={`ml-2 font-semibold ${
              user.status === "active" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {user.status.replace("_", " ")}
          </span>
        </p>
        <button
          onClick={onLogout}
          className="mt-8 px-6 py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
