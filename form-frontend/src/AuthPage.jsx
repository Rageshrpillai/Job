import React, { useState } from "react";
import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";

function AuthPage({ onAuthSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);

  // This function is called from UserRegister upon successful registration
  const handleRegisterSuccess = () => {
    // Switch to the login view after a successful registration
    setIsLoginView(true);
  };

  return (
    // **MODIFIED**: This container now centers the form on the page with a background color
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-200 px-4 py-8">
      <div className="w-full max-w-4xl">
        {isLoginView ? (
          <UserLogin onLogin={onAuthSuccess} />
        ) : (
          <UserRegister onRegisterSuccess={handleRegisterSuccess} />
        )}
      </div>
      <div className="text-center mt-6">
        <button
          onClick={() => setIsLoginView(!isLoginView)}
          className="text-sm font-semibold text-indigo-600 hover:underline"
        >
          {isLoginView
            ? "Need an account? Register here"
            : "Already have an account? Login here"}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
