
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import Users from '@/components/Users';
import Students from '@/components/Students';
import Parents from '@/components/Parents';
import Teachers from '@/components/Teachers';
import Classes from '@/components/Classes';
import Subjects from '@/components/Subjects';
import Institutes from '@/components/Institutes';
import AttendanceMarkers from '@/components/AttendanceMarkers';
import Attendance from '@/components/Attendance';
import AttendanceMarking from '@/components/AttendanceMarking';
import QRAttendance from '@/components/QRAttendance';
import Grades from '@/components/Grades';
import Grading from '@/components/Grading';
import Lectures from '@/components/Lectures';
import LiveLectures from '@/components/LiveLectures';
import Exams from '@/components/Exams';
import Results from '@/components/Results';
import Profile from '@/components/Profile';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onMenuClick={handleMenuClick} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user, login } = useAuth();

  const handleLogin = (userData: any) => {
    login(userData);
  };

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="/parents" element={<ProtectedRoute><Parents /></ProtectedRoute>} />
        <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
        <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
        <Route path="/institutes" element={<ProtectedRoute><Institutes /></ProtectedRoute>} />
        <Route path="/attendance-markers" element={<ProtectedRoute><AttendanceMarkers /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/attendance-marking" element={<ProtectedRoute><AttendanceMarking /></ProtectedRoute>} />
        <Route path="/qr-attendance" element={<ProtectedRoute><QRAttendance /></ProtectedRoute>} />
        <Route path="/grades" element={<ProtectedRoute><Grades /></ProtectedRoute>} />
        <Route path="/grading" element={<ProtectedRoute><Grading /></ProtectedRoute>} />
        <Route path="/lectures" element={<ProtectedRoute><Lectures /></ProtectedRoute>} />
        <Route path="/live-lectures" element={<ProtectedRoute><LiveLectures /></ProtectedRoute>} />
        <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <AppContent />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
