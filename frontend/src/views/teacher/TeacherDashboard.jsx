import React, { useEffect, useState } from 'react';
import TeacherLeftSidebar from '../plugins/TeacherLeftSidebar';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, Users, BarChart2, ChevronRight, CheckCheck, X, FileText } from 'lucide-react';
import apiInstanceAuth from '../../utils/axiosall';

const TeacherDashboard = () => {
  const [userData, setUserData] = useState({
    name: '',
    department: '',
    roles: {
      isTeacher: true,
      isCC: false,
      isHOD: false
    },
    teacherDetails: {
      qualification: '',
      subject: '',
      teacher_id: '',
      teacher_role: ''
    }
  });
  
  const [leaveStats, setLeaveStats] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
    total: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [attendanceAlerts, setAttendanceAlerts] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [leaveDates, setLeaveDates] = useState([]);
  
  // Calendar related states
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  // Fetch user profile data and notifications
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch basic user info
        const userResponse = await apiInstanceAuth.get('user/retrieve/');
        
        // Fetch teacher profile details
        const teacherProfileResponse = await apiInstanceAuth.get('user/teacher/profile/');
        
        // Fetch leave statistics
        const leaveStatsResponse = await apiInstanceAuth.get('leave-applications/statistics/');
        
        // Fetch notifications
        const notificationsResponse = await apiInstanceAuth.get('notify/teacher-also-seen/');
        
        // Update user data state
        setUserData({
          name: userResponse.data.username || 'Teacher',
          email: userResponse.data.email,
          department: teacherProfileResponse.data.subject || 'Department',
          roles: {
            isTeacher: true,
            isCC: teacherProfileResponse.data.teacher_role === 'co-ordinator',
            isHOD: teacherProfileResponse.data.teacher_role === 'hod'
          },
          teacherDetails: {
            qualification: teacherProfileResponse.data.qualification,
            subject: teacherProfileResponse.data.subject,
            teacher_id: teacherProfileResponse.data.teacher_id,
            teacher_role: teacherProfileResponse.data.teacher_role
          }
        });
        
        // Update leave statistics
        if (leaveStatsResponse.data && leaveStatsResponse.data.length > 0) {
          const stats = leaveStatsResponse.data[0];
          setLeaveStats({
            total: stats.total_leaves || 0,
            approved: stats.approved_leaves || 0,
            pending: stats.pending_leaves || 0,
            rejected: stats.rejected_leaves || 0
          });
          
          // Use pending count for dashboard indicators
          setPendingApprovals(stats.pending_leaves || 0);
        }
        
        // Process notifications
        if (notificationsResponse.data && notificationsResponse.data.length > 0) {
          setNotifications(notificationsResponse.data);
          
          // Process leave dates for calendar
          
          const leaveData = [];
          notificationsResponse.data.forEach(notification => {
            if (notification.from_date && notification.to_date) {
              const startDate = new Date(notification.from_date + 'T00:00:00');
              const endDate = new Date(notification.to_date + 'T00:00:00');
              
              // Add each day in the leave period
              const currentDate = new Date(startDate);
              while (currentDate <= endDate) {
                leaveData.push({
                  date: new Date(currentDate),
                  message: notification.message,
                  status: notification.message.includes('approved') ? 'approved' : 
                          notification.message.includes('rejected') ? 'rejected' : 'pending'
                });
                currentDate.setDate(currentDate.getDate() + 1);
              }
            }
          });
          setLeaveDates(leaveData);
          
          // Fix for recent activity - display all leave-related notifications
          // instead of just filtering by date
          const currentDate = new Date();
          
          // Get all leave-related notifications
          const recentLeaves = notificationsResponse.data.filter(notification => 
            notification.from_date && notification.to_date
          );
          
          // Sort by creation date to show most recent first
          recentLeaves.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          
          setRecentActivity(recentLeaves);
        }
        
        // Check for events on the selected date
        checkSelectedDateEvents(selectedDate, leaveDates);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Check for events on selected date when date changes
  useEffect(() => {
    checkSelectedDateEvents(selectedDate, leaveDates);
  }, [selectedDate, leaveDates]);

  // Function to check if selected date has events
  const checkSelectedDateEvents = (date, leaveData) => {
    if (!leaveData || leaveData.length === 0) return;
    
    const selectedDateStr = date.toISOString().split('T')[0];
    const events = leaveData.filter(leave => {
      const leaveDate = leave.date.toISOString().split('T')[0];
      return leaveDate === selectedDateStr;
    });
    
    setSelectedDateEvents(events);
  };

  // Get status color based on type
  const getStatusColor = (type) => {
    switch (type) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      case 'cancellation':
        return 'text-gray-500';
      default:
        return 'text-blue-500';
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-blue-500" />;
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Fix the duplicate key issue by adding indices to day names
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };
  
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };
  
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };
  
  const hasLeave = (date) => {
    if (!date || !leaveDates || leaveDates.length === 0) return false;
    
    const dateStr = date.toISOString().split('T')[0];
    return leaveDates.some(leave => {
      const leaveDate = leave.date.toISOString().split('T')[0];
      return leaveDate === dateStr;
    });
  };
  
  const getLeaveStatusOnDate = (date) => {
    if (!date || !leaveDates || leaveDates.length === 0) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const matchingLeave = leaveDates.find(leave => {
      const leaveDate = leave.date.toISOString().split('T')[0];
      return leaveDate === dateStr;
    });
    
    return matchingLeave?.status || null;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <TeacherLeftSidebar userRole={userData.roles} />
        <div className="ml-64 flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherLeftSidebar userRole={userData.roles} />
      
      <div className="ml-64 flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {userData.name}</h1>
            <p className="text-gray-600">{userData.department}</p>
            <p className="text-gray-500 text-sm">ID: {userData.teacherDetails.teacher_id}</p>
            
            {/* Role badges */}
            <div className="flex space-x-2 mt-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">Teacher</span>
              {userData.roles.isCC && (
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Class Coordinator</span>
              )}
              {userData.roles.isHOD && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">HOD</span>
              )}
            </div>
          </div>
          
          {/* Leave Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard 
              title="Total Leaves" 
              count={leaveStats.total}
              icon={<FileText className="text-indigo-600" />}
              color="indigo"
            />
            
            <StatsCard 
              title="Approved Leaves" 
              count={leaveStats.approved}
              icon={<CheckCheck className="text-green-600" />}
              color="green"
            />
            
            <StatsCard 
              title="Pending Leaves" 
              count={leaveStats.pending}
              icon={<Clock className="text-yellow-600" />}
              color="yellow"
            />
            
            <StatsCard 
              title="Rejected Leaves" 
              count={leaveStats.rejected}
              icon={<X className="text-red-600" />}
              color="red"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity - Using notifications API data */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <Link to="/activity" text="View All" />
              </div>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={`activity-${activity.id || index}`} className="flex items-start p-3 hover:bg-gray-50 rounded-md transition-colors">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        activity.message.includes('approved') ? 'bg-green-500' : 
                        activity.message.includes('rejected') ? 'bg-red-500' : 'bg-yellow-500'
                      } mr-3`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{activity.message}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500 mr-3">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {activity.from_date} to {activity.to_date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500">No recent activity to display</p>
                </div>
              )}
            </div>
            
            {/* Stats & Analytics with Donut Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Leave Statistics</h2>
                {userData.roles.isHOD && <Link to="/analytics" text="Analytics" />}
              </div>
              
              {/* Leave Stats Donut Chart */}
              <div className="my-4 relative">
                <div className="flex justify-center">
                  <DonutChart 
                    approved={leaveStats.approved}
                    pending={leaveStats.pending}
                    rejected={leaveStats.rejected}
                    total={leaveStats.total}
                  />
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
                    <span className="text-sm text-gray-700">Approved</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></div>
                    <span className="text-sm text-gray-700">Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>
                    <span className="text-sm text-gray-700">Rejected</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-green-600">{leaveStats.approved}</span>
                  <span className="text-sm text-gray-600">Approved</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-yellow-600">{leaveStats.pending}</span>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-red-600">{leaveStats.rejected}</span>
                  <span className="text-sm text-gray-600">Rejected</span>
                </div>
              </div>
              
              {userData.roles.isHOD ? (
                <button className="w-full text-center text-sm text-indigo-600 font-medium hover:text-indigo-800 mt-4">
                  View Detailed Analytics
                </button>
              ) : (
                <p className="text-xs text-gray-500 text-center mt-4">Total leaves: {leaveStats.total}</p>
              )}
            </div>
            
            {/* Calendar Component - With leave indicators */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">Leave Calendar</h2>
                <Link to="/calendar" text="Full View" icon={<Calendar size={16} />} />
              </div>
              
              <div className="flex flex-wrap">
                {/* Calendar side - with leave indicators */}
                <div className="w-full md:w-1/2 pr-0 md:pr-4">
                  {/* Calendar header with month navigation */}
                  <div className="flex items-center justify-between mb-2">
                    <button 
                      onClick={prevMonth} 
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    
                    <h3 className="text-sm font-medium text-gray-700">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    
                    <button 
                      onClick={nextMonth} 
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Calendar days header - Fixed with unique keys */}
                  <div className="grid grid-cols-7 gap-0">
                    {dayNames.map((day, index) => (
                      <div key={`day-${index}`} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar days grid - with leave indicators */}
                  <div className="grid grid-cols-7 gap-0">
                    {getDaysInMonth(currentMonth).map((day, index) => {
                      const leaveStatus = day ? getLeaveStatusOnDate(day) : null;
                      
                      return (
                        <div 
                          key={`date-${index}`}
                          className={`
                            h-8 flex items-center justify-center text-xs relative
                            ${!day ? 'text-gray-300' : 'hover:bg-gray-100 cursor-pointer'}
                            ${isToday(day) ? 'bg-indigo-50 text-indigo-600 font-medium' : ''}
                            ${isSelected(day) ? 'bg-indigo-100 text-indigo-700 font-medium' : ''}
                          `}
                          onClick={() => day && setSelectedDate(day)}
                        >
                          {day ? day.getDate() : ''}
                          
                          {/* Leave indicator dot */}
                          {day && hasLeave(day) && (
                            <div 
                              className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full
                                ${leaveStatus === 'approved' ? 'bg-green-500' : 
                                  leaveStatus === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}
                            ></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Legend - updated for different leave types */}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-xs text-gray-600">Approved Leave</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                      <span className="text-xs text-gray-600">Pending Leave</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      <span className="text-xs text-gray-600">Rejected Leave</span>
                    </div>
                  </div>
                </div>
                
                {/* Selected date information side */}
                <div className="w-full md:w-1/2 mt-4 md:mt-0">
                  <div className="border border-gray-200 rounded-md p-3 h-full">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Selected Date Details
                    </h4>
                    
                    {selectedDate && (
                      <div>
                        <p className="text-sm font-medium text-indigo-600 mb-2">
                          {selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        
                        {/* Show events on selected date */}
                        {selectedDateEvents.length > 0 ? (
                          <div className="space-y-2">
                            {selectedDateEvents.map((event, index) => (
                              <div key={`event-${index}`} className="flex items-start text-xs">
                                <div className={`w-2 h-2 rounded-full mt-1 mr-2
                                  ${event.status === 'approved' ? 'bg-green-500' : 
                                    event.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                ></div>
                                <span className="text-gray-800">{event.message}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center text-xs">
                              <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                              <span className="text-gray-800">No scheduled leaves</span>
                            </div>
                            
                            <p className="text-xs text-gray-500">
                              Click on a date to view leave details. You can request a new leave from the Leave Applications page.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Donut Chart Component
const DonutChart = ({ approved, pending, rejected, total }) => {
  // Default values if total is 0 to show empty chart with segments
  const approvedPercentage = total > 0 ? (approved / total) * 100 : 33.33;
  const pendingPercentage = total > 0 ? (pending / total) * 100 : 33.33;
  const rejectedPercentage = total > 0 ? (rejected / total) * 100 : 33.34;
  
  // Calculate the SVG circle parameters
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const centerX = 70;
  const centerY = 70;
  
  // Calculate stroke-dasharray and stroke-dashoffset for each segment
  const approvedDash = (approvedPercentage / 100) * circumference;
  const pendingDash = (pendingPercentage / 100) * circumference;
  const rejectedDash = (rejectedPercentage / 100) * circumference;
  
  // Calculate stroke-dashoffset for each segment
  const approvedOffset = 0;
  const pendingOffset = approvedDash;
  const rejectedOffset = approvedDash + pendingDash;
  
  return (
    <div className="relative inline-block" style={{ width: '140px', height: '140px' }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Green segment (Approved) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="transparent"
          stroke="#10B981" // green
          strokeWidth="12"
          strokeDasharray={`${approvedDash} ${circumference - approvedDash}`}
          strokeDashoffset={approvedOffset}
          transform="rotate(-90 70 70)"
        />
        
        {/* Yellow segment (Pending) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="transparent"
          stroke="#F59E0B" // yellow
          strokeWidth="12"
          strokeDasharray={`${pendingDash} ${circumference - pendingDash}`}
          strokeDashoffset={-pendingOffset}
          transform="rotate(-90 70 70)"
        />
        
        {/* Red segment (Rejected) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="transparent"
          stroke="#EF4444" // red
          strokeWidth="12"
          strokeDasharray={`${rejectedDash} ${circumference - rejectedDash}`}
          strokeDashoffset={-rejectedOffset}
          transform="rotate(-90 70 70)"
        />
        
        {/* Inner white circle (creates donut hole) */}
        <circle
          cx={centerX}
          cy={centerY}
          r="40"
          fill="white"
        />
      </svg>
      
      {/* Total count in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-800">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};

// Stats Card component
const StatsCard = ({ title, count, icon, color }) => {
  const bgColor = `bg-${color}-50`;
  const textColor = `text-${color}-600`;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-700 font-medium">{title}</h3>
          <p className={`text-2xl font-bold ${textColor} mt-1`}>{count}</p>
        </div>
        <div className={`p-3 ${bgColor} rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Helper Link component
const Link = ({ to, text, icon }) => {
  return (
    <a href={to} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
      {text}
      {icon || <ChevronRight size={16} className="ml-1" />}
    </a>
  );
};

export default TeacherDashboard;