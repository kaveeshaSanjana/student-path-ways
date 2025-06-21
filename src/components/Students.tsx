
import React from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';

const mockStudents = [
  {
    id: '1',
    studentId: 'STU001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    class: 'Grade 10-A',
    enrollmentDate: '2024-01-15',
    status: 'Active',
    guardian: 'Jane Doe',
    guardianPhone: '+1 (555) 987-6543'
  },
  {
    id: '2',
    studentId: 'STU002',
    name: 'Sarah Smith',
    email: 'sarah.smith@email.com',
    phone: '+1 (555) 234-5678',
    class: 'Grade 11-S',
    enrollmentDate: '2024-01-10',
    status: 'Active',
    guardian: 'Mike Smith',
    guardianPhone: '+1 (555) 876-5432'
  },
  {
    id: '3',
    studentId: 'STU003',
    name: 'Michael Johnson',
    email: 'michael.j@email.com',
    phone: '+1 (555) 345-6789',
    class: 'Grade 12-C',
    enrollmentDate: '2023-09-01',
    status: 'Inactive',
    guardian: 'Lisa Johnson',
    guardianPhone: '+1 (555) 765-4321'
  }
];

const Students = () => {
  const { user } = useAuth();

  const studentsColumns = [
    { key: 'studentId', header: 'Student ID' },
    { key: 'name', header: 'Full Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'class', header: 'Class' },
    { key: 'guardian', header: 'Guardian' },
    { key: 'guardianPhone', header: 'Guardian Phone' },
    { key: 'enrollmentDate', header: 'Enrollment Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    }
  ];

  const handleAddStudent = () => {
    console.log('Add new student');
  };

  const handleEditStudent = (student: any) => {
    console.log('Edit student:', student);
  };

  const handleDeleteStudent = (student: any) => {
    console.log('Delete student:', student);
  };

  const handleViewStudent = (student: any) => {
    console.log('View student details:', student);
  };

  const canCreate = AccessControl.hasPermission(user?.role || 'Student' as const, 'create-student');
  const canEdit = AccessControl.hasPermission(user?.role || 'Student' as const, 'edit-student');
  const canDelete = AccessControl.hasPermission(user?.role || 'Student' as const, 'delete-student');
  const canView = AccessControl.hasPermission(user?.role || 'Student' as const, 'view-student-details');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Students Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage student enrollments, information, and academic records
        </p>
      </div>

      <DataTable
        title="Students"
        data={mockStudents}
        columns={studentsColumns}
        onAdd={canCreate ? handleAddStudent : undefined}
        onEdit={canEdit ? handleEditStudent : undefined}
        onDelete={canDelete ? handleDeleteStudent : undefined}
        onView={canView ? handleViewStudent : undefined}
        searchPlaceholder="Search students..."
      />
    </div>
  );
};

export default Students;
