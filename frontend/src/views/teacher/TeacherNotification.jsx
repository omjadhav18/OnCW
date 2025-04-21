import React, { useState, useEffect } from 'react';
import TeacherLeftSidebar from '../plugins/TeacherLeftSidebar';
import { Bell, CheckCircle, Clock, AlertTriangle, X, Filter } from 'lucide-react';
import apiInstanceAuth from "../../utils/axiosall";

const TeacherNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teacher profile and then notifications based on role
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First fetch teacher profile to determine role
        const profileResponse = await apiInstanceAuth.get('/user/teacher/profile/');
        setTeacherProfile(profileResponse.data);
        console.log(profileResponse.data.teacher_role)
        
        // Based on role, fetch appropriate notifications
        let notificationsEndpoint;
        if (profileResponse.data.teacher_role === "teacher") {
          notificationsEndpoint = '/notify/authority/';
        } else if (profileResponse.data.teacher_role === 'co-ordinator') {
          notificationsEndpoint = '/notify/cc/';
        } else if (profileResponse.data.teacher_role === 'hod') {
          notificationsEndpoint = '/notify/hod';
        } else {
          // Default case or handle other roles
          throw new Error('Unknown teacher role');
        }
        
        // Fetch notifications based on determined role
        const notificationsResponse = await apiInstanceAuth.get(notificationsEndpoint);
        console.log(notificationsResponse.data)
        
        // Process notifications to include read status and type
        const processedNotifications = notificationsResponse.data.map((notification, index) => {
          // Determine notification type based on some logic from data
          // This is an example - adjust according to your actual data structure
          // console.log(notification.status)
          // console.log(notification.student.username)
          console.log(index)
          let type = 'new';  
          if (notification.status === "approved") type = 'approval';
          else if (notification.status === "pending") type = 'pending';
          else if (notification.status === "rejected") type = 'rejected'
          
          return {
            id: notification.id || index,
            type: type,
            message: `Leave application from ${notification.student?.user?.username || 'Unknown Student'} (Shift: ${notification.shift || 'Unknown'})`,
            branch: notification.branch || 'Unknown Branch',
            date: notification.created_at || new Date().toISOString(),
            read: notification.read || false
          };
        });
        
        setNotifications(processedNotifications);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load notifications. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format the date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      // This would be an API call to update the read status on the backend
      // await apiInstanceAuth.patch(`/notifications/${id}/`, { read: true });
      
      // Update local state
      setNotifications(
        notifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // This would be an API call to update all notifications
      // await apiInstanceAuth.post('/notifications/mark-all-read/');
      
      // Update local state
      setNotifications(
        notifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Filter notifications based on selection
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(notification => !notification.read)
      : notifications.filter(notification => notification.type === filter);

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'approval':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'rejected':
        return <X size={20} className="text-red-500" />;
      case 'new':
        return <Clock size={20} className="text-blue-500" />;
      case 'reminder':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      default:
        return <Bell size={20} className="text-indigo-500" />;
    }
  };

  return (
    <div className="flex">
      <TeacherLeftSidebar />
      <div className="flex-1 ml-64">
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <Bell size={24} className="text-indigo-600 mr-3" />
                  <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button 
                      className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                      onClick={() => {
                        const filterElement = document.getElementById('notification-filter');
                        filterElement.classList.toggle('hidden');
                      }}
                    >
                      <Filter size={16} className="mr-2 text-gray-600" />
                      Filter
                    </button>
                    <div id="notification-filter" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                      <button 
                        onClick={() => setFilter('all')} 
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'all' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      >
                        All Notifications
                      </button>
                      <button 
                        onClick={() => setFilter('unread')} 
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'unread' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      >
                        Unread
                      </button>
                      <button 
                        onClick={() => setFilter('approval')} 
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'approval' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      >
                        Approvals
                      </button>
                      <button 
                        onClick={() => setFilter('new')} 
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'new' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      >
                        New Applications
                      </button>
                      <button 
                        onClick={() => setFilter('rejected')} 
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'rejected' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={markAllAsRead}
                    className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-indigo-100 h-10 w-10"></div>
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-indigo-100 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-indigo-100 rounded"></div>
                          <div className="h-4 bg-indigo-100 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="py-16 text-center">
                    <AlertTriangle size={40} className="mx-auto text-red-500 mb-4" />
                    <p className="text-gray-700">{error}</p>
                  </div>
                ) : filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-5 hover:bg-gray-50 transition duration-150 ease-in-out ${!notification.read ? 'bg-indigo-50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm text-gray-800 ${!notification.read ? 'font-medium' : ''}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Branch: {notification.branch}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(notification.date)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="ml-3 flex-shrink-0">
                            <span className="inline-block w-2 h-2 rounded-full bg-indigo-600"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <Bell size={40} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No notifications found</p>
                    {filter !== 'all' && (
                      <button 
                        onClick={() => setFilter('all')} 
                        className="mt-2 text-indigo-600 hover:text-indigo-800"
                      >
                        View all notifications
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Footer/Pagination (if needed) */}
              {filteredNotifications.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 text-center text-sm text-gray-500">
                  Showing {filteredNotifications.length} of {notifications.length} notifications
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherNotification;