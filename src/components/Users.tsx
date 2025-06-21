
import React from 'react';
import DataTable from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Badge } from '@/components/ui/badge';

const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@cambridge.edu',
    role: 'Teacher',
    status: 'Active',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@cambridge.edu',
    role: 'Teacher',
    status: 'Active',
    joinDate: '2023-02-20',
    lastLogin: '2024-01-19'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@cambridge.edu',
    role: 'InstituteAdmin',
    status: 'Active',
    joinDate: '2022-08-10',
    lastLogin: '2024-01-20'
  },
  {
    id: '4',
    name: 'Michael Brown',
    email: 'michael.brown@cambridge.edu',
    role: 'AttendanceMarker',
    status: 'Active',
    joinDate: '2023-05-12',
    lastLogin: '2024-01-18'
  },
  {
    id: '5',
    name: 'Alice Johnson',
    email: 'alice.johnson@cambridge.edu',
    role: 'Student',
    status: 'Inactive',
    joinDate: '2023-09-01',
    lastLogin: '2024-01-10'
  }
];

const Users = () => {
  const { user } = useAuth();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SystemAdmin': return 'destructive';
      case 'InstituteAdmin': return 'default';
      case 'Teacher': return 'secondary';
      case 'AttendanceMarker': return 'outline';
      case 'Student': return 'outline';
      default: return 'secondary';
    }
  };

  const usersColumns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Role',
      render: (value: string) => (
        <Badge variant={getRoleBadgeVariant(value)}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    { key: 'joinDate', header: 'Join Date' },
    { key: 'lastLogin', header: 'Last Login' }
  ];

  const handleAddUser = () => {
    console.log('Add new user');
  };

  const handleEditUser = (userData: any) => {
    console.log('Edit user:', userData);
  };

  const handleDeleteUser = (userData: any) => {
    console.log('Delete user:', userData);
  };

  const canCreate = AccessControl.hasPermission(user?.role || '', 'create-user');
  const canEdit = AccessControl.hasPermission(user?.role || '', 'edit-user');
  const canDelete = AccessControl.hasPermission(user?.role || '', 'delete-user');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Users Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage system users, roles, and permissions
        </p>
      </div>

      <DataTable
        title="Users"
        data={mockUsers}
        columns={usersColumns}
        onAdd={canCreate ? handleAddUser : undefined}
        onEdit={canEdit ? handleEditUser : undefined}
        onDelete={canDelete ? handleDeleteUser : undefined}
        searchPlaceholder="Search users..."
      />
    </div>
  );
};

export default Users;
