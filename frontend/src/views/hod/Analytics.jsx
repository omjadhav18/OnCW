import React, { useState, useEffect } from 'react';
import TeacherLeftSidebar from '../plugins/TeacherLeftSidebar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Calendar, Clock, AlertCircle, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import apiInstanceAuth from '../../utils/axiosall';

const Analytics = () => {
  const [overallStats, setOverallStats] = useState(null);
  const [stageStats, setStageStats] = useState(null);
  const [rejectionStats, setRejectionStats] = useState(null);
  const [decisionLogs, setDecisionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState('all');

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Fetch all statistics in parallel
        const [overallResponse, stageResponse, rejectionResponse, logsResponse] = await Promise.all([
          apiInstanceAuth.get('/leave-applications/statistics/'),
          apiInstanceAuth.get('/leave-applications/statistics/staged/'),
          apiInstanceAuth.get('/leave-applications/rejection/stats/'),
          apiInstanceAuth.get(`/leave-decision-logs/${selectedStage !== 'all' ? `?stage=${selectedStage}` : ''}`)
        ]);

        setOverallStats(overallResponse.data[0]); // Get first item from array
        setStageStats(stageResponse.data);
        setRejectionStats(rejectionResponse.data);
        setDecisionLogs(logsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Please try again later.");
        setLoading(false);
      }
    };

    fetchAllData();
  }, [selectedStage]);

  // Prepare data for pie chart (overall stats)
  const prepareOverallData = () => {
    if (!overallStats) return [];
    
    return [
      { name: 'Approved', value: overallStats.approved_leaves },
      { name: 'Rejected', value: overallStats.rejected_leaves },
      { name: 'Pending', value: overallStats.pending_leaves }
    ];
  };

  // Prepare data for bar chart (stage stats)
  const prepareStageData = () => {
    if (!stageStats) return [];
    
    return [
      { name: 'Authority', value: stageStats.authority_leaves },
      { name: 'Class Coordinator', value: stageStats.cc_leaves },
      { name: 'HOD', value: stageStats.hod_leaves }
    ];
  };

  // Prepare data for bar chart (rejection stats)
  const prepareRejectionData = () => {
    if (!rejectionStats) return [];
    
    return [
      { name: 'Authority', value: rejectionStats.Authority_Rejected_Count },
      { name: 'Class Coordinator', value: rejectionStats.CC_Rejected_Count },
      { name: 'HOD', value: rejectionStats.HOD_Rejected_Count }
    ];
  };

  // Format date for decision logs
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStageFilterChange = (e) => {
    setSelectedStage(e.target.value);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <TeacherLeftSidebar />
      
      <div className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Leave Analytics</h1>
          <p className="text-gray-600">View comprehensive analytics of leave applications</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <Clock className="animate-spin text-indigo-600 mb-2" size={32} />
              <p className="text-gray-600">Loading analytics data...</p>
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
          <>
            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6 col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Overall Leave Status</h2>
                  <PieChartIcon size={20} className="text-indigo-600" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareOverallData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {prepareOverallData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-indigo-50 rounded">
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="text-lg font-semibold text-indigo-600">{overallStats.total_leaves}</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-xs text-gray-600">Approved</p>
                    <p className="text-lg font-semibold text-green-600">{overallStats.approved_leaves}</p>
                  </div>
                  <div className="p-2 bg-red-50 rounded">
                    <p className="text-xs text-gray-600">Rejected</p>
                    <p className="text-lg font-semibold text-red-600">{overallStats.rejected_leaves}</p>
                  </div>
                </div>
              </div>

              {/* Pending at Each Stage */}
              <div className="bg-white rounded-lg shadow p-6 col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Pending at Each Stage</h2>
                  <BarChartIcon size={20} className="text-indigo-600" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareStageData()} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#4F46E5" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rejection Statistics */}
              <div className="bg-white rounded-lg shadow p-6 col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Rejection Statistics</h2>
                  <BarChartIcon size={20} className="text-indigo-600" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareRejectionData()} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#EF4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Decision Logs */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-indigo-800">Decision Logs</h2>
                <div>
                  <select
                    value={selectedStage}
                    onChange={handleStageFilterChange}
                    className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Stages</option>
                    <option value="authority">Authority</option>
                    <option value="cc">Class Coordinator</option>
                    <option value="hod">HOD</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {decisionLogs.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No decision logs available for the selected filter
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acted By</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {decisionLogs.slice(0, 10).map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">{log.leave_application}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{log.stage_display}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              log.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {log.status ? 'Approved' : 'Rejected'}
                            </span>
                          </td>
                          <td className="px-4 py-3">{log.remark}</td>
                          <td className="px-4 py-3 whitespace-nowrap">ID: {log.acted_by}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(log.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {decisionLogs.length > 10 && (
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500">
                  Showing 10 of {decisionLogs.length} entries
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;