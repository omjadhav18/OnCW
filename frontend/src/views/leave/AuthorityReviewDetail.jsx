import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiInstanceAuth from '../../utils/axiosall';
import TeacherLeftSidebar from '../plugins/TeacherLeftSidebar';
import { FileText, Calendar, Clock, User, Building, Layers, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const AuthorityReviewDetail = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [student, setStudent] = useState();
  
  const param = useParams();
  const id = param.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await apiInstanceAuth.get(`/authority/form-detail-review/${id}`);
        setApplication(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load application details');
        console.error('Error fetching application:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplication();
  }, [id]);

  useEffect(() => {
    const fetchStudent = async () => {
      if (application) {
        try {
          const response = await apiInstanceAuth.get(`/student-detail/${application.student}`);
          setStudent(response?.data?.username);
        } catch (err) {
          console.error('Error fetching student details:', err);
        }
      }
    };
    
    fetchStudent();
  }, [application]);
  
  const handleApprove = async () => {
    setProcessingAction(true);
    try {
      const response = await apiInstanceAuth.patch(`/authority/approval/${application?.id}/`);
      setActionMessage('Application approved successfully!');
      setTimeout(() => {
        navigate("/teacher-authority-review");
      }, 1500);
    } catch (err) {
      setActionMessage('Failed to approve application.');
      setProcessingAction(false);
    }
  };
  
  const handleReject = async () => {
    setProcessingAction(true);
    try {
      const response = await apiInstanceAuth.patch(`/authority/reject/${application?.id}/`);
      setActionMessage('Application rejected.');
      setTimeout(() => {
        navigate("/authority-review");
      }, 1500);
    } catch (err) {
      setActionMessage('Failed to reject application.');
      setProcessingAction(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex">
        <TeacherLeftSidebar />
        <div className="flex-1 ml-64">
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="text-xl font-medium text-indigo-600">Loading application details...</div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex">
        <TeacherLeftSidebar />
        <div className="flex-1 ml-64">
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="text-xl font-medium text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!application) {
    return (
      <div className="flex">
        <TeacherLeftSidebar />
        <div className="flex-1 ml-64">
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="text-xl font-medium text-gray-600">Application not found</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex">
      <TeacherLeftSidebar />
      <div className="flex-1 ml-64">
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="text-white mr-3" size={24} />
                    <h2 className="text-2xl font-bold text-white">Leave Application Review</h2>
                  </div>
                </div>
              </div>
              
              {actionMessage && (
                <div className={`mx-6 my-4 p-4 rounded-md ${actionMessage.includes('Failed') 
                  ? 'bg-red-100 text-red-700 border-l-4 border-red-500' 
                  : 'bg-green-100 text-green-700 border-l-4 border-green-500'}`}>
                  {actionMessage}
                </div>
              )}
              
              <div className="p-6">
                {/* Application Details Section */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-4 pb-2 border-b border-gray-200">
                    Application Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start">
                      <User className="text-indigo-500 mt-1 mr-3" size={18} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Student</h3>
                        {student ? <p className="mt-1 text-lg font-medium">{student}</p> : <p className="mt-1 text-lg font-medium text-gray-400">Not Available</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="text-indigo-500 mt-1 mr-3" size={18} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Application Date</h3>
                        <p className="mt-1 text-lg font-medium">{new Date(application.date_of_application).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start">
                      <Building className="text-indigo-500 mt-1 mr-3" size={18} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Branch</h3>
                        <p className="mt-1 text-lg font-medium">{application.branch}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="text-indigo-500 mt-1 mr-3" size={18} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Shift</h3>
                        <p className="mt-1 text-lg font-medium">{application.shift}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-start">
                      <Layers className="text-indigo-500 mt-1 mr-3" size={18} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Activity Name</h3>
                        <p className="mt-1 text-lg font-medium">{application.activity_name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-start">
                      <Clock className="text-indigo-500 mt-1 mr-3" size={18} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Time Period</h3>
                        <p className="mt-1 text-lg font-medium">{application.time_period}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Reason</h3>
                    <div className="p-4 bg-white rounded border border-gray-200">
                      <p className="text-lg whitespace-pre-line">{application.reason || "No reason provided"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Authority Decision Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-4">Authority Decision</h3>
                  <div className="p-5 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-base mb-6">Please review the application carefully before making a decision.</p>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleReject}
                        disabled={processingAction}
                        className="flex items-center px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                      >
                        <XCircle className="mr-2" size={18} />
                        Reject Application
                      </button>
                      
                      <button
                        onClick={handleApprove}
                        disabled={processingAction}
                        className="flex items-center px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle className="mr-2" size={18} />
                        Approve Application
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="text-center pb-4">
                  <button
                    onClick={() => navigate('/teacher-authority-review')}
                    className="flex items-center px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 mx-auto transition-colors"
                  >
                    <ArrowLeft className="mr-2" size={18} />
                    Back to Applications
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityReviewDetail;