import React, { useState, useEffect } from 'react';
import TeacherLeftSidebar from '../plugins/TeacherLeftSidebar';
import { Check, X, Clock, AlertCircle, User, Calendar } from 'lucide-react';
import apiInstanceAuth from '../../utils/axiosall';

const LeaveLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await apiInstanceAuth.get('/leave-decision-logs');
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load logs');
        setLoading(false);
        console.error('Error fetching logs:', err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <TeacherLeftSidebar />
      
      <div className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Leave Decision Logs</h1>
          <p className="text-gray-600">View all leave application decisions</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <Clock className="animate-spin text-indigo-600 mb-2" size={32} />
              <p className="text-gray-600">Loading logs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <AlertCircle className="text-red-500 mb-2" size={32} />
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-indigo-50 border-b border-indigo-100">
              <h2 className="text-lg font-semibold text-indigo-800">Recent Decisions</h2>
            </div>
            
            <div className="overflow-x-auto">
              {logs.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No logs available
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {logs.map((log) => (
                    <LogItem key={log.id} log={log} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LogItem = ({ log }) => {
  const getStatusIcon = (status) => {
    if (status === true) {
      return <Check size={20} className="text-green-500" />;
    } else {
      return <X size={20} className="text-red-500" />;
    }
  };

  const getStatusClass = (status) => {
    return status === true 
      ? "bg-green-50 border-green-200" 
      : "bg-red-50 border-red-200";
  };
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <li className={`p-4 hover:bg-gray-50 ${getStatusClass(log.status)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getStatusIcon(log.status)}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              Leave Application #{log.leave_application}
            </p>
            <p className="text-sm text-gray-600">
              {log.status ? 'Approved' : 'Rejected'} at {log.stage_display} level
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Remark:</span> {log.remark}
            </p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <User size={14} className="mr-1" />
              <span>Acted by ID: {log.acted_by}</span>
              <Calendar size={14} className="ml-3 mr-1" />
              <span>{formatDate(log.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default LeaveLogs;