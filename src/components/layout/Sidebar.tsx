
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { 
  Home, 
  BookUser, 
  CreditCard, 
  User, 
  GraduationCap,
  Calendar,
  FileText,
  Users,
  Settings,
  Moon,
  Sun,
  ArrowLeft,
  LogOut,
  BookOpen,
  UserCheck,
  Building,
  UserPlus,
  GraduationCapIcon,
  ClipboardList,
  CalendarCheck
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar = ({ isOpen, onClose, currentPage, onPageChange }: SidebarProps) => {
  const { 
    user, 
    logout,
    selectedInstitute, 
    selectedClass, 
    selectedSubject, 
    isDarkMode, 
    toggleDarkMode, 
    setSelectedInstitute, 
    setSelectedClass, 
    setSelectedSubject 
  } = useAuth();

  const handleBackNavigation = () => {
    if (selectedSubject) {
      setSelectedSubject(null);
    } else if (selectedClass) {
      setSelectedClass(null);
    } else if (selectedInstitute) {
      setSelectedInstitute(null);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getNavigationItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', page: 'dashboard' },
    ];

    // For Attendance Markers - simplified menu
    if (user?.role === 'AttendanceMarker') {
      return [
        { icon: Home, label: 'Dashboard', page: 'dashboard' },
        { icon: CalendarCheck, label: 'Mark Attendance', page: 'attendance-marking' },
        { icon: CreditCard, label: 'Payments', page: 'payments' },
        { icon: User, label: 'Profile', page: 'profile' },
      ];
    }

    // SystemAdmin gets institute management
    if (user?.role === 'SystemAdmin') {
      baseItems.push({ icon: Building, label: 'All Institutes', page: 'institutes' });
    }

    // Add institute selection if no institute selected
    if (!selectedInstitute) {
      baseItems.push({ icon: BookUser, label: 'Select Institute', page: 'select-institute' });
    } else {
      baseItems.push({ icon: BookUser, label: 'Institute Details', page: 'institute-details' });
    }

    // Add more options if institute is selected
    if (selectedInstitute) {
      // Classes - visible to all roles with view permission
      if (AccessControl.hasPermission(user?.role || '', 'view-classes')) {
        baseItems.push({ icon: Users, label: 'Select Class', page: 'classes' });
      }

      // Subjects - visible to all roles with view permission (only if class selected)
      if (selectedClass && AccessControl.hasPermission(user?.role || '', 'view-subjects')) {
        baseItems.push({ icon: BookOpen, label: 'Select Subject', page: 'subjects' });
      }

      // Students management
      if (AccessControl.hasPermission(user?.role || '', 'view-students')) {
        baseItems.push({ icon: GraduationCapIcon, label: 'Students', page: 'students' });
      }

      // Teachers management
      if (AccessControl.hasPermission(user?.role || '', 'view-teachers')) {
        baseItems.push({ icon: UserCheck, label: 'Teachers', page: 'teachers' });
      }

      // Attendance Markers management
      if (AccessControl.hasPermission(user?.role || '', 'view-attendance-markers')) {
        baseItems.push({ icon: UserPlus, label: 'Attendance Markers', page: 'attendance-markers' });
      }

      // Lectures
      if (AccessControl.hasPermission(user?.role || '', 'view-lectures')) {
        baseItems.push({ icon: GraduationCap, label: 'Lectures', page: 'lectures' });
      }

      // Results
      if (AccessControl.hasPermission(user?.role || '', 'view-results')) {
        baseItems.push({ icon: FileText, label: 'Results', page: 'results' });
      }

      // Attendance (viewing data)
      if (AccessControl.hasPermission(user?.role || '', 'view-attendance')) {
        baseItems.push({ icon: Calendar, label: 'Attendance', page: 'attendance' });
      }

      // Attendance Marking (for marking attendance)
      if (AccessControl.hasPermission(user?.role || '', 'mark-attendance')) {
        baseItems.push({ icon: CalendarCheck, label: 'Mark Attendance', page: 'attendance-marking' });
      }

      // Users management - only for admins
      if (AccessControl.hasPermission(user?.role || '', 'view-users')) {
        baseItems.push({ icon: ClipboardList, label: 'User Management', page: 'users' });
      }
    }

    // Always add these at the end
    baseItems.push(
      { icon: CreditCard, label: 'Payments', page: 'payments' },
      { icon: User, label: 'Profile', page: 'profile' }
    );

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">EduManage</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="p-2"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* User Info */}
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
            </div>

            {/* Breadcrumb */}
            <div className="mt-3 text-xs text-blue-600 dark:text-blue-400">
              {selectedInstitute && (
                <div className="flex items-center gap-2">
                  {(selectedClass || selectedSubject) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackNavigation}
                      className="p-1 h-auto"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </Button>
                  )}
                  <div>
                    <span>{selectedInstitute.name}</span>
                    {selectedClass && (
                      <>
                        <span className="mx-1">→</span>
                        <span>{selectedClass.name}</span>
                      </>
                    )}
                    {selectedSubject && (
                      <>
                        <span className="mx-1">→</span>
                        <span>{selectedSubject.name}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400",
                    currentPage === item.page && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  )}
                  onClick={() => {
                    onPageChange(item.page);
                    onClose(); // Close sidebar on mobile after selection
                  }}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
