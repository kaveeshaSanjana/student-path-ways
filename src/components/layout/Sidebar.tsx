
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  School,
  ClipboardList,
  BarChart3,
  Settings,
  User,
  Building2,
  QrCode,
  X,
  Award,
  Video,
  LogOut,
  Menu,
  FileText
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar = ({ isOpen, onClose, currentPage, onPageChange }: SidebarProps) => {
  const { user, selectedInstitute, selectedClass, selectedSubject, logout } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      permission: 'view-dashboard'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      permission: 'view-users'
    },
    {
      id: 'students',
      label: 'Students',
      icon: GraduationCap,
      permission: 'view-students'
    },
    {
      id: 'teachers',
      label: 'Teachers',
      icon: UserCheck,
      permission: 'view-teachers'
    },
    {
      id: 'grades',
      label: 'Grades',
      icon: Award,
      permission: 'view-grades'
    },
    {
      id: 'classes',
      label: 'All Classes',
      icon: School,
      permission: 'view-classes'
    },
    {
      id: 'subjects',
      label: 'All Subjects',
      icon: BookOpen,
      permission: 'view-subjects'
    },
    // Only show selection options for non-SystemAdmin users
    ...(user?.role !== 'SystemAdmin' ? [
      {
        id: 'select-class',
        label: 'Select Class',
        icon: School,
        permission: 'view-classes'
      },
      {
        id: 'select-subject',
        label: 'Select Subject',
        icon: BookOpen,
        permission: 'view-subjects'
      }
    ] : []),
    {
      id: 'institutes',
      label: 'Institutes',
      icon: Building2,
      permission: 'view-institutes'
    }
  ];

  const attendanceItems = [
    {
      id: 'attendance',
      label: 'View Attendance',
      icon: ClipboardList,
      permission: 'view-attendance'
    },
    {
      id: 'attendance-marking',
      label: 'Mark Attendance',
      icon: UserCheck,
      permission: 'mark-attendance'
    },
    {
      id: 'attendance-markers',
      label: 'Attendance Markers',
      icon: Users,
      permission: 'manage-attendance-markers'
    },
    {
      id: 'qr-attendance',
      label: 'QR Attendance',
      icon: QrCode,
      permission: 'mark-attendance'
    }
  ];

  const systemItems = [
    {
      id: 'grading',
      label: 'Grading',
      icon: BarChart3,
      permission: 'view-grading'
    },
    {
      id: 'lectures',
      label: 'Lectures',
      icon: BookOpen,
      permission: 'view-lectures'
    },
    {
      id: 'live-lectures',
      label: 'Live Lectures',
      icon: Video,
      permission: 'view-lectures'
    },
    {
      id: 'exams',
      label: 'Exams',
      icon: FileText,
      permission: 'view-exams'
    },
    {
      id: 'results',
      label: 'Results',
      icon: ClipboardList,
      permission: 'view-results'
    }
  ];

  const settingsItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      permission: 'view-profile'
    },
    {
      id: 'institute-details',
      label: 'Institute Details',
      icon: Building2,
      permission: 'view-institute-details'
    }
  ];

  const userRole = user?.role || 'Student';

  const filterItemsByPermission = (items: any[]) => {
    return items.filter(item => AccessControl.hasPermission(userRole as any, item.permission));
  };

  const handleItemClick = (itemId: string) => {
    onPageChange(itemId);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const SidebarSection = ({ title, items }: { title: string; items: any[] }) => {
    const filteredItems = filterItemsByPermission(items);
    
    if (filteredItems.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
          {title}
        </h3>
        <div className="space-y-1">
          {filteredItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start h-10 px-3 ${
                currentPage === item.id 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-r-2 border-blue-600' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleItemClick(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-screen
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <School className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg text-gray-900 dark:text-white">EduSystem</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            title="Close Sidebar"
          >
            <X className="h-4 w-4 lg:hidden" />
            <Menu className="h-4 w-4 hidden lg:block" />
          </Button>
        </div>

        {/* Context Info - Only show for non-SystemAdmin users */}
        {user?.role !== 'SystemAdmin' && (selectedInstitute || selectedClass || selectedSubject) && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
            {selectedInstitute && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                <span className="font-medium">Institute:</span> {selectedInstitute.name}
              </div>
            )}
            {selectedClass && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                <span className="font-medium">Class:</span> {selectedClass.name}
              </div>
            )}
            {selectedSubject && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                <span className="font-medium">Subject:</span> {selectedSubject.name}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-2">
            <SidebarSection title="Main" items={menuItems} />
            <SidebarSection title="Attendance" items={attendanceItems} />
            <SidebarSection title="Academic" items={systemItems} />
            <SidebarSection title="Settings" items={settingsItems} />
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Logged in as: <span className="font-medium">{user?.name}</span>
            <br />
            Role: <span className="font-medium">{user?.role}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
