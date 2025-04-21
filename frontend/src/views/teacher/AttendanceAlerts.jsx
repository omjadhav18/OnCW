import React, { useState, useEffect } from 'react';
import TeacherLeftSidebar from '../plugins/TeacherLeftSidebar';
import { Bell, Calendar, Check, X, AlertCircle, Clock, Search, Filter } from 'lucide-react';
import apiInstanceAuth from "../../utils/axiosall";

const AttendanceAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiInstanceAuth.get('notify/teacher/');
      setAlerts(response.data.map(notification => ({
        id: notification.id,
        message: notification.message,
        isSeen: notification.is_seen,
        timestamp: notification.created_at,
        status: notification.is_seen ? 'seen' : 'unseen'
      })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  // Mark notification as seen
  const markAsSeen = async (id) => {
    try {
      await apiInstanceAuth.patch(`notify/teacher-seen/${id}/`);
      // Update local state after API call
      setAlerts(alerts.map(alert => 
        alert.id === id ? {...alert, isSeen: true, status: 'seen'} : alert
      ));
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up a polling mechanism to check for new notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.message && alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && alert.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'seen':
        return <Check size={20} className="text-green-500" />;
      case 'unseen':
        return <Clock size={20} className="text-yellow-500" />;
      default:
        return <Bell size={20} className="text-blue-500" />;
    }
  };

  const pendingCount = alerts.filter(a => a.status === 'unseen').length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherLeftSidebar />
      
      <div className="ml-64 flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Bell className="mr-2 text-indigo-600" /> Attendance Alerts
                {pendingCount > 0 && (
                  <span className="ml-2 bg-indigo-600 text-white text-xs font-semibold rounded-full px-2 py-1">
                    {pendingCount} unread
                  </span>
                )}
              </h1>
              
              <div className="flex space-x-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="text-sm border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="unseen">Unread</option>
                  <option value="seen">Read</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No attendance alerts to display</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`border-l-4 ${
                      alert.status === 'seen' ? 'border-green-500' : 'border-yellow-500'
                    } bg-white p-4 rounded-md shadow-sm`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          {getStatusIcon(alert.status)}
                        </div>
                        <div>
                          <div className="text-gray-700 mt-1">{alert.message}</div>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {alert.status === 'unseen' && (
                          <button 
                            onClick={() => markAsSeen(alert.id)}
                            className="text-green-600 hover:bg-green-50 p-1 rounded flex items-center"
                            title="Mark as read"
                          >
                            <Check size={18} />
                            <span className="ml-1 text-xs">Mark as read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAlerts;