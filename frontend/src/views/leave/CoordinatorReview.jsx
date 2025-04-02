import { useEffect, useState } from "react";
import apiInstanceAuth from "../../utils/axiosall";
import { Link } from "react-router-dom";

const CoordinatorReview = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      const response = await apiInstanceAuth.get("/coordinator/form-review");
      setApplications(response.data);
    };
    fetchdata();
  }, []);

  console.log(applications);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Co-Ordinator Review</h1>
      <div className="w-full max-w-3xl">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{app.student.CRN}</h2>
                <p className="text-gray-600">{app.branch}</p>
              </div>
              <Link
                to={`/coordinator/review/detail/${app.id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                View
              </Link>
            </div>
          ))
        ) : (
          <p className="text-2xl font-bold text-gray-500 text-center mt-10">
            No Applications
          </p>
        )}
      </div>
    </div>
  );
};

export default CoordinatorReview;
