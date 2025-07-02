
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  Users, 
  GraduationCap, 
  Calendar,
  BookOpen,
  ClipboardCheck,
  UserCheck,
  Building2,
  Settings,
  LogOut,
  Home,
  UserCog,
  UsersIcon,
  School
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  const systemAdminNavItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/users', icon: UserCog, label: 'Users' },
    { path: '/institutes', icon: Building2, label: 'Institutes' },
    { path: '/students', icon: GraduationCap, label: 'Students' },
    { path: '/parents', icon: UsersIcon, label: 'Parents' },
    { path: '/attendance-markers', icon: UserCheck, label: 'Attendance Markers' },
  ];

  const instituteAdminNavItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/classes', icon: School, label: 'Classes' },
    { path: '/teachers', icon: Users, label: 'Teachers' },
    { path: '/students', icon: GraduationCap, label: 'Students' },
    { path: '/subjects', icon: BookOpen, label: 'Subjects' },
    { path: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
    { path: '/grades', icon: BarChart3, label: 'Grades' },
    { path: '/lectures', icon: Calendar, label: 'Lectures' },
    { path: '/exams', icon: BookOpen, label: 'Exams' },
    { path: '/results', icon: BarChart3, label: 'Results' },
  ];

  const teacherNavItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/attendance-marking', icon: ClipboardCheck, label: 'Mark Attendance' },
    { path: '/qr-attendance', icon: UserCheck, label: 'QR Attendance' },
    { path: '/live-lectures', icon: Calendar, label: 'Live Lectures' },
    { path: '/grading', icon: BarChart3, label: 'Grading' },
  ];

  const attendanceMarkerNavItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/attendance-marking', icon: ClipboardCheck, label: 'Mark Attendance' },
    { path: '/qr-attendance', icon: UserCheck, label: 'QR Attendance' },
  ];

  let navItems = [];
  switch (user?.role) {
    case 'SystemAdmin':
      navItems = systemAdminNavItems;
      break;
    case 'InstituteAdmin':
      navItems = instituteAdminNavItems;
      break;
    case 'Teacher':
      navItems = teacherNavItems;
      break;
    case 'AttendanceMarker':
      navItems = attendanceMarkerNavItems;
      break;
    default:
      navItems = [{ path: '/', icon: Home, label: 'Dashboard' }];
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">EduSystem</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {user?.role === 'SystemAdmin' && 'System Administrator'}
          {user?.role === 'InstituteAdmin' && 'Institute Administrator'}
          {user?.role === 'Teacher' && 'Teacher Dashboard'}
          {user?.role === 'AttendanceMarker' && 'Attendance Marker'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(item.path)
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
                {user?.lastName?.charAt(0) || user?.name?.split(' ')[1]?.charAt(0) || ''}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
