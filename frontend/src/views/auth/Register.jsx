import React, { useState, useEffect } from 'react';
import { register, setUser } from '../../utils/auth';
import { useNavigate, Link } from "react-router-dom";
import apiInstance from "../../utils/axios";



function Register() {
  // Basic user information
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [role, setRole] = useState('student'); 
  const navigate = useNavigate();

  
  // Teacher/Principal specific fields
  const [teacherId, setTeacherId] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [teacherRole, setTeacherRole] = useState('Teacher');
  
  // UI states
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoleFields, setShowRoleFields] = useState(false);

  // Update additional fields visibility when role changes
  useEffect(() => {
    setShowRoleFields(role === 'teacher' || role === 'principal');
    
    // If role is principal, set teacherRole to Principal
    if (role === 'principal') {
      setTeacherRole('Principal');
    } else if (role === 'teacher') {
      setTeacherRole('Teacher');
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }
    
    if (password !== password2) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if ((role === 'teacher' || role === 'principal') && (!teacherId || !qualifications)) {
      setError('Please fill in all teacher information');
      setIsSubmitting(false);
      return;
    }

    
    // Add teacher/principal specific fields if applicable
    // if (role === 'teacher' || role === 'principal') {
    //   user = {
    //     ...user,
    //     teacher_id: teacherId,
    //     qualifications,
    //     teacher_role: teacherRole
    //   };
    // }
    const { error } = await register(
      username,
      email,
      password,
      password2,
      role
    );
    if (error) {
      alert(JSON.stringify(error));
    } else {
      if(role=='teacher' || role=='principal'){
        try {
          const formdata = new FormData()
          formdata.append("username",username)
          formdata.append("teacher_id",teacherId)
          formdata.append("qualification",qualifications)
          const response=await apiInstance.post(`user/teacher/`,formdata)
          console.log(response)
        } catch (error) {
          alert(error);
        }
      }
      navigate("/");
    }
    resetForm();
    
    setIsSubmitting(false);
  };
  
  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setPassword2('');
    setRole('student');
    setTeacherId('');
    setQualifications('');
    setTeacherRole('Teacher');
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
          <p className="mt-2 text-sm text-gray-600">Sign up to get started</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Username *
              </label>
              <input
                id="name"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Create a password"
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
                required
              />
            </div>
            
            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="principal">Principal</option>
              </select>
            </div>
            
            {/* Conditional Teacher/Principal Fields */}
            {showRoleFields && (
              <div className="p-4 mt-4 space-y-4 border border-gray-200 rounded-md bg-gray-50">
                <h3 className="text-lg font-medium text-gray-700">
                  {role === 'principal' ? 'Principal' : 'Teacher'} Information
                </h3>
                
                {/* Teacher ID Field */}
                <div>
                  <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">
                    {role === 'principal' ? 'Principal' : 'Teacher'} ID *
                  </label>
                  <input
                    id="teacherId"
                    type="text"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter your ${role === 'principal' ? 'principal' : 'teacher'} ID`}
                    required
                  />
                </div>
                
                {/* Qualifications Field */}
                <div>
                  <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
                    Qualifications *
                  </label>
                  <textarea
                    id="qualifications"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your qualifications"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Registering...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to={'/login'}   className="font-medium text-blue-600 hover:text-blue-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;