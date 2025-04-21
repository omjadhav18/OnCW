import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../../store/auth";
import  apiInstanceAuth  from '../../utils/axiosall';
import { GraduationCap, School } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check if user is not logged in, redirect to login page
    if (!isLoggedIn()) {
      navigate("/login");
    } else {
      // Fetch user data
      fetchUserData();
    }
  }, []); //isLoggedIn,navigate
  
  const fetchUserData = async () => {
    try {
      const response = await apiInstanceAuth.get('user/retrieve/');
      setUserData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data. Please try again.');
      setLoading(false);
    }
  };
  
  const navigateToDashboard = (role) => {
    if (role === 'student') {
      navigate('/student-dash');
    } else if (role === 'teacher') {
      navigate('/teacher-dash');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button 
            onClick={() => fetchUserData()} 
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Welcome to EduLeave</h1>
          <p className="text-xl text-gray-600">Your Educational Leave Management System</p>
        </div>
        
        {userData && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {userData.username ? userData.username.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Welcome, {userData.username || "User"}
                  </h2>
                  <p className="text-gray-600">{userData.email}</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Important:</strong> Please update your profile after going to your dashboard. If you haven't updated your profile, your operations done on the dashboard may not be considered.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  You are logged in as a{userData.role === 'student' ? ' Student' : ' Teacher'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {userData.role === 'student' 
                    ? 'As a student, you can apply for leave, check your leave history, and manage your profile.' 
                    : 'As a teacher, you can review leave applications, manage students, and view reports.'}
                </p>
              </div>
              
              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                {userData.role === 'student' && (
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-center mb-4">
                        <GraduationCap size={48} className="text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Student Dashboard</h3>
                      <p className="text-gray-600 text-center mb-4">Access your student dashboard to manage leave applications and view your academic information.</p>
                      <button
                        onClick={() => navigateToDashboard('student')}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Go to Student Dashboard
                      </button>
                    </div>
                  </div>
                )}
                
                {userData.role === 'teacher' && (
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-center mb-4">
                        <School size={48} className="text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Teacher Dashboard</h3>
                      <p className="text-gray-600 text-center mb-4">Access your teacher dashboard to manage student leave requests and department information.</p>
                      <button
                        onClick={() => navigateToDashboard('teacher')}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Go to Teacher Dashboard
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-center text-gray-900 mb-2">About EduLeave</h3>
                    <p className="text-gray-600 text-center mb-4">
                      EduLeave is a comprehensive leave management system designed specifically for educational institutions. It streamlines the process of applying for, approving, and tracking leave requests.
                    </p>
                    <div className="text-center">
                      <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;