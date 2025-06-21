
import React from 'react';
import DataTable from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Badge } from '@/components/ui/badge';

const mockSubjects = [
  {
    id: '1',
    name: 'Mathematics',
    code: 'MATH101',
    type: 'Mandatory',
    teacher: 'Dr. John Smith',
    periodsPerWeek: 6,
    credits: 4,
    status: 'Active'
  },
  {
    id: '2',
    name: 'Physics',
    code: 'PHY101',
    type: 'Mandatory',
    teacher: 'Prof. Sarah Wilson',
    periodsPerWeek: 5,
    credits: 4,
    status: 'Active'
  },
  {
    id: '3',
    name: 'Chemistry',
    code: 'CHEM101',
    type: 'Mandatory',
    teacher: 'Dr. Michael Brown',
    periodsPerWeek: 5,
    credits: 4,
    status: 'Active'
  },
  {
    id: '4',
    name: 'Computer Science',
    code: 'CS101',
    type: 'Elective',
    teacher: 'Ms. Emily Davis',
    periodsPerWeek: 4,
    credits: 3,
    status: 'Active'
  },
  {
    id: '5',
    name: 'Art & Design',
    code: 'ART101',
    type: 'Elective',
    teacher: 'Mr. David Johnson',
    periodsPerWeek: 3,
    credits: 2,
    status: 'Inactive'
  }
];

const Subjects = () => {
  const { user } = useAuth();

  const subjectsColumns = [
    { key: 'name', header: 'Subject Name' },
    { key: 'code', header: 'Subject Code' },
    { key: 'teacher', header: 'Teacher' },
    { 
      key: 'type', 
      header: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'Mandatory' ? 'default' : 'outline'}>
          {value}
        </Badge>
      )
    },
    { key: 'periodsPerWeek', header: 'Periods/Week' },
    { key: 'credits', header: 'Credits' },
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

  const handleAddSubject = () => {
    console.log('Add new subject');
  };

  const handleEditSubject = (subject: any) => {
    console.log('Edit subject:', subject);
  };

  const handleDeleteSubject = (subject: any) => {
    console.log('Delete subject:', subject);
  };

  const canCreate = AccessControl.hasPermission(user?.role || '', 'create-subject');
  const canEdit = AccessControl.hasPermission(user?.role || '', 'edit-subject');
  const canDelete = AccessControl.hasPermission(user?.role || '', 'delete-subject');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Subjects Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage subjects, teachers assignment, and curriculum
        </p>
      </div>

      <DataTable
        title="Subjects"
        data={mockSubjects}
        columns={subjectsColumns}
        onAdd={canCreate ? handleAddSubject : undefined}
        onEdit={canEdit ? handleEditSubject : undefined}
        onDelete={canDelete ? handleDeleteSubject : undefined}
        searchPlaceholder="Search subjects..."
      />
    </div>
  );
};

export default Subjects;
