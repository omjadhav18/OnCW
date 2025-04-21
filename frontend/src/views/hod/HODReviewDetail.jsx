import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiInstanceAuth from '../../utils/axiosall';
import TeacherLeftSidebar from '../plugins/TeacherLeftSidebar';
import { ClipboardCheck, ChevronLeft, Check, X, AlertTriangle } from 'lucide-react';

const HODReviewDetail = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingAction, setProcessingAction] = useState(false);
    const [actionMessage, setActionMessage] = useState('');
    const [student, setStudent] = useState();
    const [feedback, setFeedback] = useState("");

    const param = useParams();
    const id = param.id;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                setLoading(true);
                const response = await apiInstanceAuth.get(`/hod/form-detail-review/${id}`);
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
            const response = await apiInstanceAuth.get(`/student-detail/${application.student}`)
            setStudent(response?.data?.username)
        }
        if (application) {
            fetchStudent();
        }
    }, [application]);

    const handleApprove = async () => {
        // if (!feedback.trim()) return;
        // const formdata = new FormData()
        // formdata.append("feedback", feedback)
        const response = await apiInstanceAuth.patch(`/hod/approval/${application?.id}/`)
        navigate("/teacher-hod-review")
    };

    const handleReject = async () => {
        if (!feedback.trim()) return;
        const formdata = new FormData()
        formdata.append("feedback", feedback)
        const response = await apiInstanceAuth.patch(`/hod/reject/${application?.id}/`,formdata)
        navigate("/teacher-hod-review")
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
                <div className="min-h-screen bg-gray-100 p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                                <div className="flex items-center">
                                    <ClipboardCheck size={24} className="text-indigo-600 mr-3" />
                                    <h1 className="text-2xl font-bold text-gray-800">HOD Leave Application Review</h1>
                                </div>
                            </div>

                            {actionMessage && (
                                <div className={`mb-6 p-4 rounded-md flex items-center ${actionMessage.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {actionMessage.includes('Failed') ? 
                                        <X className="mr-2" size={20} /> : 
                                        <Check className="mr-2" size={20} />
                                    }
                                    {actionMessage}
                                </div>
                            )}

                            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-indigo-600 mb-4">Student Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Student</h3>
                                        {student ? <p className="mt-1 text-lg font-medium">{student}</p> : <p className="mt-1 text-lg text-gray-400">NONE</p>}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Application Date</h3>
                                        <p className="mt-1 text-lg font-medium">{new Date(application.date_of_application).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Branch</h3>
                                        <p className="mt-1 text-lg font-medium">{application.branch}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Shift</h3>
                                        <p className="mt-1 text-lg font-medium">{application.shift}</p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-indigo-600 mt-6 mb-4">Leave Details</h3>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Activity Name</h3>
                                    <p className="mt-1 text-lg font-medium">{application.activity_name}</p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Time Period</h3>
                                    <p className="mt-1 text-lg font-medium">{application.time_period}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                                <h3 className="text-lg font-semibold text-indigo-600 mb-4">Subject Attendance Information</h3>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-3 border border-gray-300 text-left font-semibold text-gray-700">Subject</th>
                                                <th className="p-3 border border-gray-300 text-center font-semibold text-gray-700">Attendance (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="p-3 border border-gray-300">{application.subject1}</td>
                                                <td className="p-3 border border-gray-300 text-center font-medium">{application.subject1_attendance}%</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 border border-gray-300">{application.subject2}</td>
                                                <td className="p-3 border border-gray-300 text-center font-medium">{application.subject2_attendance}%</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 border border-gray-300">{application.subject3}</td>
                                                <td className="p-3 border border-gray-300 text-center font-medium">{application.subject3_attendance}%</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 border border-gray-300">{application.subject4}</td>
                                                <td className="p-3 border border-gray-300 text-center font-medium">{application.subject4_attendance}%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-indigo-600 mb-4">Application Status</h3>
                                <div className="p-5 bg-green-50 rounded-lg border border-green-200 flex items-start">
                                    <Check size={20} className="text-green-600 mr-3 mt-1" />
                                    <div>
                                        <p className="text-base mb-2 text-gray-800">This application has been reviewed and approved by the Class Coordinator.</p>
                                        <p className="text-base font-medium text-green-700">Please review and make your final decision.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-indigo-600 mb-4">HOD Decision</h3>
                                <div className="p-5 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <p className="text-base mb-4 text-gray-800">Please provide your feedback and decide on this application.</p>
                                    <p className="text-red-500 text-base mb-4 font-medium">Fill Feedback For Approval/Rejection</p>

                                    {/* Feedback Input */}
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Enter your feedback before making a decision..."
                                        className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        rows={4}
                                    />

                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={handleReject}
                                            disabled={!feedback.trim() || processingAction}
                                            className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            <X size={18} className="mr-2" />
                                            Reject Application
                                        </button>

                                        <button
                                            onClick={handleApprove}
                                            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            <Check size={18} className="mr-2" />
                                            Approve Application
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={() => navigate('/teacher-hod-review')}
                                    className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center mx-auto"
                                >
                                    <ChevronLeft size={18} className="mr-2" />
                                    Back to Applications
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HODReviewDetail;