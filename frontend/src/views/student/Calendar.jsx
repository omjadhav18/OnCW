import React, { useState } from 'react';
import LeftSidebar from '../plugins/LeftSidebar';
import { Calendar as CalendarIcon, Check, X, Clock } from 'lucide-react';

const Calendar = () => {
  // Current date info
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Sample leave data
  const leaveData = [
    { id: 1, startDate: '2025-04-22', endDate: '2025-04-23', status: 'approved', reason: 'Medical appointment' },
    { id: 2, startDate: '2025-04-28', endDate: '2025-04-30', status: 'pending', reason: 'Family event' },
    { id: 3, startDate: '2025-05-05', endDate: '2025-05-06', status: 'rejected', reason: 'Personal work' },
    { id: 4, startDate: '2025-05-15', endDate: '2025-05-15', status: 'approved', reason: 'Medical emergency' },
  ];
  
  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Month names
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Function to navigate to previous or next month
  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };
  
  // Check if date has a leave event
  const getLeaveStatus = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    for (const leave of leaveData) {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const checkDate = new Date(dateStr);
      
      if (checkDate >= startDate && checkDate <= endDate) {
        return leave.status;
      }
    }
    return null;
  };

  // Handle date selection
  const handleDateClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  // Get leave details for selected date
  const getLeaveDetailsForDate = (dateStr) => {
    return leaveData.filter(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const checkDate = new Date(dateStr);
      
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <LeftSidebar />
      
      <div className="ml-64 flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <CalendarIcon className="mr-2 text-indigo-600" /> Leave Calendar
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Approved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Rejected</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => changeMonth(-1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                &lt; Prev
              </button>
              
              <h2 className="text-xl font-semibold text-indigo-600">
                {monthNames[month]} {year}
              </h2>
              
              <button 
                onClick={() => changeMonth(1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Next &gt;
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {/* Day names */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={`header-${index}`} className="text-center py-2 font-medium text-gray-600">
                  {day}
                </div>
              ))}
              
              {/* Empty cells for days before start of month */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-start-${index}`} className="h-16 bg-gray-50 border border-gray-100"></div>
              ))}
              
              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const status = getLeaveStatus(day);
                
                return (
                  <div 
                    key={`day-${day}`} 
                    onClick={() => handleDateClick(day)}
                    className={`h-16 p-1 border border-gray-100 relative cursor-pointer hover:bg-indigo-50 ${
                      selectedDate === dateStr ? 'ring-2 ring-indigo-600' : ''
                    }`}
                  >
                    <div className="font-medium">{day}</div>
                    
                    {status && (
                      <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ${
                        status === 'approved' ? 'bg-green-500' :
                        status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Empty cells for days after end of month */}
              {Array.from({ length: (42 - daysInMonth - firstDayOfMonth) % 7 }).map((_, index) => (
                <div key={`empty-end-${index}`} className="h-16 bg-gray-50 border border-gray-100"></div>
              ))}
            </div>
          </div>
          
          {/* Leave details panel */}
          {selectedDate && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Leave Details for {selectedDate}</h3>
              
              {getLeaveDetailsForDate(selectedDate).length > 0 ? (
                getLeaveDetailsForDate(selectedDate).map(leave => (
                  <div 
                    key={leave.id}
                    className={`mb-4 p-4 rounded-md ${
                      leave.status === 'approved' ? 'bg-green-50 border-l-4 border-green-500' :
                      leave.status === 'pending' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 
                      'bg-red-50 border-l-4 border-red-500'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Reason: {leave.reason}</p>
                        <p className="text-sm text-gray-600">
                          {leave.startDate === leave.endDate 
                            ? `Date: ${leave.startDate}`
                            : `Duration: ${leave.startDate} to ${leave.endDate}`
                          }
                        </p>
                      </div>
                      <div className="flex items-center">
                        {leave.status === 'approved' && <Check size={18} className="text-green-500 mr-1" />}
                        {leave.status === 'pending' && <Clock size={18} className="text-yellow-500 mr-1" />}
                        {leave.status === 'rejected' && <X size={18} className="text-red-500 mr-1" />}
                        <span className={`text-sm font-medium capitalize ${
                          leave.status === 'approved' ? 'text-green-700' :
                          leave.status === 'pending' ? 'text-yellow-700' : 'text-red-700'
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No leave records for this date.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;