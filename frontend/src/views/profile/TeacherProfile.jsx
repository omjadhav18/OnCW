import React, { useState, useEffect } from 'react';
import apiInstanceAuth from '../../utils/axiosall';
import { useNavigate } from 'react-router-dom';
import TeacherLeftSidebar from '../plugins/TeacherLeftSidebar';

function TeacherProfile() {
  // States for user data
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // States for teacher specific data
  const [teacherId, setTeacherId] = useState('');
  const [subject, setSubject] = useState('');
  const [qualification, setQualification] = useState('');
  const [teacherRole, setTeacherRole] = useState('');

  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch teacher data on component mount
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacherresponse = await apiInstanceAuth.get('user/teacher/profile/')
        console.log(teacherresponse.data)
        const teacherData = teacherresponse.data

        const userresponse = await apiInstanceAuth.get('user/retrieve/')
        console.log(userresponse.data)
        const userData = userresponse.data

        setUsername(userData.username);
        setEmail(userData.email);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setTeacherId(teacherData.teacher_id);
        setSubject(teacherData.subject);
        setQualification(teacherData.qualification);
        setTeacherRole(teacherData.teacher_role);
        setIsLoading(false)

      } catch (err) {
        setError('Failed to fetch teacher data');
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Clear any previous messages
    setSuccessMessage('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formdata = new FormData()
      formdata.append("email", email)
      formdata.append("First_name", firstName)
      formdata.append("Last_name", lastName)
      const res = await apiInstanceAuth.patch(`user/retrieve/`, formdata)
      console.log(res.data)
      // console.log("this is teacherrole",teacherRole)

      const teacherdata = new FormData()
      teacherdata.append("teacher_id", teacherId)
      teacherdata.append("subject", subject)
      teacherdata.append("qualification", qualification)
      teacherdata.append("teacher_role", teacherRole)

      const resp = await apiInstanceAuth.patch('user/teacher/profile/', teacherdata)
      navigate("/teacher-dash")

    } catch (err) {
      setError('Failed to update profile');
      setIsLoading(false);
    }
  };

  if (isLoading && !isEditing) {
    return (
      <div className="flex">
        <TeacherLeftSidebar />
        <div className="flex-1 ml-64">
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">Loading teacher profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <TeacherLeftSidebar />
      <div className="flex-1 ml-64">
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Profile Header */}
              <div className="bg-indigo-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-white">Teacher Profile</h1>
                  <button
                    onClick={toggleEditMode}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${isEditing
                        ? 'bg-gray-200 text-indigo-700 hover:bg-gray-300'
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
                        <h2 className="text-xl font-semibold text-indigo-800 mb-4 border-b border-indigo-100 pb-2">User Information</h2>
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
                          value={email}
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
                          value={firstName}
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
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      {/* Teacher Information Section */}
                      <div className="col-span-2 mt-6">
                        <h2 className="text-xl font-semibold text-indigo-800 mb-4 border-b border-indigo-100 pb-2">Teacher Information</h2>
                      </div>

                      <div>
                        <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">
                          Teacher ID
                        </label>
                        <input
                          type="text"
                          id="teacherId"
                          value={teacherId}
                          onChange={(e) => setTeacherId(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                          Qualification
                        </label>
                        <input
                          type="text"
                          id="qualification"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="teacherRole" className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <select
                          id="teacherRole"
                          value={teacherRole}
                          onChange={(e) => setTeacherRole(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="" disabled>
                            Select Role
                          </option>
                          <option value="co-ordinator">CC</option>
                          <option value="hod">HOD</option>
                          <option value="teacher">Teacher</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                      <h2 className="text-xl font-semibold text-indigo-800 mb-4 border-b border-indigo-100 pb-2">User Information</h2>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Username</p>
                          <p className="mt-1 text-lg text-gray-900">{username}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="mt-1 text-lg text-gray-900">{email}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">First Name</p>
                          <p className="mt-1 text-lg text-gray-900">{firstName}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Last Name</p>
                          <p className="mt-1 text-lg text-gray-900">{lastName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Information Section */}
                    <div>
                      <h2 className="text-xl font-semibold text-indigo-800 mb-4 border-b border-indigo-100 pb-2">Teacher Information</h2>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Teacher ID</p>
                          <p className="mt-1 text-lg text-gray-900">{teacherId}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Subject</p>
                          <p className="mt-1 text-lg text-gray-900">{subject || 'Not specified'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Qualification</p>
                          <p className="mt-1 text-lg text-gray-900">{qualification}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Role</p>
                          <p className="mt-1 text-lg text-gray-900">{teacherRole}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;