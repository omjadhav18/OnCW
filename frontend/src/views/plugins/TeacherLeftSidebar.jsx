import React, { useState } from 'react';
import { 
  Home, 
  User, 
  FileText, 
  Bell, 
  Clock,
  AlertCircle,
  Menu,
  X,
  Users,
  BarChart2,
  Settings,
  CheckSquare,
  LogOut,
  FileOutput
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';

const TeacherLeftSidebar = ({ userRole = { isTeacher: true, isCC: false, isHOD: false } }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  const handleLogout = async () => {
    const lt = logout();
    navigate("/");
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
          {/* Common menu items for all teachers */}
          <NavItem 
            to="/teacher-dash" 
            icon={<Home size={20} />} 
            label="Dashboard" 
            isCollapsed={isCollapsed} 
            isActive={isActiveRoute("/teacher-dash")}
          />
          <NavItem 
            to="/teacher-profile" 
            icon={<User size={20} />} 
            label="My Profile" 
            isCollapsed={isCollapsed} 
            isActive={isActiveRoute("/teacher-profile")}
          />
          <NavItem 
            to="/teacher-authority-review" 
            icon={<FileText size={20} />} 
            label="Authority Applications" 
            isCollapsed={isCollapsed} 
            isActive={isActiveRoute("/teacher-authority-review" || "/teacher-authority/review/detail/:id")}
          />
          {/* Teacher Report Generation - visible to all teachers */}
          <NavItem 
            to="/teacher-report/generation" 
            icon={<FileOutput size={20} />} 
            label="Teacher Reports" 
            isCollapsed={isCollapsed} 
            isActive={isActiveRoute("/teacher-report/generation")}
          />
          {userRole.isCC && (
            <>
              <NavItem 
                to="/teacher-coordinator-review" 
                icon={<CheckSquare size={20} />} 
                label="CC Applications" 
                isCollapsed={isCollapsed} 
                isActive={isActiveRoute("/teacher-coordinator-review")}
              />
              {/* CC Report Generation - visible only to Course Coordinators */}
              <NavItem 
                to="/teacher-cc-report/generation" 
                icon={<FileOutput size={20} />} 
                label="CC Reports" 
                isCollapsed={isCollapsed} 
                isActive={isActiveRoute("/teacher-cc-report/generation")}
              />
            </>
          )}
          <NavItem 
            to="/teacher-notifications" 
            icon={<Bell size={20} />} 
            label="Notifications" 
            isCollapsed={isCollapsed} 
            isActive={isActiveRoute("/teacher-notifications")}
          />
          <NavItem 
            to="/teacher-attendance-alerts" 
            icon={<AlertCircle size={20} />} 
            label="Attendance Alerts" 
            isCollapsed={isCollapsed} 
            isActive={isActiveRoute("/teacher-attendance-alerts")}
          />
          
          {/* HOD specific menu items */}
          {userRole.isHOD && (
            <>
              <div className={`mt-4 mb-2 ${isCollapsed ? 'w-full border-t border-indigo-500' : 'border-t border-indigo-500'}`}>
                {!isCollapsed && <p className="text-xs uppercase text-indigo-300 mt-4 mb-2 px-2">HOD Tools</p>}
              </div>
              
              <NavItem 
                to="/teacher-hod-review" 
                icon={<Users size={20} />} 
                label="HOD Applications" 
                isCollapsed={isCollapsed} 
                isActive={isActiveRoute("/teacher-hod-review")}
              />
              <NavItem 
                to="/teacher-hod/leave-logs" 
                icon={<Clock size={20} />} 
                label="Leave Logs"  
                isCollapsed={isCollapsed} 
                isActive={isActiveRoute("/teacher-hod/leave-logs")} 
              />
              <NavItem 
                to="/teacher-hod/analytics" 
                icon={<BarChart2 size={20} />} 
                label="Analytics" 
                isCollapsed={isCollapsed} 
                isActive={isActiveRoute("/teacher-hod/analytics")}
              />
              {/* HOD Report Generation - visible only to HODs */}
              <NavItem 
                to="/teacher-hod-report/generation" 
                icon={<FileOutput size={20} />} 
                label="HOD Reports" 
                isCollapsed={isCollapsed} 
                isActive={isActiveRoute("/teacher-hod-report/generation")}
              />
              <NavItem 
                to="/teacher-hod-settings" 
                icon={<Settings size={20} />} 
                label="HOD Settings" 
                isCollapsed={isCollapsed} 
                isActive={isActiveRoute("/teacher-hod-settings")}
              />
            </>
          )}
          
          {/* Logout button at the bottom */}
          <div className="mt-auto">
            <ButtonNavItem 
              onClick={handleLogout} 
              icon={<LogOut size={20} />} 
              label="Logout" 
              isCollapsed={isCollapsed} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, isCollapsed, isActive }) => {
  return (
    <Link to={to} className="block">
      <div className={`flex items-center py-2 px-2 rounded-md cursor-pointer ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-500'} ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
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

const ButtonNavItem = ({ onClick, icon, label, isCollapsed }) => {
  return (
    <div onClick={onClick} className="block cursor-pointer">
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

export default TeacherLeftSidebar;