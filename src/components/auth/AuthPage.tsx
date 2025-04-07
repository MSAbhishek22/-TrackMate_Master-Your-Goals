
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Hero section */}
      <div className="md:w-1/2 bg-gradient-to-br from-masterplan-purple to-masterplan-teal p-8 flex flex-col justify-center text-white">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Master Your Goals</h1>
          <p className="text-xl mb-8">
            Set goals, track progress, and stay accountable. Achieve more, procrastinate less, together.
          </p>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Set Clear Goals</h3>
                <p className="text-white/80">Break down big goals into manageable steps</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Track Progress</h3>
                <p className="text-white/80">Visualize your journey with intuitive progress tracking</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Stay Accountable</h3>
                <p className="text-white/80">Share goals with friends to keep each other motivated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth forms */}
      <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <RegisterForm onToggleForm={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
