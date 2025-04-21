import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../utils/useAxios';
import apiInstanceAuth from '../../utils/axiosall';
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import LeftSidebar from '../plugins/LeftSidebar';

const LeaveApplication = () => {
  const [branch, setBranch] = useState('');
  const [shift, setShift] = useState('');
  const [activityName, setActivityName] = useState('');

  const [from, setFrom] = useState();
  const [to, setTo] = useState();

  const [authority, setAuthority] = useState();
  const [classCoordinator, setClassCoordinator] = useState('');
  const [hod, setHod] = useState('');
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

      const userResponse = await apiInstanceAuth.get(`profile/student/`)
      const data = userResponse?.data
      console.log(data)
      setBranch(data.department.name)
      setShift(data.student_class.shift)
      setClassCoordinator(data.student_class.class_coordinator.user.username)
      setHod(data.department.hod.user.username)

      const userinfo = await apiInstanceAuth.get(`user/retrieve/`);
      const userData = userinfo.data;
      const username = userData.username;
      const attendance = await apiInstanceAuth.get(`attend/?username=${username}`);
      const record = attendance.data
      setSubject1(record[0].subject_name);
      setSubject1Attendance(record[0].percentage);
      setSubject2(record[1].subject_name);
      setSubject2Attendance(record[1].percentage);
      setSubject3(record[2].subject_name);
      setSubject3Attendance(record[2].percentage);
      setSubject4(record[3].subject_name);
      setSubject4Attendance(record[3].percentage);
    }

    fetchdata();
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setSubmitError('');

    const formdata = new FormData();
    formdata.append("branch", branch)
    formdata.append("shift", shift)
    formdata.append("activity_name", activityName)
    formdata.append("reason", reason)
    formdata.append("from_date", from)
    formdata.append("to_date", to)
    formdata.append("authority", authority)
    formdata.append("class_coordinator", classCoordinator)
    formdata.append("hod", hod)
    formdata.append("subject1", subject1)
    formdata.append("subject1_attendance", subject1Attendance)
    formdata.append("subject2", subject2)
    formdata.append("subject2_attendance", subject2Attendance)
    formdata.append("subject3", subject3)
    formdata.append("subject3_attendance", subject3Attendance)
    formdata.append("subject4", subject4)
    formdata.append("subject4_attendance", subject4Attendance)

    try {
      const response = await apiInstanceAuth.post('/leave/', formdata);
      if (response.status === 201) {
        setSubmitMessage('Leave application submitted successfully!');
        resetForm();
        navigate("/student-dash")
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
    setFrom();
    setTo();
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

  const renderAttendanceStatus = (percentage) => {
    if (percentage >= 75) {
      return <span className="text-green-600 flex items-center text-sm"><CheckCircle size={16} className="mr-1" /> Good</span>
    } else if (percentage >= 60) {
      return <span className="text-yellow-600 flex items-center text-sm"><AlertCircle size={16} className="mr-1" /> Average</span>
    } else {
      return <span className="text-red-600 flex items-center text-sm"><XCircle size={16} className="mr-1" /> Low</span>
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <LeftSidebar />
      
      <div className={`flex-1 ml-64 p-6`}> {/* Add margin to match sidebar width */}
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-indigo-800">Student Leave Application</h2>

          {submitMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
              <CheckCircle size={20} className="mr-2" />
              {submitMessage}
            </div>
          )}

          {submitError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
              <XCircle size={20} className="mr-2" />
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
                placeholder="Enter activity name"
              />
            </div>

            {/* Time Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* To Date Picker */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leave</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
                placeholder="Please provide detailed reason for your leave application"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Authority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Authority</label>
                <select
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
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
                <input
                  type="text"
                  value={classCoordinator}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              {/* HOD  */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HOD</label>
                <input
                  type="text"
                  value={hod}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">Subject Attendance Information</h3>

              {/* Subject 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject 1</label>
                  <input
                    type="text"
                    value={subject1}
                    onChange={(e) => setSubject1(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
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
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex items-end pb-3">
                  {renderAttendanceStatus(subject1Attendance)}
                </div>
              </div>

              {/* Subject 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject 2</label>
                  <input
                    type="text"
                    value={subject2}
                    onChange={(e) => setSubject2(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
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
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex items-end pb-3">
                  {renderAttendanceStatus(subject2Attendance)}
                </div>
              </div>

              {/* Subject 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject 3</label>
                  <input
                    type="text"
                    value={subject3}
                    onChange={(e) => setSubject3(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
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
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex items-end pb-3">
                  {renderAttendanceStatus(subject3Attendance)}
                </div>
              </div>

              {/* Subject 4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject 4</label>
                  <input
                    type="text"
                    value={subject4}
                    onChange={(e) => setSubject4(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
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
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex items-end pb-3">
                  {renderAttendanceStatus(subject4Attendance)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;