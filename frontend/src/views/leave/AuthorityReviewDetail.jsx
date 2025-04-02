import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import apiInstanceAuth from '../../utils/axiosall';

const AuthorityReviewDetail = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [student,setStudent] = useState();
  
  const param= useParams();
  const id=param.id
  const navigate = useNavigate();


  
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await apiInstanceAuth.get(`/authority/form-detail-review/${id}`);
        //console.log(response.data)
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
  useEffect(()=>{
    const fetchStudent = async () =>{
        const response = await apiInstanceAuth.get(`/student-detail/${application.student}`)
        setStudent(response?.data?.username)
    }
    fetchStudent();
  },[application])
  
  const handleApprove = async () => {
    const response = await apiInstanceAuth.patch(`/authority/approval/${application?.id}/`)
    navigate("/authority-review")
    //console.log(response)
  };
  
  const handleReject = async () => {
    const response = await apiInstanceAuth.patch(`/authority/reject/${application?.id}/`)
    navigate("/authority-review")
  };
  
  // const processAction = async (action, successMessage) => {
  //   try {
  //     setProcessingAction(true);
  //     setActionMessage('');
      
  //     await axios.post(`/api/leave-applications/${id}/${action}/`, {
  //       authority_remark: action === 'approve' ? true : false
  //     });
      
  //     setActionMessage(successMessage);
  //     setTimeout(() => {
  //       navigate('/authority/applications');
  //     }, 2000);
  //   } catch (err) {
  //     setActionMessage(`Failed to ${action} application. Please try again.`);
  //     console.error(`Error ${action}ing application:`, err);
  //   } finally {
  //     setProcessingAction(false);
  //   }
  // };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-medium">Loading application details...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-medium text-red-600">{error}</div>
      </div>
    );
  }
  
  if (!application) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-medium">Application not found</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Leave Application Review</h2>
      
      {actionMessage && (
        <div className={`mb-4 p-3 rounded-md ${actionMessage.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {actionMessage}
        </div>
      )}
      
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Student</h3>
            {student ? <p className="mt-1 text-lg">{student}</p> : <p>NONE</p>}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Application Date</h3>
            <p className="mt-1 text-lg">{new Date(application.date_of_application).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Branch</h3>
            <p className="mt-1 text-lg">{application.branch}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Shift</h3>
            <p className="mt-1 text-lg">{application.shift}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Activity Name</h3>
          <p className="mt-1 text-lg">{application.activity_name}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Time Period</h3>
          <p className="mt-1 text-lg">{application.time_period}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Reason</h3>
          <p className="mt-1 text-lg whitespace-pre-line">{application.reason || "No reason provided"}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Subject Attendance Information</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Subject</th>
                <th className="p-2 border text-center">Attendance (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">{application.subject1}</td>
                <td className="p-2 border text-center">{application.subject1_attendance}%</td>
              </tr>
              <tr>
                <td className="p-2 border">{application.subject2}</td>
                <td className="p-2 border text-center">{application.subject2_attendance}%</td>
              </tr>
              <tr>
                <td className="p-2 border">{application.subject3}</td>
                <td className="p-2 border text-center">{application.subject3_attendance}%</td>
              </tr>
              <tr>
                <td className="p-2 border">{application.subject4}</td>
                <td className="p-2 border text-center">{application.subject4_attendance}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Authority Decision</h3>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-base mb-4">Please review the application carefully before making a decision.</p>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleReject}
              disabled={processingAction}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              Reject Application
            </button>
            
            <button
              onClick={handleApprove}
              disabled={processingAction}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              Approve Application
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={() => navigate('/authority-review')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Back to Applications
        </button>
      </div>
    </div>
  );
};

export default AuthorityReviewDetail;