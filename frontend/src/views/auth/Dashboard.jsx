import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Mock login/logout functions (you'll replace these with actual authentication)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">SchoolDash</span>
              </div>
            </div>
            <div className="flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to={'/login'}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to={'/register'}
                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors" 
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-300 rounded-lg h-96 bg-white p-8 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to SchoolDash</h1>
            <p className="text-xl text-gray-600 text-center max-w-lg mb-8">
              The comprehensive management system for students, teachers, and school administrators
            </p>
            <div className="flex space-x-4">
              <Link
                to={'/login'}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login to Continue
              </Link>
              <Link
                to={'/register'}
                className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Student Feature */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">For Students</h3>
              <p className="mt-2 text-sm text-gray-500">
                View class schedules, assignments, and track your academic progress.
              </p>
            </div>
          </div>

          {/* Teacher Feature */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">For Teachers</h3>
              <p className="mt-2 text-sm text-gray-500">
                Manage classes, create assignments, and track student attendance.
              </p>
            </div>
          </div>

          {/* Principal Feature */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">For Principals</h3>
              <p className="mt-2 text-sm text-gray-500">
                Oversee school operations, monitor performance metrics, and manage staff.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-inner mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SchoolDash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;