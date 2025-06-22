import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
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
  const [usersData, setUsersData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log('Loading users data...');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsersData(mockUsers);
      setDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${mockUsers.length} users.`
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load users data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const userRole = user?.role || 'Student';
  const canAdd = AccessControl.hasPermission(userRole, 'create-user');
  const canEdit = AccessControl.hasPermission(userRole, 'edit-user');
  const canDelete = AccessControl.hasPermission(userRole, 'delete-user');

  return (
    <div className="space-y-6">
      {!dataLoaded ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Users Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load users data
          </p>
          <Button 
            onClick={handleLoadData} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading Data...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Load Data
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div></div>
            <Button 
              onClick={handleLoadData} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </>
              )}
            </Button>
          </div>

          <DataTable
            title="Users Management"
            data={usersData}
            columns={usersColumns}
            onAdd={canAdd ? () => setIsCreateDialogOpen(true) : undefined}
            onEdit={canEdit ? handleEditUser : undefined}
            onDelete={canDelete ? handleDeleteUser : undefined}
            onView={handleViewUser}
            searchPlaceholder="Search users..."
          />
        </>
      )}

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
