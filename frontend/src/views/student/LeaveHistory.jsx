import React, { useState, useEffect } from 'react';
import LeftSidebar from '../plugins/LeftSidebar';
import { Clock, Check, X, AlertCircle, Filter, ChevronDown, Download, Eye } from 'lucide-react';
import apiInstanceAuth from '../../utils/axiosall';

const LeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    activityType: 'all',
    dateRange: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState([]);

  // Fetch leave history on component mount
  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    try {
      setLoading(true);
      const response = await apiInstanceAuth.get('notify/student-leave-history/');
      setLeaveHistory(response.data);
      setOriginalData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leave history. Please try again later.');
      console.error('Error fetching leave history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filtering
  const applyFilters = () => {
    let filtered = [...originalData];
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(leave => leave.status === filters.status);
    }
    
    if (filters.activityType !== 'all') {
      filtered = filtered.filter(leave => leave.activity_name === filters.activityType);
    }
    
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      
      if (filters.dateRange === '3months') {
        filtered = filtered.filter(leave => new Date(leave.from_date) >= threeMonthsAgo);
      } else if (filters.dateRange === '6months') {
        filtered = filtered.filter(leave => new Date(leave.from_date) >= sixMonthsAgo);
      }
    }
    
    setLeaveHistory(filtered);
    setIsFilterOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: 'all',
      activityType: 'all',
      dateRange: 'all'
    });
    setLeaveHistory(originalData);
    setIsFilterOpen(false);
  };

  // Get unique activity types for filter dropdown
  const getUniqueActivityTypes = () => {
    const activityTypes = originalData.map(leave => leave.activity_name);
    return [...new Set(activityTypes)];
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Check size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'rejected':
        return <X size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-blue-500" />;
    }
  };

  // Get status class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Calculate leave duration in days
  const calculateDuration = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
    return diffDays;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Check if a remark is available
  const hasRemark = (leave) => {
    return leave.authority_remark || leave.cc_remark || leave.hod_remark;
  };

  // Get approver information based on status
  const getApproverInfo = (leave) => {
    if (leave.status.toLowerCase() === 'approved') {
      if (leave.authority_remark) return 'Authority';
      if (leave.cc_remark) return 'Class Coordinator';
      if (leave.hod_remark) return 'HOD';
      return 'System';
    }
    return '-';
  };

  // Get remarks for display in details
  const getRemarks = (leave) => {
    const remarks = [];
    
    if (leave.authority_remark) remarks.push(`Authority: ${leave.authority_remark}`);
    if (leave.cc_remark) remarks.push(`Class Coordinator: ${leave.cc_remark}`);
    if (leave.hod_remark) remarks.push(`HOD: ${leave.hod_remark}`);
    
    return remarks.length > 0 ? remarks.join('\n') : 'No remarks available';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <LeftSidebar />
      
      <div className="ml-64 flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Clock className="mr-2 text-indigo-600" /> Leave History
              </h1>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
                >
                  <Filter size={16} className="mr-1" />
                  Filter
                  <ChevronDown size={16} className="ml-1" />
                </button>
                
                <button className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium">
                  <Download size={16} className="mr-1" />
                  Export
                </button>
              </div>
            </div>
            
            {/* Filters dropdown */}
            {isFilterOpen && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="all">All Statuses</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded"
                      value={filters.activityType}
                      onChange={(e) => setFilters({...filters, activityType: e.target.value})}
                    >
                      <option value="all">All Activities</option>
                      {getUniqueActivityTypes().map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded"
                      value={filters.dateRange}
                      onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    >
                      <option value="all">All Time</option>
                      <option value="3months">Last 3 Months</option>
                      <option value="6months">Last 6 Months</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-3">
                  <button 
                    onClick={resetFilters}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={applyFilters}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Leave History Table */}
            {loading ? (
              <div className="text-center py-12">
                <Clock size={48} className="mx-auto text-gray-400 animate-pulse mb-4" />
                <p className="text-gray-500">Loading leave history...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leave Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaveHistory.length > 0 ? leaveHistory.map((leave) => {
                      const duration = calculateDuration(leave.from_date, leave.to_date);
                      
                      return (
                        <tr key={leave.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{leave.activity_name}</div>
                            <div className="text-sm text-gray-500">
                              {leave.from_date === leave.to_date 
                                ? formatDate(leave.from_date)
                                : `${formatDate(leave.from_date)} to ${formatDate(leave.to_date)}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {duration} {duration > 1 ? 'days' : 'day'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(leave.date_of_application)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusClass(leave.status)}`}>
                              {getStatusIcon(leave.status)}
                              <span className="ml-1">{leave.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button 
                              onClick={() => setSelectedLeave(leave)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            >
                              <Eye size={16} className="mr-1" /> View Details
                            </button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="5" className="text-center py-8">
                          <p className="text-gray-500">No leave history found with the selected filters.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Leave Details Modal */}
          {selectedLeave && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Leave Details</h3>
                  <button 
                    onClick={() => setSelectedLeave(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusClass(selectedLeave.status)}`}>
                      {getStatusIcon(selectedLeave.status)}
                      <span className="ml-1">{selectedLeave.status}</span>
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activity:</span>
                    <span className="font-medium">{selectedLeave.activity_name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Branch:</span>
                    <span className="font-medium">{selectedLeave.branch}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shift:</span>
                    <span className="font-medium">{selectedLeave.shift}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {calculateDuration(selectedLeave.from_date, selectedLeave.to_date)} 
                      {calculateDuration(selectedLeave.from_date, selectedLeave.to_date) > 1 ? ' days' : ' day'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Period:</span>
                    <span className="font-medium">
                      {selectedLeave.from_date === selectedLeave.to_date 
                        ? formatDate(selectedLeave.from_date)
                        : `${formatDate(selectedLeave.from_date)} to ${formatDate(selectedLeave.to_date)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applied On:</span>
                    <span className="font-medium">{formatDate(selectedLeave.date_of_application)}</span>
                  </div>
                  
                  {selectedLeave.status.toLowerCase() === 'approved' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved By:</span>
                      <span className="font-medium">{getApproverInfo(selectedLeave)}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-gray-600">Reason:</span>
                    <p className="mt-1 text-gray-800">{selectedLeave.reason || 'No reason provided'}</p>
                  </div>
                  
                  {hasRemark(selectedLeave) && (
                    <div>
                      <span className="text-gray-600">Remarks:</span>
                      <pre className="mt-1 text-gray-800 whitespace-pre-wrap font-sans">{getRemarks(selectedLeave)}</pre>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-gray-600">Subject Attendance:</span>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{selectedLeave.subject1}:</span>
                        <span>{selectedLeave.subject1_attendance}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{selectedLeave.subject2}:</span>
                        <span>{selectedLeave.subject2_attendance}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{selectedLeave.subject3}:</span>
                        <span>{selectedLeave.subject3_attendance}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{selectedLeave.subject4}:</span>
                        <span>{selectedLeave.subject4_attendance}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedLeave.feedback && (
                    <div>
                      <span className="text-gray-600">Feedback:</span>
                      <p className="mt-1 text-gray-800">{selectedLeave.feedback}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={() => setSelectedLeave(null)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveHistory;