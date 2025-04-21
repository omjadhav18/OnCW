import { useEffect, useState } from "react";
import apiInstanceAuth from "../../utils/axiosall";
import { Link } from "react-router-dom";
import TeacherLeftSidebar from "../plugins/TeacherLeftSidebar";
import { ClipboardCheck } from "lucide-react";

const HODReview = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setIsLoading(true);
        const response = await apiInstanceAuth.get("/hod/form-review");
        setApplications(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setIsLoading(false);
      }
    };
    fetchdata();
  }, []);

  console.log(applications);

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
                  <h1 className="text-2xl font-bold text-gray-800">HOD Applications Review</h1>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse text-indigo-600">Loading applications...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <div
                        key={app.id}
                        className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200 flex justify-between items-center"
                      >
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">{app.student.CRN}</h2>
                          <div className="mt-1 flex items-center">
                            <span className="text-indigo-600 font-medium">Branch:</span>
                            <span className="ml-2 text-gray-600">{app.branch}</span>
                          </div>
                        </div>
                        <Link
                          to={`/teacher-hod/review/detail/${app.id}`}
                          className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          View Details
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-12 text-center">
                      <ClipboardCheck size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-gray-500">
                        No Applications Found
                      </p>
                      <p className="text-gray-400 mt-2">
                        There are currently no applications requiring your review.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODReview;