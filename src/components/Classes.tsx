
import React from 'react';
import DataTable from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Badge } from '@/components/ui/badge';

const mockClasses = [
  {
    id: '1',
    name: 'Grade 10 - A',
    code: 'G10A',
    capacity: 30,
    enrolled: 28,
    teacher: 'John Smith',
    room: 'Room 101',
    status: 'Active',
    subjects: 8
  },
  {
    id: '2',
    name: 'Grade 10 - B',
    code: 'G10B',
    capacity: 30,
    enrolled: 25,
    teacher: 'Sarah Johnson',
    room: 'Room 102',
    status: 'Active',
    subjects: 8
  },
  {
    id: '3',
    name: 'Grade 11 - Science',
    code: 'G11S',
    capacity: 25,
    enrolled: 23,
    teacher: 'Michael Brown',
    room: 'Room 201',
    status: 'Active',
    subjects: 10
  },
  {
    id: '4',
    name: 'Grade 12 - Commerce',
    code: 'G12C',
    capacity: 20,
    enrolled: 18,
    teacher: 'Emily Davis',
    room: 'Room 301',
    status: 'Inactive',
    subjects: 6
  }
];

const Classes = () => {
  const { user } = useAuth();

  const classesColumns = [
    { key: 'name', header: 'Class Name' },
    { key: 'code', header: 'Class Code' },
    { key: 'teacher', header: 'Main Teacher' },
    { key: 'room', header: 'Room' },
    { 
      key: 'enrolled', 
      header: 'Students',
      render: (value: number, row: any) => `${value}/${row.capacity}`
    },
    { key: 'subjects', header: 'Subjects' },
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

  const handleAddClass = () => {
    console.log('Add new class');
  };

  const handleEditClass = (classData: any) => {
    console.log('Edit class:', classData);
  };

  const handleDeleteClass = (classData: any) => {
    console.log('Delete class:', classData);
  };

  const canCreate = AccessControl.hasPermission(user?.role || '', 'create-class');
  const canEdit = AccessControl.hasPermission(user?.role || '', 'edit-class');
  const canDelete = AccessControl.hasPermission(user?.role || '', 'delete-class');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Classes Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage classes, teachers, and student enrollment
        </p>
      </div>

      <DataTable
        title="Classes"
        data={mockClasses}
        columns={classesColumns}
        onAdd={canCreate ? handleAddClass : undefined}
        onEdit={canEdit ? handleEditClass : undefined}
        onDelete={canDelete ? handleDeleteClass : undefined}
        searchPlaceholder="Search classes..."
      />
    </div>
  );
};

export default Classes;
