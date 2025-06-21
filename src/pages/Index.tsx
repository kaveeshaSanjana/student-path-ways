
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Login from '@/components/Login';
import InstituteSelector from '@/components/InstituteSelector';
import Dashboard from '@/components/Dashboard';
import Classes from '@/components/Classes';
import Subjects from '@/components/Subjects';
import Users from '@/components/Users';
import Lectures from '@/components/Lectures';
import Results from '@/components/Results';
import AttendanceMarking from '@/components/AttendanceMarking';
import Profile from '@/components/Profile';
import DataTable from '@/components/ui/data-table';

const MainContent = () => {
  const { user, login, selectedInstitute } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Show login if no user is authenticated
  if (!user) {
    return <Login onLogin={login} />;
  }

  const renderPage = () => {
    if (!selectedInstitute && currentPage !== 'institutes') {
      return <InstituteSelector />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'institutes':
        return <InstituteSelector />;
      case 'classes':
        return <Classes />;
      case 'subjects':
        return <Subjects />;
      case 'users':
        return <Users />;
      case 'lectures':
        return <Lectures />;
      case 'results':
        return <Results />;
      case 'attendance':
        return <AttendanceMarking />;
      case 'payments':
        return (
          <DataTable
            title="Payment Records"
            data={[
              { id: '1', amount: '$250', date: '2024-01-15', status: 'Paid', type: 'Tuition Fee' },
              { id: '2', amount: '$50', date: '2024-01-20', status: 'Pending', type: 'Lab Fee' }
            ]}
            columns={[
              { key: 'type', header: 'Payment Type' },
              { key: 'amount', header: 'Amount' },
              { key: 'date', header: 'Date' },
              { key: 'status', header: 'Status' }
            ]}
            searchPlaceholder="Search payments..."
          />
        );
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex w-full">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default Index;
