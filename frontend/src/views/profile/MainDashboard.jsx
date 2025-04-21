import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Settings, 
  LogOut, 
  User, 
  Bell, 
  Mail,
  Menu,
  X,
  Home,
  UserPlus,
  UserCheck,
  BarChart2,
  HelpCircle
} from 'lucide-react';

const MainMainDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('MainMainDashboard');
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} duration-300 bg-indigo-800 text-white flex flex-col h-full`}>
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold">EduLeave</h1>}
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-indigo-700">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <div className="flex-1 mt-6">
          <div className="px-4">
            <SidebarItem 
              icon={<Home size={20} />} 
              text="MainDashboard" 
              isOpen={isSidebarOpen} 
              isActive={activeMenu === 'MainDashboard'} 
              onClick={() => setActiveMenu('MainDashboard')}
            />
            <SidebarItem 
              icon={<Calendar size={20} />} 
              text="Leave Calendar" 
              isOpen={isSidebarOpen} 
              isActive={activeMenu === 'Leave Calendar'} 
              onClick={() => setActiveMenu('Leave Calendar')}
            />
            <SidebarItem 
              icon={<FileText size={20} />} 
              text="Apply Leave" 
              isOpen={isSidebarOpen} 
              isActive={activeMenu === 'Apply Leave'} 
              onClick={() => setActiveMenu('Apply Leave')}
            />
            <SidebarItem 
              icon={<Clock size={20} />} 
              text="Leave Status" 
              isOpen={isSidebarOpen} 
              isActive={activeMenu === 'Leave Status'} 
              onClick={() => setActiveMenu('Leave Status')}
            />
            <SidebarItem 
              icon={<UserCheck size={20} />} 
              text="Approve Leaves" 
              isOpen={isSidebarOpen} 
              isActive={activeMenu === 'Approve Leaves'} 
              onClick={() => setActiveMenu('Approve Leaves')}
            />
            <SidebarItem 
              icon={<BarChart2 size={20} />} 
              text="Reports" 
              isOpen={isSidebarOpen} 
              isActive={activeMenu === 'Reports'} 
              onClick={() => setActiveMenu('Reports')}
            />
          </div>
        </div>
        
        <div className="p-4">
          <SidebarItem 
            icon={<Settings size={20} />} 
            text="Settings" 
            isOpen={isSidebarOpen} 
            isActive={activeMenu === 'Settings'} 
            onClick={() => setActiveMenu('Settings')}
          />
          <SidebarItem 
            icon={<HelpCircle size={20} />} 
            text="Help" 
            isOpen={isSidebarOpen} 
            isActive={activeMenu === 'Help'} 
            onClick={() => setActiveMenu('Help')}
          />
          <SidebarItem 
            icon={<LogOut size={20} />} 
            text="Logout" 
            isOpen={isSidebarOpen} 
            isActive={false} 
            onClick={() => console.log('Logout')}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="font-semibold text-lg text-gray-700">
            {activeMenu}
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Mail size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
                Login
              </button>
              <button className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 text-sm font-medium">
                Register
              </button>
            </div>
          </div>
        </header>

        {/* MainDashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <MainDashboardCard 
                title="Available Leaves" 
                value="12 days" 
                icon={<Calendar size={24} className="text-green-500" />} 
                color="bg-green-100"
              />
              <MainDashboardCard 
                title="Pending Requests" 
                value="3" 
                icon={<Clock size={24} className="text-yellow-500" />} 
                color="bg-yellow-100"
              />
              <MainDashboardCard 
                title="Approved Leaves" 
                value="8" 
                icon={<UserCheck size={24} className="text-blue-500" />} 
                color="bg-blue-100"
              />
              <MainDashboardCard 
                title="Rejected Leaves" 
                value="1" 
                icon={<X size={24} className="text-red-500" />} 
                color="bg-red-100"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Leave Calendar</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                Calendar Component Placeholder
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Leave Requests</h2>
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-gray-500">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Duration</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <LeaveRequestRow 
                      name="John Smith"
                      type="Sick Leave"
                      duration="Apr 15-17"
                      status="Approved"
                    />
                    <LeaveRequestRow 
                      name="Sarah Johnson"
                      type="Casual Leave"
                      duration="Apr 22"
                      status="Pending"
                    />
                    <LeaveRequestRow 
                      name="Robert Williams"
                      type="Personal Leave"
                      duration="Apr 25-28"
                      status="Pending"
                    />
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Leave Balance</h2>
                <div className="space-y-4">
                  <ProgressBar label="Casual Leave" used={6} total={10} color="bg-blue-500" />
                  <ProgressBar label="Sick Leave" used={3} total={15} color="bg-green-500" />
                  <ProgressBar label="Personal Leave" used={2} total={5} color="bg-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, text, isOpen, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center py-3 px-4 rounded-lg w-full mb-1 ${
        isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700'
      }`}
    >
      <div className="flex items-center justify-center">{icon}</div>
      {isOpen && <span className="ml-3">{text}</span>}
    </button>
  );
};

// MainDashboard Card Component
const MainDashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Leave Request Row Component
const LeaveRequestRow = ({ name, type, duration, status }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="border-b">
      <td className="py-3">{name}</td>
      <td className="py-3">{type}</td>
      <td className="py-3">{duration}</td>
      <td className="py-3">
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
    </tr>
  );
};

// Progress Bar Component
const ProgressBar = ({ label, used, total, color }) => {
  const percentage = (used / total) * 100;
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-gray-500">{used}/{total} days</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${color} h-2.5 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MainMainDashboard;