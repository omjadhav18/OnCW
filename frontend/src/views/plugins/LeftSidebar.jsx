import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  Bell, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  User,
  Clock,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { logout } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    const lt = logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`bg-indigo-600 text-white fixed top-0 left-0 h-screen transition-all duration-300 overflow-y-auto z-10 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-indigo-500">
        {!isCollapsed && <h2 className="text-xl font-bold">EduLeave</h2>}
        <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-indigo-500">
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <div className="py-4">
        <div className={`flex flex-col ${isCollapsed ? 'items-center' : 'px-4 space-y-1'}`}>
          <NavItem to="/student-dash" icon={<Home size={20} />} label="Dashboard" isCollapsed={isCollapsed} />
          <NavItem to="/profile-student" icon={<User size={20} />} label="My Profile" isCollapsed={isCollapsed} />
          <NavItem to="/leave-form" icon={<FileText size={20} />} label="Leave Application" isCollapsed={isCollapsed} />
          <NavItem to="/student-calendar" icon={<Calendar size={20} />} label="Leave Calendar" isCollapsed={isCollapsed} />
          <NavItem to="/student-leave-history" icon={<Clock size={20} />} label="Leave History" isCollapsed={isCollapsed} />
          <NavItem to="/student-notifications" icon={<Bell size={20} />} label="Notifications" isCollapsed={isCollapsed} />
          <NavItem to="/student-help" icon={<HelpCircle size={20} />} label="Help & Support" isCollapsed={isCollapsed} />
          
          <div className="border-t border-indigo-500 my-4"></div>
          
          {/* <NavItem to="/login" icon={<LogIn size={20} />} label="Login" isCollapsed={isCollapsed} /> */}
          {/* Use ButtonNavItem instead of NavItem for logout */}
          <ButtonNavItem onClick={handleLogout} icon={<LogOut size={20} />} label="Logout" isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, isCollapsed }) => {
  return (
    <Link to={to} className="block">
      <div className={`flex items-center py-2 px-2 rounded-md cursor-pointer hover:bg-indigo-500 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
        <div className="text-white">{icon}</div>
        {!isCollapsed && <span>{label}</span>}
        {isCollapsed && (
          <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded ml-2 opacity-0 hover:opacity-100">
            {label}
          </div>
        )}
      </div>
    </Link>
  );
};

// Added a separate component for button-based navigation items (like logout)
const ButtonNavItem = ({ onClick, icon, label, isCollapsed }) => {
  return (
    <div className="block" onClick={onClick}>
      <div className={`flex items-center py-2 px-2 rounded-md cursor-pointer hover:bg-indigo-500 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
        <div className="text-white">{icon}</div>
        {!isCollapsed && <span>{label}</span>}
        {isCollapsed && (
          <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded ml-2 opacity-0 hover:opacity-100">
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;