import React, { useState, useEffect } from 'react';
import LeftSidebar from '../plugins/LeftSidebar';
import { Calendar as CalendarIcon, Clock, FileText, AlertCircle } from 'lucide-react';
import  apiInstanceAuth  from '../../utils/axiosall';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [userData,setUserData] = useState(null);
  const [leaveStats, setLeaveStats] = useState({
    total_leaves: 0,
    approved_leaves: 0,
    rejected_leaves: 0,
    pending_leaves: 0
  });
  const [notifications, setNotifications] = useState();
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {

        const UserResponse = await apiInstanceAuth.get('user/retrieve/')
        setUserData(UserResponse.data)
        console.log(UserResponse.data)
        // Fetch student profile data
        const profileResponse = await apiInstanceAuth.get('profile/student/');
        setStudentData(profileResponse.data);
        console.log(profileResponse.data)

        // Fetch leave stats
        const leaveStatsResponse = await apiInstanceAuth.get('student/total-leave-stats/');
        setLeaveStats(leaveStatsResponse.data[0]);

        // Fetch notifications
        const notificationsResponse = await apiInstanceAuth.get('notify/total-count-notification/');
        // console.log(notificationsResponse.data)
        setNotifications(notificationsResponse.data.total_notifications);

        // Fetch leave history
        const leaveHistoryResponse = await apiInstanceAuth.get('notify/recent/stud-leave/history/');
        setLeaveHistory(leaveHistoryResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStudentName = () => {
    if (!studentData) return "Student";
    return `${userData.username}`;
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Fixed LeftSidebar is now outside the flex container */}
      <LeftSidebar />
      
      {/* Main content with appropriate margin/padding to account for fixed sidebar */}
      <div className="flex-1 ml-64 p-6"> {/* Added ml-64 to accommodate fixed sidebar width */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {getStudentName()}</p>
          {studentData && (
            <p className="text-gray-500">
              {studentData.department.name} | Division: {studentData.division} | Roll No: {studentData.roll_no}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <DashboardCard 
            title="Total Leaves" 
            value={`${leaveStats.total_leaves} `} 
            icon={<Clock size={24} className="text-indigo-600" />} 
          />
          <DashboardCard 
            title="Pending Requests" 
            value={leaveStats.pending_leaves} 
            icon={<FileText size={24} className="text-yellow-500" />} 
          />
          <DashboardCard 
            title="Approved Leaves" 
            value={leaveStats.approved_leaves} 
            icon={<FileText size={24} className="text-green-500" />}
          />
          <DashboardCard 
            title="Notifications" 
            value={notifications} 
            icon={<AlertCircle size={24} className="text-red-500" />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Leave Requests</h2>
              {loading ? (
                <p className="text-center text-gray-500">Loading leave requests...</p>
              ) : leaveHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {leaveHistory.map((leave) => {
                        const startDate = new Date(leave.from_date);
                        const endDate = new Date(leave.to_date);
                        const diffTime = Math.abs(endDate - startDate);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                        
                        return (
                          <LeaveRequestRow 
                            key={leave.id}
                            type={leave.activity_name} 
                            from={new Date(leave.from_date).toLocaleDateString()} 
                            to={new Date(leave.to_date).toLocaleDateString()} 
                            days={diffDays} 
                            status={leave.status} 
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500">No leave requests found</p>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Leave Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <PieChartDisplay 
                    approved={leaveStats.approved_leaves}
                    rejected={leaveStats.rejected_leaves}
                    pending={leaveStats.pending_leaves}
                  />
                </div>
                <div className="flex items-center">
                  <div className="space-y-2 w-full">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                      <span>Approved: {leaveStats.approved_leaves}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                      <span>Rejected: {leaveStats.rejected_leaves}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                      <span>Pending: {leaveStats.pending_leaves}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-indigo-600 rounded mr-2"></div>
                      <span>Total: {leaveStats.total_leaves}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Leave Calendar</h2>
              <div className="border rounded-md p-2 flex flex-col">
                <CalendarComponent 
                  currentMonth={currentMonth} 
                  setCurrentMonth={setCurrentMonth} 
                  leaveHistory={leaveHistory}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Leave Usage</h2>
              <div className="space-y-4">
                <LeaveProgressBar 
                  label="Approved Leaves" 
                  used={leaveStats.approved_leaves} 
                  total={leaveStats.total_leaves || 1} 
                  color="bg-green-500" 
                />
                <LeaveProgressBar 
                  label="Rejected Leaves" 
                  used={leaveStats.rejected_leaves} 
                  total={leaveStats.total_leaves || 1} 
                  color="bg-red-500" 
                />
                <LeaveProgressBar 
                  label="Pending Leaves" 
                  used={leaveStats.pending_leaves} 
                  total={leaveStats.total_leaves || 1} 
                  color="bg-yellow-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

const LeaveRequestRow = ({ type, from, to, days, status }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <tr>
      <td className="px-4 py-3">{type}</td>
      <td className="px-4 py-3">{from}</td>
      <td className="px-4 py-3">{to}</td>
      <td className="px-4 py-3">{days}</td>
      <td className="px-4 py-3">{getStatusBadge(status)}</td>
    </tr>
  );
};

const LeaveProgressBar = ({ label, used, total, color }) => {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm text-gray-700">{used}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${color} h-2.5 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Actual SVG Pie Chart Component
const PieChartDisplay = ({ approved, rejected, pending }) => {
  const total = approved + rejected + pending;
  
  // If no leaves, show empty chart
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center text-gray-500">
          <p>No leave data available</p>
        </div>
      </div>
    );
  }
  
  // Calculate percentages and angles for the pie chart
  const approvedPercentage = (approved / total) * 100;
  const rejectedPercentage = (rejected / total) * 100;
  const pendingPercentage = (pending / total) * 100;
  
  // Calculate angles for SVG arc
  const approvedAngle = (approved / total) * 360;
  const rejectedAngle = (rejected / total) * 360;
  const pendingAngle = (pending / total) * 360;
  
  // Create SVG path for each section
  let startAngle = 0;
  
  // Function to create SVG arc path
  const createArc = (startAngle, endAngle, color) => {
    const r = 60; // radius
    const cx = 80; // center x
    const cy = 80; // center y
    
    // Convert angles to radians
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    // Calculate start and end points
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    
    // Determine if the arc should be drawn as the large arc
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    // Create the path
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    
    return <path d={path} fill={color} />;
  };
  
  // Create arcs for each status
  let currentAngle = 0;
  const approvedArc = approved > 0 ? createArc(currentAngle, currentAngle + approvedAngle, "#10B981") : null; // Green
  currentAngle += approvedAngle;
  
  const rejectedArc = rejected > 0 ? createArc(currentAngle, currentAngle + rejectedAngle, "#EF4444") : null; // Red
  currentAngle += rejectedAngle;
  
  const pendingArc = pending > 0 ? createArc(currentAngle, currentAngle + pendingAngle, "#F59E0B") : null; // Yellow
  
  return (
    <div className="flex items-center justify-center h-48">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {approvedArc}
        {rejectedArc}
        {pendingArc}
        {/* Center circle with transparent fill */}
        <circle cx="80" cy="80" r="40" fill="white" />
      </svg>
    </div>
  );
};

// Calendar Component
const CalendarComponent = ({ currentMonth, setCurrentMonth, leaveHistory }) => {
  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week for first day of month (0-6, 0 is Sunday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Create array of blank spaces for days before first day of month
  const blanks = Array(firstDayOfMonth).fill(null);
  
  // Create array of days in month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Combine blanks and days
  const calendarDays = [...blanks, ...days];
  
  // Go to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  
  // Go to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };
  
  // Format leave dates for highlighting on calendar
  const formatLeaveDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };
  
  // Get leave dates
  const leaveDates = {};
  leaveHistory.forEach(leave => {
    const fromDate = new Date(leave.from_date);
    const toDate = new Date(leave.to_date);
    
    // Loop through all dates between from and to
    const currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
      leaveDates[dateKey] = leave.status;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
  
  // Check if a day has a leave request
  const hasLeave = (day) => {
    if (!day) return null;
    const dateKey = `${year}-${month}-${day}`;
    return leaveDates[dateKey];
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-300';
      case 'pending':
        return 'bg-yellow-300';
      case 'rejected':
        return 'bg-red-300';
      default:
        return '';
    }
  };
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={prevMonth}
          className="p-1 text-gray-600 hover:text-indigo-600"
        >
          &lt;
        </button>
        <h3 className="font-medium">{monthNames[month]} {year}</h3>
        <button 
          onClick={nextMonth}
          className="p-1 text-gray-600 hover:text-indigo-600"
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        <div className="font-medium text-gray-500">Su</div>
        <div className="font-medium text-gray-500">Mo</div>
        <div className="font-medium text-gray-500">Tu</div>
        <div className="font-medium text-gray-500">We</div>
        <div className="font-medium text-gray-500">Th</div>
        <div className="font-medium text-gray-500">Fr</div>
        <div className="font-medium text-gray-500">Sa</div>
        
        {calendarDays.map((day, index) => {
          const leaveStatus = hasLeave(day);
          const statusColor = getStatusColor(leaveStatus);
          const isToday = day && new Date().getDate() === day && 
                          new Date().getMonth() === month && 
                          new Date().getFullYear() === year;
          
          return (
            <div 
              key={index}
              className={`h-6 w-6 flex items-center justify-center rounded-full text-xs mx-auto
                        ${isToday ? 'bg-indigo-600 text-white' : ''} 
                        ${day ? statusColor : ''}`}
            >
              {day || ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;