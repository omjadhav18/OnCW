import React, { useState, useEffect } from 'react';
import apiInstance from '../../utils/axios';
import axiosInstance from '../../utils/useAxios';
import apiInstanceAuth from '../../utils/axiosall';
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, BookOpen, Hash, Building, Users, Divide } from 'lucide-react';
import LeftSidebar from '../plugins/LeftSidebar'; // Adjust path as needed

function StudentProfile() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [crn, setCrn] = useState('');
  const [department, setDepartment] = useState({});
  const [studentClass, setStudentClass] = useState({});
  const [division, setDivision] = useState('');
  const [departments, setDepartments] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch departments
    const fetchDepartments = async () => {
      try {
        const response = await apiInstanceAuth.get('dept/');
        setDepartments(response.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    // Fetch student data
    const fetchStudentData = async () => {
      try {
        const response = await apiInstanceAuth.get('profile/student/')
        console.log(response.data)
        const studentData = response.data

        const userResponse = await apiInstanceAuth.get(`user/retrieve/`)
        const userData = userResponse.data
        console.log(userData)

        setUsername(userData?.username);
        setEmail(userData?.email);
        setFirstName(userData?.first_name);
        setLastName(userData?.last_name);
        setRollNo(studentData?.roll_no);
        setCrn(studentData?.CRN);
        
        // Store the entire department object
        setDepartment(studentData?.department || {});
        
        // Store the entire student_class object
        setStudentClass(studentData?.student_class || {});
        
        setDivision(studentData?.division);
        setIsLoading(false);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to fetch student data');
        setIsLoading(false);
      }
    };

    fetchDepartments();
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
      formdata.append("email", email)
      formdata.append("First_name", firstName)
      formdata.append("Last_name", lastName)
      const res = await apiInstanceAuth.patch(`user/retrieve/`, formdata)
      console.log(res.data)

      const studdata = new FormData()
      studdata.append("roll_no", rollNo)
      studdata.append("CRN", crn)
      
      // Use department ID for submission
      studdata.append("department", department.id)

      // Use class ID or appropriate field for submission
      if (studentClass && studentClass.id) {
        studdata.append("student_class", studentClass.id)
      }
      
      studdata.append("division", division)

      const resp = await apiInstanceAuth.patch('profile/student/', studdata)
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);

    } catch (err) {
      console.error("Error updating profile:", err);
      setError('Failed to update profile');
    }
  };

  // Handle department change
  const handleDepartmentChange = (e) => {
    const selectedId = e.target.value;
    const selected = departments.find(dept => dept.id.toString() === selectedId);
    if (selected) {
      setDepartment(selected);
    } else {
      setDepartment({});
    }
  };

  console.log(department)

  // Render the component
  return (
    <div className="flex">
      <LeftSidebar />
      <div className="flex-1 ml-16 md:ml-64 bg-gray-100 min-h-screen">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-indigo-600 font-medium">Loading profile data...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-white">Student Profile</h1>
                  <button
                    onClick={toggleEditMode}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isEditing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-white text-indigo-600 hover:bg-indigo-50'
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
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                          <User size={20} className="mr-2 text-indigo-600" />
                          User Information
                        </h2>
                      </div>

                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          value={username || ""}
                          onChange={(e) => setUsername(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                          value={email || ""}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName || ""}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName || ""}
                          onChange={(e) => setLastName(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      {/* Student Information Section */}
                      <div className="col-span-2 mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                          <BookOpen size={20} className="mr-2 text-indigo-600" />
                          Student Information
                        </h2>
                      </div>

                      <div>
                        <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          id="rollNo"
                          value={rollNo || ""}
                          onChange={(e) => setRollNo(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="crn" className="block text-sm font-medium text-gray-700">
                          CRN
                        </label>
                        <input
                          type="text"
                          id="crn"
                          value={crn || ""}
                          onChange={(e) => setCrn(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <select
                          id="department"
                          value={department?.id || ""}
                          onChange={handleDepartmentChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700">
                          Class
                        </label>
                        <input
                          type="text"
                          id="studentClass"
                          value={studentClass?.name || ""}
                          disabled
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">Class is assigned by the system</p>
                      </div>

                      <div>
                        <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                          Division
                        </label>
                        <input
                          type="text"
                          id="division"
                          value={division || ""}
                          onChange={(e) => setDivision(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    {/* User Information Section */}
                    <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
                      <h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center border-b pb-2 border-gray-200">
                        <User size={20} className="mr-2" />
                        User Information
                      </h2>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <User size={18} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Username</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{username || "Not set"}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Mail size={18} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{email || "Not set"}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <User size={18} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">First Name</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{firstName || "Not set"}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <User size={18} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Last Name</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{lastName || "Not set"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Student Information Section */}
                    <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
                      <h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center border-b pb-2 border-gray-200">
                        <BookOpen size={20} className="mr-2" />
                        Student Information
                      </h2>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Hash size={18} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Roll Number</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{rollNo || "Not set"}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Hash size={18} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">CRN</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{crn || "Not set"}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Building size={18} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Department</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">
                              {department?.name || "Not set"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Users size={18} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Class</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{studentClass?.name || "Not set"}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Divide size={18} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Division</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{division || "Not set"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;