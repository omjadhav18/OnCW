import React, { useState, useEffect } from 'react';
import apiInstance from '../../utils/axios';
import axiosInstance from '../../utils/useAxios';
import apiInstanceAuth from '../../utils/axiosall';
import { useNavigate, Link } from "react-router-dom";

function StudentProfile() {
  const [username, setUsername] = useState('');
  const navigate=useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');


  const [rollNo, setRollNo] = useState('');
  const [crn, setCrn] = useState('');
  const [department, setDepartment] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [division, setDivision] = useState('');
  

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {

        const response = await apiInstanceAuth.get('profile/student/')
        console.log(response.data)
        const studentData=response.data
        

        const userResponse = await apiInstanceAuth.get(`user/retrieve/`)
        const userData=userResponse.data
        console.log(userData)

        setUsername(userData.username);
        setEmail(userData.email);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setRollNo(studentData.roll_no);
        setCrn(studentData.CRN);
        setDepartment(studentData.department);
        setStudentClass(studentData.student_class);
        setDivision(studentData.division);
        setIsLoading(false);

      } catch (err) {
        setError('Failed to fetch student data');
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Clear any previous messages
    setSuccessMessage('');
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userResponse = await apiInstanceAuth.get(`user/retrieve/`)
      const formdata = new FormData()
      formdata.append("email",email)
      formdata.append("First_name",firstName)
      formdata.append("Last_name",lastName)
      const res = await apiInstanceAuth.patch(`user/retrieve/`,formdata)
      console.log(res.data)
    
      const studdata = new FormData()
      studdata.append("roll_no",rollNo)
      studdata.append("CRN",crn)
      studdata.append("department",department)  
      studdata.append("student_class",studentClass)
      studdata.append("division",division)

      const resp = await apiInstanceAuth.patch('profile/student/',studdata)
      navigate("/profile-student")
      
    } catch (err) {
      setError('Failed to update profile');
      setIsLoading(false);
    }
  };

  if (isLoading && !isEditing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Student Profile</h1>
              <button
                onClick={toggleEditMode}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isEditing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Success or Error Messages */}
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
              <p>{successMessage}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p>{error}</p>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* User Information Section */}
                  <div className="col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
                  </div>
                  
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Student Information Section */}
                  <div className="col-span-2 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h2>
                  </div>
                  
                  <div>
                    <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      id="rollNo"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="crn" className="block text-sm font-medium text-gray-700">
                      CRN
                    </label>
                    <input
                      type="text"
                      id="crn"
                      value={crn}
                      onChange={(e) => setCrn(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700">
                      Class
                    </label>
                    <input
                      type="text"
                      id="studentClass"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                      Division
                    </label>
                    <input
                      type="text"
                      id="division"
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* User Information Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Username</p>
                      <p className="mt-1 text-sm text-gray-900">{username}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-sm text-gray-900">{email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">First Name</p>
                      <p className="mt-1 text-sm text-gray-900">{firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Name</p>
                      <p className="mt-1 text-sm text-gray-900">{lastName}</p>
                    </div>
                  </div>
                </div>
                
                {/* Student Information Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Roll Number</p>
                      <p className="mt-1 text-sm text-gray-900">{rollNo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">CRN</p>
                      <p className="mt-1 text-sm text-gray-900">{crn}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Department</p>
                      <p className="mt-1 text-sm text-gray-900">{department}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Class</p>
                      <p className="mt-1 text-sm text-gray-900">{studentClass}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Division</p>
                      <p className="mt-1 text-sm text-gray-900">{division}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;