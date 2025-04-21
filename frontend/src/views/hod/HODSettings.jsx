import React from 'react';
import {
  Settings,
  TrendingUp,
  Building,
  Brain,
  History,
  FileSpreadsheet,
  MessageCircle,
  BarChart2,
  UserCheck
} from 'lucide-react';
import TeacherLeftSidebar from "../plugins/TeacherLeftSidebar";

const HODSettings = () => {
  const futureFeatures = [
    {
      title: "Automated Leave Insights",
      description: "Integration of predictive analytics to understand leave trends, departmental availability, and peak absence periods.",
      icon: <TrendingUp className="w-10 h-10 text-indigo-600" />
    },
    {
      title: "Multi-department Coordination",
      description: "A unified panel for HODs managing multiple departments to oversee and handle cross-departmental leaves efficiently.",
      icon: <Building className="w-10 h-10 text-indigo-600" />
    },
    {
      title: "Leave Replacement Suggestions",
      description: "AI-assisted suggestions for teacher replacements during approved leaves to maintain class continuity.",
      icon: <Brain className="w-10 h-10 text-indigo-600" />
    },
    {
      title: "Audit Trail & Logs",
      description: "Detailed historical activity logs for transparency in all approval stages, including filters by student, teacher, and time period.",
      icon: <History className="w-10 h-10 text-indigo-600" />
    },
    {
      title: "Export Enhancements",
      description: "Ability to export analytics in various formats (PDF, Excel, CSV) with filters and customized fields.",
      icon: <FileSpreadsheet className="w-10 h-10 text-indigo-600" />
    },
    {
      title: "Communication Layer",
      description: "A built-in messaging system to discuss leave queries or clarifications between HODs and other authorities.",
      icon: <MessageCircle className="w-10 h-10 text-indigo-600" />
    },
    {
      title: "Performance Metrics",
      description: "Dashboard widgets showing key metrics such as average leave approval time, most active approvers, and department-level stats.",
      icon: <BarChart2 className="w-10 h-10 text-indigo-600" />
    },
    {
      title: "Role Management",
      description: "Fine-grained permission control for assigning sub-HODs or delegates temporarily.",
      icon: <UserCheck className="w-10 h-10 text-indigo-600" />
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <TeacherLeftSidebar userRole={{ isTeacher: true, isCC: false, isHOD: true }} />

      <div className="ml-64 flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header with Settings Icon */}
          <div className="flex flex-col items-center justify-center mb-10 mt-10">
            <div className="bg-indigo-100 p-8 rounded-full mb-6 shadow-md">
              <Settings className="w-20 h-20 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">HOD Settings</h1>
            <div className="h-1 w-20 bg-indigo-600 rounded mb-6"></div>
            <p className="text-gray-600 text-center max-w-2xl">
              At present, the HOD dashboard offers powerful tools for managing leave workflows and department-level oversight.
              In future updates, we aim to expand its functionality with the following features:
            </p>
          </div>

          {/* Future Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {futureFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="bg-indigo-50 p-4 flex justify-center">
                  <div className="bg-white rounded-full p-3 shadow-md">
                    {feature.icon}
                  </div>
                </div>
                <div className="p-5 border-t-4 border-indigo-600">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note with Card */}
          <div className="bg-indigo-50 rounded-lg p-6 shadow-md mb-10">
            <p className="text-center text-indigo-700 font-medium">
              These features aim to transform the HOD dashboard into a comprehensive administrative toolkit, enhancing efficiency, clarity, and collaboration within the academic environment.
              <br />
              <strong className="block mt-2 text-center">Made with <span className="text-red-500">❤️</span> by Lyraen</strong>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODSettings;