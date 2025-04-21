import React, { useState, useEffect } from 'react';
import LeftSidebar from '../plugins/LeftSidebar';
import { Bell, Check, Clock, AlertCircle, Trash2 } from 'lucide-react';
import apiInstanceAuth from '../../utils/axiosall';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiInstanceAuth.get('notify/student/');
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications. Please try again later.');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiInstanceAuth.patch(`notify/student-seen/${id}/`);
      
      // Update local state to reflect the change
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, is_read: true } : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const deleteNotification = (id) => {
    // Since there's no delete API endpoint provided, we'll just remove from local state
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAllAsRead = async () => {
    try {
      // Mark each unread notification as read
      const unreadNotifications = notifications.filter(n => !n.is_read);
      
      for (const notification of unreadNotifications) {
        await apiInstanceAuth.get(`notify/student-seen/${notification.id}/`);
      }
      
      // Update all notifications in state as read
      setNotifications(notifications.map(notification => ({ ...notification, is_read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Determine notification type based on message content
  const getNotificationType = (message) => {
    if (message.includes('approved')) {
      return 'success';
    } else if (message.includes('pending') || message.includes('waiting')) {
      return 'pending';
    } else if (message.includes('rejected') || message.includes('denied')) {
      return 'rejected';
    } else {
      return 'info';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check size={20} className="text-green-500" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-500" />;
      case 'rejected':
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return <Bell size={20} className="text-blue-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <LeftSidebar />
      
      <div className="ml-64 flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Bell className="mr-2 text-indigo-600" /> Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 bg-indigo-600 text-white text-xs font-semibold rounded-full px-2 py-1">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <p className="text-red-500">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No notifications to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const notificationType = getNotificationType(notification.message);
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={`border-l-4 ${
                        notificationType === 'success' ? 'border-green-500' :
                        notificationType === 'pending' ? 'border-yellow-500' :
                        notificationType === 'rejected' ? 'border-red-500' :
                        'border-blue-500'
                      } bg-white p-4 rounded-md shadow-sm ${
                        !notification.is_read ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">
                            {getTypeIcon(notificationType)}
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium">{notification.message}</p>
                            <p className="text-gray-500 text-sm mt-1">{formatDate(notification.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!notification.is_read && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="text-indigo-600 hover:text-indigo-800"
                              title="Mark as read"
                            >
                              <Check size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-500 hover:text-red-500"
                            title="Delete notification"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;