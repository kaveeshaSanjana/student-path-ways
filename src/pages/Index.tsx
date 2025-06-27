
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/Dashboard';
import Users from '@/components/Users';
import Students from '@/components/Students';
import Teachers from '@/components/Teachers';
import Grades from '@/components/Grades';
import Classes from '@/components/Classes';
import Subjects from '@/components/Subjects';
import Institutes from '@/components/Institutes';
import Grading from '@/components/Grading';
import Attendance from '@/components/Attendance';
import AttendanceMarking from '@/components/AttendanceMarking';
import AttendanceMarkers from '@/components/AttendanceMarkers';
import QRAttendance from '@/components/QRAttendance';
import Lectures from '@/components/Lectures';
import LiveLectures from '@/components/LiveLectures';
import Exams from '@/components/Exams';
import Results from '@/components/Results';
import Profile from '@/components/Profile';
import InstituteDetails from '@/components/InstituteDetails';
import Login from '@/components/Login';
import InstituteSelector from '@/components/InstituteSelector';
import ClassSelector from '@/components/ClassSelector';
import SubjectSelector from '@/components/SubjectSelector';

const AppContent = () => {
  const { user, login, selectedInstitute, selectedClass, selectedSubject } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (userData: any) => {
    login(userData);
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const renderComponent = () => {
    // System Admin doesn't need institute/class/subject selection flow
    if (user?.role === 'SystemAdmin') {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard />;
        case 'users':
          return <Users />;
        case 'students':
          return <Students />;
        case 'teachers':
          return <Teachers />;
        case 'grades':
          return <Grades />;
        case 'classes':
          return <Classes apiLevel="institute" />;
        case 'subjects':
          return <Subjects apiLevel="institute" />;
        case 'institutes':
          return <Institutes />;
        case 'grading':
        case 'grades-table':
        case 'create-grade':
        case 'assign-grade-classes':
        case 'view-grade-classes':
          return <Grading />;
        case 'attendance':
          return <Attendance />;
        case 'attendance-marking':
          return <AttendanceMarking onNavigate={setCurrentPage} />;
        case 'attendance-markers':
          return <AttendanceMarkers />;
        case 'qr-attendance':
          return <QRAttendance />;
        case 'lectures':
          return <Lectures />;
        case 'live-lectures':
          return <LiveLectures />;
        case 'exams':
          return <Exams />;
        case 'results':
          return <Results />;
        case 'profile':
          return <Profile />;
        case 'institute-details':
          return <InstituteDetails />;
        default:
          return <Dashboard />;
      }
    }

    // First check if user needs to select institute
    if (!selectedInstitute && currentPage !== 'institutes' && currentPage !== 'select-institute') {
      return <InstituteSelector />;
    }

    // Handle class selector routing
    if (currentPage === 'select-class') {
      return <ClassSelector />;
    }

    // Handle subject selector routing
    if (currentPage === 'select-subject') {
      return <SubjectSelector />;
    }

    // If class is required for current page but not selected
    const classRequiredPages = ['attendance-marking', 'grading'];
    if (selectedInstitute && !selectedClass && classRequiredPages.includes(currentPage)) {
      return <ClassSelector />;
    }

    // If subject is required for current page but not selected
    const subjectRequiredPages = ['lectures'];
    if (selectedClass && !selectedSubject && subjectRequiredPages.includes(currentPage)) {
      return <SubjectSelector />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'students':
        return <Students />;
      case 'teachers':
        return <Teachers />;
      case 'grades':
        return <Grades />;
      case 'classes':
        // All classes view - API calls based on selected institute level
        return <Classes apiLevel="institute" />;
      case 'subjects':
        // All subjects view - API calls based on selected institute/class level  
        return <Subjects apiLevel={selectedClass ? "class" : "institute"} />;
      case 'institutes':
        return <Institutes />;
      case 'select-institute':
        return <InstituteSelector />;
      case 'grading':
      case 'grades-table':
      case 'create-grade':
      case 'assign-grade-classes':
      case 'view-grade-classes':
        return <Grading />;
      case 'attendance':
        return <Attendance />;
      case 'attendance-marking':
        return <AttendanceMarking onNavigate={setCurrentPage} />;
      case 'attendance-markers':
        return <AttendanceMarkers />;
      case 'qr-attendance':
        return <QRAttendance />;
      case 'lectures':
        return <Lectures />;
      case 'live-lectures':
        return <LiveLectures />;
      case 'exams':
        return <Exams />;
      case 'results':
        return <Results />;
      case 'profile':
        return <Profile />;
      case 'institute-details':
        return <InstituteDetails />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex w-full h-screen">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={handleMenuClick} />
          <main className="flex-1 overflow-auto p-6">
            {renderComponent()}
          </main>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
