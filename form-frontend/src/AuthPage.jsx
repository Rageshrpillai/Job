// form-frontend/src/AuthPage.jsx
import React, { useState } from "react";
import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";

function AuthPage({ onAuthSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true); // State to toggle between Login and Register forms for users

  return (
    // This container will center the form on the page
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        {isLoginView ? (
          <UserLogin onLogin={onAuthSuccess} />
        ) : (
          <UserRegister onRegisterSuccess={() => setIsLoginView(true)} />
        )}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            {isLoginView
              ? "Need an account? Register here"
              : "Already have an account? Login here"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
