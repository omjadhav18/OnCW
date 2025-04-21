import React, { useState } from 'react';
import { FileOutput, Download, Calendar } from 'lucide-react';
import  apiInstanceAuth  from '../../utils/axiosall';
import TeacherLeftSidebar from '../plugins/TeacherLeftSidebar';

const CCReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const downloadReport = async () => {
    // Validate dates
    if (!fromDate || !toDate) {
      setError('Please select both from and to dates');
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError('From date cannot be later than to date');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Call the CC-specific API with date parameters
      const response = await apiInstanceAuth.get(
        `leave-application-cc-within-date-range/?from_date=${fromDate}&to_date=${toDate}`,
        { responseType: 'blob' } // Important for file downloads
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cc_leave_report_${fromDate}_to_${toDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading CC report:', err);
      setError('Failed to download report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherLeftSidebar />
      
      <div className="flex-1 ml-64"> {/* Adjust margin to match sidebar width */}
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Course Coordinator Reports</h1>
            <p className="text-gray-600">Download leave applications within a specific date range for courses you coordinate</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Date Picker */}
                <div className="space-y-2">
                  <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 flex items-center">
                    <Calendar size={16} className="mr-2 text-indigo-600" />
                    From Date
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* To Date Picker */}
                <div className="space-y-2">
                  <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 flex items-center">
                    <Calendar size={16} className="mr-2 text-indigo-600" />
                    To Date
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Button */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={downloadReport}
                  disabled={isLoading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download size={20} className="mr-2" />
                      Download CC Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Information card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FileOutput className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">About Course Coordinator Reports</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    This report contains all leave applications you've reviewed as a Course Coordinator within the selected date range.
                    The Excel file includes details for each application that passed through your coordination workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCReport;