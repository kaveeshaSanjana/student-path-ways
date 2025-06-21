
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import InstituteSelector from '@/components/InstituteSelector';
import Dashboard from '@/components/Dashboard';
import Lectures from '@/components/Lectures';
import Results from '@/components/Results';
import AttendanceMarking from '@/components/AttendanceMarking';
import DataTable from '@/components/ui/data-table';

const MainContent = () => {
  const { selectedInstitute } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    if (!selectedInstitute && currentPage !== 'institutes') {
      return <InstituteSelector />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'institutes':
        return <InstituteSelector />;
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
        return (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">Profile management coming soon...</p>
            </div>
          </div>
        );
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
        
        <main className="flex-1 p-4 lg:p-8">
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
