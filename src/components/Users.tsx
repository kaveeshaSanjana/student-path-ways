import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateUserForm from '@/components/forms/CreateUserForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: string;
  isActive: boolean;
  gender: string;
  city: string;
  district: string;
  province: string;
  country: string;
  nic: string;
  lastUpdated: string;
}

const BASE_URL = 'https://5ee1-2402-4000-2280-68b1-b149-ba1b-ef57-a0b9.ngrok-free.app';

const Users = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    userType: '',
    isActive: '',
    gender: '',
    city: '',
    district: '',
    province: '',
    country: '',
    phone: '',
    nic: '',
    id: ''
  });

  // Only SystemAdmin can access this page
  if (user?.role !== 'SystemAdmin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log('Loading users data...');
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.userType) params.append('userType', filters.userType);
      if (filters.isActive !== '') params.append('isActive', filters.isActive);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.city) params.append('city', filters.city);
      if (filters.district) params.append('district', filters.district);
      if (filters.province) params.append('province', filters.province);
      if (filters.country) params.append('country', filters.country);
      if (filters.phone) params.append('phone', filters.phone);
      if (filters.nic) params.append('nic', filters.nic);
      
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      let url = `${BASE_URL}/users`;
      if (filters.id) {
        url = `${BASE_URL}/users/${filters.id}`;
      } else if (params.toString()) {
        url = `${BASE_URL}/users?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (filters.id) {
        // Single user response
        setUsersData([result]);
        setTotalItems(1);
        setTotalPages(1);
      } else {
        // Paginated response
        setUsersData(result.data || []);
        setTotalItems(result.meta?.total || 0);
        setTotalPages(result.meta?.totalPages || 1);
      }
      
      setDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${filters.id ? 1 : result.data?.length || 0} users.`
      });
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load users data. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataLoaded) {
      handleLoadData();
    }
  }, [currentPage, itemsPerPage]);

  const usersColumns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'userType', header: 'User Type' },
    { key: 'gender', header: 'Gender' },
    { key: 'city', header: 'City' },
    { key: 'district', header: 'District' },
    { key: 'province', header: 'Province' },
    { key: 'country', header: 'Country' },
    { key: 'nic', header: 'NIC' },
    { 
      key: 'isActive', 
      header: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { key: 'lastUpdated', header: 'Last Updated' },
  ];

  const handleAddUser = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateUser = (userData: any) => {
    console.log('Creating user:', userData);
    toast({
      title: "User Created",
      description: `User ${userData.name} has been created successfully.`
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditUser = (user: any) => {
    console.log('Edit user:', user);
    setSelectedUser(user);
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

  const handleDeleteUser = (user: any) => {
    console.log('Delete user:', user);
    toast({
      title: "User Deleted",
      description: `User ${user.name} has been deleted.`,
      variant: "destructive"
    });
  };

  const handleViewUser = (user: any) => {
    console.log('View user details:', user);
    toast({
      title: "View User",
      description: `Viewing user: ${user.name}`
    });
  };

  const handleDisableUser = (user: any) => {
    console.log('Disable user:', user);
    toast({
      title: "User Disabled",
      description: `User ${user.name} has been disabled.`,
      variant: "destructive"
    });
  };

  const handleEnableUser = (user: any) => {
    console.log('Enable user:', user);
    toast({
      title: "User Enabled",
      description: `User ${user.name} has been enabled.`
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      userType: '',
      isActive: '',
      gender: '',
      city: '',
      district: '',
      province: '',
      country: '',
      phone: '',
      nic: '',
      id: ''
    });
  };

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
              System-wide users management and administration
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <Input
                placeholder="Search users..."
                value={filters.search}
                onChange={handleSearchChange}
                className="max-w-md"
              />
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Select onValueChange={(value) => handleFilterChange('userType', value)} defaultValue={filters.userType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="SystemAdmin">System Admin</SelectItem>
                  <SelectItem value="InstituteAdmin">Institute Admin</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select onValueChange={(value) => handleFilterChange('isActive', value)} defaultValue={filters.isActive}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button onClick={clearFilters} variant="ghost">
                Clear Filters
              </Button>
            </div>
          </div>

          <DataTable
            title="All Users"
            data={usersData}
            columns={usersColumns}
            onAdd={handleAddUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onView={handleViewUser}
            searchPlaceholder="Search users..."
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            customActions={[
              {
                label: 'Disable',
                action: handleDisableUser,
                variant: 'destructive',
                condition: (row: any) => row.isActive
              },
              {
                label: 'Enable',
                action: handleEnableUser,
                variant: 'default',
                condition: (row: any) => !row.isActive
              }
            ]}
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
