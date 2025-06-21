import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';

const mockOnlineAttendance = [
  {
    id: '1',
    date: '2024-01-15',
    subject: 'Mathematics',
    class: 'Grade 10-A',
    present: 25,
    absent: 3,
    total: 28,
    percentage: '89.3%',
    status: 'Completed'
  },
  {
    id: '2',
    date: '2024-01-15',
    subject: 'Physics',
    class: 'Grade 11-S',
    present: 20,
    absent: 3,
    total: 23,
    percentage: '87.0%',
    status: 'Completed'
  }
];

const mockPhysicalAttendance = [
  {
    id: '1',
    date: '2024-01-14',
    subject: 'Chemistry Lab',
    class: 'Grade 12-S',
    present: 18,
    absent: 2,
    total: 20,
    percentage: '90.0%',
    status: 'Completed'
  },
  {
    id: '2',
    date: '2024-01-14',
    subject: 'Biology Lab',
    class: 'Grade 11-S',
    present: 22,
    absent: 1,
    total: 23,
    percentage: '95.7%',
    status: 'Completed'
  }
];

const Attendance = () => {
  const { user } = useAuth();

  const attendanceColumns = [
    { key: 'date', header: 'Date' },
    { key: 'subject', header: 'Subject' },
    { key: 'class', header: 'Class' },
    { key: 'present', header: 'Present' },
    { key: 'absent', header: 'Absent' },
    { key: 'total', header: 'Total' },
    { key: 'percentage', header: 'Percentage' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Completed' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    }
  ];

  const handleViewDetails = (record: any) => {
    console.log('View attendance details:', record);
  };

  const handleExport = (record: any) => {
    console.log('Export attendance:', record);
  };

  const canExport = AccessControl.hasPermission(user?.role || 'Student' as const, 'export-attendance');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Attendance Records
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage attendance data for online and physical classes
        </p>
      </div>

      <Tabs defaultValue="online" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="online">Online Classes</TabsTrigger>
          <TabsTrigger value="physical">Physical Classes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="online" className="space-y-4">
          <DataTable
            title="Online Class Attendance"
            data={mockOnlineAttendance}
            columns={attendanceColumns}
            onView={handleViewDetails}
            onExport={canExport ? handleExport : undefined}
            searchPlaceholder="Search online attendance..."
          />
        </TabsContent>
        
        <TabsContent value="physical" className="space-y-4">
          <DataTable
            title="Physical Class Attendance"
            data={mockPhysicalAttendance}
            columns={attendanceColumns}
            onView={handleViewDetails}
            onExport={canExport ? handleExport : undefined}
            searchPlaceholder="Search physical attendance..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
