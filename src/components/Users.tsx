
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreateUserForm from '@/components/forms/CreateUserForm';

const Users = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const BASE_URL = 'http://localhost:3000';

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('limit', '10');
    
    if (statusFilter !== 'all') {
      params.append('isActive', statusFilter);
    }
    
    if (userTypeFilter !== 'all') {
      params.append('userType', userTypeFilter);
    }
    
    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }
    
    return params.toString();
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    console.log('Loading users data...');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const queryParams = buildQueryParams();
      
      const response = await fetch(`${BASE_URL}/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      // Transform the data to match the table structure
      const transformedData = data.data.map((item: any) => ({
        id: item.id,
        name: `${item.firstName || ''} ${item.lastName || ''}`.trim(),
        email: item.email || '',
        phone: item.phone || '',
        userType: item.userType || '',
        status: item.isActive ? 'Active' : 'Inactive',
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
        originalData: item
      }));

      setUsersData(transformedData);
      setTotalCount(data.meta?.total || 0);
      setDataLoaded(true);
      
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${transformedData.length} users.`
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load users data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserById = async (id: string) => {
    if (!id.trim()) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('User not found');
      }

      const data = await response.json();
      
      // Transform single user data
      const transformedUser = {
        id: data.id,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        email: data.email || '',
        phone: data.phone || '',
        userType: data.userType || '',
        status: data.isActive ? 'Active' : 'Inactive',
        createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '',
        originalData: data
      };

      setUsersData([transformedUser]);
      setTotalCount(1);
      setDataLoaded(true);
      
      toast({
        title: "User Found",
        description: `Found user: ${transformedUser.name}`
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "User Not Found",
        description: "Could not find user with the provided ID.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadData = () => {
    if (userIdFilter.trim()) {
      fetchUserById(userIdFilter);
    } else {
      fetchUsers();
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      toast({
        title: "User Created",
        description: `User ${userData.firstName} ${userData.lastName} has been created successfully.`
      });
      
      setIsCreateDialogOpen(false);
      handleLoadData();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create user.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUser = async (userData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${BASE_URL}/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      toast({
        title: "User Updated",
        description: `User ${userData.firstName} ${userData.lastName} has been updated successfully.`
      });
      
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      handleLoadData();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update user.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (user: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast({
        title: "User Deleted",
        description: `User ${user.name} has been deleted.`,
        variant: "destructive"
      });
      
      handleLoadData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete user.",
        variant: "destructive"
      });
    }
  };

  const handleViewUser = (user: any) => {
    console.log('View user details:', user);
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    console.log('Edit user:', user);
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const usersColumns = [
    { key: 'id', header: 'User ID' },
    { key: 'name', header: 'Full Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'userType', header: 'User Type' },
    { key: 'createdAt', header: 'Created Date' },
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

  const canAdd = AccessControl.hasPermission(user?.role || 'Student' as const, 'create-user');
  const canEdit = AccessControl.hasPermission(user?.role || 'Student' as const, 'edit-user');
  const canDelete = AccessControl.hasPermission(user?.role || 'Student' as const, 'delete-user');

  // Effect to reload data when filters change
  useEffect(() => {
    if (dataLoaded && !userIdFilter.trim()) {
      fetchUsers();
    }
  }, [statusFilter, userTypeFilter, searchTerm, currentPage]);

  return (
    <div className="space-y-6">
      {!dataLoaded ? (
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Users Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load users data
          </p>
          
          {/* Filters Section */}
          <Card className="mb-6 mx-auto max-w-4xl">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter users by status, user type, search term, or specific user ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status Filter</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">User Type</label>
                  <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="PARENT">Parent</SelectItem>
                      <SelectItem value="INSTITUTE_ADMIN">Institute Admin</SelectItem>
                      <SelectItem value="SYSTEM_ADMIN">System Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">User ID</label>
                  <Input
                    type="text"
                    placeholder="Enter user ID"
                    value={userIdFilter}
                    onChange={(e) => setUserIdFilter(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
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
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Users Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage user accounts and permissions
            </p>
          </div>

          {/* Filters for loaded state */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="PARENT">Parent</SelectItem>
                    <SelectItem value="INSTITUTE_ADMIN">Institute Admin</SelectItem>
                    <SelectItem value="SYSTEM_ADMIN">System Admin</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <Input
                  type="text"
                  placeholder="Enter user ID"
                  value={userIdFilter}
                  onChange={(e) => setUserIdFilter(e.target.value)}
                />
                
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
            </CardContent>
          </Card>

          <DataTable
            title="Users Management"
            data={usersData}
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
            initialData={selectedUser?.originalData}
            onSubmit={handleUpdateUser}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedUser(null);
            }}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              {selectedUser.originalData?.imageUrl && (
                <div className="flex justify-center">
                  <img 
                    src={selectedUser.originalData.imageUrl} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>User ID:</strong> {selectedUser.id}</div>
                    <div><strong>Name:</strong> {selectedUser.name}</div>
                    <div><strong>Email:</strong> {selectedUser.email}</div>
                    <div><strong>Phone:</strong> {selectedUser.phone}</div>
                    <div><strong>User Type:</strong> {selectedUser.userType}</div>
                    <div><strong>NIC:</strong> {selectedUser.originalData?.nic}</div>
                    <div><strong>Birth Certificate:</strong> {selectedUser.originalData?.birthCertificateNo}</div>
                    <div><strong>Date of Birth:</strong> {selectedUser.originalData?.dateOfBirth}</div>
                    <div><strong>Gender:</strong> {selectedUser.originalData?.gender}</div>
                    <div><strong>Address Line 1:</strong> {selectedUser.originalData?.addressLine1}</div>
                    <div><strong>Address Line 2:</strong> {selectedUser.originalData?.addressLine2}</div>
                    <div><strong>City:</strong> {selectedUser.originalData?.city}</div>
                    <div><strong>District:</strong> {selectedUser.originalData?.district}</div>
                    <div><strong>Province:</strong> {selectedUser.originalData?.province}</div>
                    <div><strong>Country:</strong> {selectedUser.originalData?.country}</div>
                    <div><strong>Postal Code:</strong> {selectedUser.originalData?.postalCode}</div>
                    <div><strong>Created:</strong> {selectedUser.createdAt}</div>
                    <div><strong>Status:</strong> 
                      <Badge variant={selectedUser.status === 'Active' ? 'default' : 'secondary'} className="ml-2">
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
