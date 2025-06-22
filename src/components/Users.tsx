import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateUserForm from '@/components/forms/CreateUserForm';

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Student',
    status: 'Active',
    lastLogin: '2024-01-20'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Teacher',
    status: 'Active',
    lastLogin: '2024-01-21'
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'InstituteAdmin',
    status: 'Inactive',
    lastLogin: '2024-01-15'
  },
  {
    id: '4',
    name: 'Bob Williams',
    email: 'bob.williams@example.com',
    role: 'SystemAdmin',
    status: 'Active',
    lastLogin: '2024-01-22'
  }
];

const Users = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const usersColumns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    { key: 'lastLogin', header: 'Last Login' }
  ];

  const handleCreateUser = (userData: any) => {
    console.log('Creating user:', userData);
    toast({
      title: "User Created",
      description: `User ${userData.name} has been created successfully.`
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditUser = (userData: any) => {
    console.log('Editing user:', userData);
    setSelectedUser(userData);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = (userData: any) => {
    console.log('Updating user:', userData);
    toast({
      title: "User Updated",
      description: `User ${userData.name} has been updated successfully.`
    });
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userData: any) => {
    console.log('Deleting user:', userData);
    toast({
      title: "User Deleted",
      description: `User ${userData.name} has been deleted.`,
      variant: "destructive"
    });
  };

  const handleViewUser = (userData: any) => {
    console.log('View user details:', userData);
    toast({
      title: "View User",
      description: `Viewing user: ${userData.name}`
    });
  };

  const canAdd = AccessControl.hasPermission(user?.role || 'Student', 'add-users');
  const canEdit = AccessControl.hasPermission(user?.role || 'Student', 'edit-users');
  const canDelete = AccessControl.hasPermission(user?.role || 'Student', 'delete-users');

  return (
    <div className="space-y-6">
      <DataTable
        title="Users Management"
        data={mockUsers}
        columns={usersColumns}
        onAdd={canAdd ? () => setIsCreateDialogOpen(true) : undefined}
        onEdit={canEdit ? handleEditUser : undefined}
        onDelete={canDelete ? handleDeleteUser : undefined}
        onView={handleViewUser}
        searchPlaceholder="Search users..."
        allowAdd={canAdd}
        allowEdit={canEdit}
        allowDelete={canDelete}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <CreateUserForm
            onSubmit={handleCreateUser}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <CreateUserForm
            initialData={selectedUser}
            onSubmit={handleUpdateUser}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedUser(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
