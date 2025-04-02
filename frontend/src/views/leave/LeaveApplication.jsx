import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../utils/useAxios';
import apiInstanceAuth from '../../utils/axiosall';
import { useNavigate, Link } from "react-router-dom";

const LeaveApplication = () => {
  // Individual state hooks for each form field
  const [branch, setBranch] = useState('');
  const [shift, setShift] = useState('');
  const [activityName, setActivityName] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [authority, setAuthority] = useState();
  const [classCoordinator, setClassCoordinator] = useState();
  const [teachers, setTeachers] = useState([]);
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  const [subject1, setSubject1] = useState('');
  const [subject1Attendance, setSubject1Attendance] = useState(0);

  const [subject2, setSubject2] = useState('');
  const [subject2Attendance, setSubject2Attendance] = useState(0);

  const [subject3, setSubject3] = useState('');
  const [subject3Attendance, setSubject3Attendance] = useState(0);

  const [subject4, setSubject4] = useState('');
  const [subject4Attendance, setSubject4Attendance] = useState(0);

  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchdata = async () => {
      const teresponse = await apiInstanceAuth.get('/user/teacher-list')
      setTeachers(teresponse.data)
    }
    fetchdata();
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setSubmitError('');

    const formdata= new FormData();
    formdata.append("branch",branch)
    formdata.append("shift",shift)
    formdata.append("activity_name",activityName)
    formdata.append("reason",reason)
    formdata.append("time_period",timePeriod)
    formdata.append("authority",authority)
    formdata.append("class_coordinator",classCoordinator)
    formdata.append("subject1",subject1)
    formdata.append("subject1_attendance",subject1Attendance)
    formdata.append("subject2",subject2)
    formdata.append("subject2_attendance",subject2Attendance)
    formdata.append("subject3",subject3)
    formdata.append("subject3_attendance",subject3Attendance)
    formdata.append("subject4",subject4)
    formdata.append("subject4_attendance",subject4Attendance)


    try {
      const response = await apiInstanceAuth.post('/leave/', formdata);
      if (response.status === 201) {
        setSubmitMessage('Leave application submitted successfully!');
        resetForm();
        navigate("/")
      }
    } catch (error) {
      setSubmitError('Failed to submit leave application. Please try again.');
      console.error('Error submitting leave application:', error);
    }
  };

  const resetForm = () => {
    setBranch('');
    setShift('');
    setActivityName('');
    setTimePeriod('');
    setAuthority('');
    setClassCoordinator('');
    setSubject1('');
    setSubject1Attendance(0);
    setSubject2('');
    setSubject2Attendance(0);
    setSubject3('');
    setSubject3Attendance(0);
    setSubject4('');
    setSubject4Attendance(0);
  };
  // console.log(teachers)
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Student Leave Application</h2>

      {submitMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {submitMessage}
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Shift */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
            <input
              type="text"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Activity Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name</label>
          <input
            type="text"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Time Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
          <input
            type="text"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 1 day, 3 hours, etc."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leave</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Please provide detailed reason for your leave application"
            required
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Authority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Authority</label>
            <select
              value={authority}
              onChange={(e) => setAuthority(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Authority</option>
              {teachers.map((teacher, index) => (
                <option key={index} value={teacher.username}>
                  {teacher.username}
                </option>
              ))}
            </select>
          </div>

          {/* Class Coordinator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Coordinator</label>
            <select
              value={classCoordinator}
              onChange={(e) => setClassCoordinator(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Coordinator</option>
              {teachers.map((teacher, index) => (
                <option key={index} value={teacher.username}>
                  {teacher.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Subject Attendance Information</h3>

          {/* Subject 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject 1</label>
              <input
                type="text"
                value={subject1}
                onChange={(e) => setSubject1(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendance (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={subject1Attendance}
                onChange={(e) => setSubject1Attendance(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Subject 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject 2</label>
              <input
                type="text"
                value={subject2}
                onChange={(e) => setSubject2(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendance (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={subject2Attendance}
                onChange={(e) => setSubject2Attendance(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Subject 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject 3</label>
              <input
                type="text"
                value={subject3}
                onChange={(e) => setSubject3(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendance (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={subject3Attendance}
                onChange={(e) => setSubject3Attendance(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Subject 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject 4</label>
              <input
                type="text"
                value={subject4}
                onChange={(e) => setSubject4(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendance (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={subject4Attendance}
                onChange={(e) => setSubject4Attendance(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveApplication;