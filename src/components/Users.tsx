import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Filter, Search, UserPlus, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateUserForm from '@/components/forms/CreateUserForm';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  dateOfBirth: string;
  gender: string;
  nic: string;
  birthCertificateNo: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

interface ApiResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    previousPage: number | null;
    nextPage: number | null;
  };
}

const Users = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const buildApiUrl = () => {
    const baseUrl = 'http://localhost:3000/users';
    const params = new URLSearchParams();
    
    // Add pagination
    params.append('page', currentPage.toString());
    params.append('limit', itemsPerPage.toString());
    
    // Add filters only if they have values
    if (searchTerm) params.append('search', searchTerm);
    if (userTypeFilter) params.append('userType', userTypeFilter);
    if (activeFilter) params.append('isActive', activeFilter);
    if (genderFilter) params.append('gender', genderFilter);
    if (cityFilter) params.append('city', cityFilter);
    if (districtFilter) params.append('district', districtFilter);
    if (provinceFilter) params.append('province', provinceFilter);
    
    return `${baseUrl}?${params.toString()}`;
  };

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log('Loading users data...');
    
    try {
      let apiUrl = buildApiUrl();
      
      // If searching by ID, use different endpoint
      if (userIdFilter) {
        apiUrl = `http://localhost:3000/users/${userIdFilter}`;
      }
      
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      if (userIdFilter) {
        // For single user by ID
        setUsersData([responseData]);
        setTotalRecords(1);
        setTotalPages(1);
      } else {
        const apiResponse = responseData as ApiResponse;
        setUsersData(apiResponse.data);
        setTotalRecords(apiResponse.meta.total);
        setTotalPages(apiResponse.meta.totalPages);
      }
      
      setDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${userIdFilter ? 1 : responseData.data?.length || 0} users.`
      });
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Load Failed",
        description: `Failed to load users data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    handleLoadData();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setUserTypeFilter('');
    setActiveFilter('');
    setGenderFilter('');
    setCityFilter('');
    setDistrictFilter('');
    setProvinceFilter('');
    setUserIdFilter('');
    setCurrentPage(1);
    if (dataLoaded) {
      handleLoadData();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Auto-reload data when page changes
    setTimeout(() => {
      handleLoadData();
    }, 100);
  };

  const usersColumns = [
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { 
      key: 'userType', 
      header: 'User Type',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    { 
      key: 'gender', 
      header: 'Gender',
      render: (value: string) => (
        <Badge variant="secondary">{value}</Badge>
      )
    },
    { key: 'city', header: 'City' },
    { key: 'province', header: 'Province' },
    { 
      key: 'isActive', 
      header: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'destructive'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const handleCreateUser = async (userData: any) => {
    try {
      console.log('Creating user:', userData);
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "User Created",
        description: `User ${userData.firstName} ${userData.lastName} has been created successfully.`
      });
      setIsCreateDialogOpen(false);
      if (dataLoaded) {
        handleLoadData();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Creation Failed",
        description: `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const handleEditUser = (userData: User) => {
    console.log('Editing user:', userData);
    setSelectedUser(userData);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async (userData: any) => {
    try {
      console.log('Updating user:', userData);
      const response = await fetch(`http://localhost:3000/users/${selectedUser?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "User Updated",
        description: `User ${userData.firstName} ${userData.lastName} has been updated successfully.`
      });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      if (dataLoaded) {
        handleLoadData();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Update Failed",
        description: `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userData: User) => {
    try {
      console.log('Deleting user:', userData);
      const response = await fetch(`http://localhost:3000/users/${userData.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "User Deleted",
        description: `User ${userData.firstName} ${userData.lastName} has been deleted.`,
        variant: "destructive"
      });
      if (dataLoaded) {
        handleLoadData();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Delete Failed",
        description: `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const handleViewUser = (userData: User) => {
    console.log('View user details:', userData);
    setSelectedUser(userData);
    setIsViewDialogOpen(true);
  };

  const userRole = user?.role || 'Student';
  const canAdd = AccessControl.hasPermission(userRole, 'create-user');
  const canEdit = AccessControl.hasPermission(userRole, 'edit-user');
  const canDelete = AccessControl.hasPermission(userRole, 'delete-user');

  if (!dataLoaded) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Filters Card - Mobile Responsive */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              User Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Search by ID</label>
                <Input
                  placeholder="Enter User ID"
                  value={userIdFilter}
                  onChange={(e) => setUserIdFilter(e.target.value)}
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Search</label>
                <Input
                  placeholder="Name, email, phone, NIC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">User Type</label>
                <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="INSTITUTE_ADMIN">Institute Admin</SelectItem>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="ATTEDANCE_MARKER">Attendance Marker</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="PARENT">Parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Status</label>
                <Select value={activeFilter} onValueChange={setActiveFilter}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Gender</label>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">City</label>
                <Input
                  placeholder="Enter city"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">District</label>
                <Input
                  placeholder="Enter district"
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Province</label>
                <Input
                  placeholder="Enter province"
                  value={provinceFilter}
                  onChange={(e) => setProvinceFilter(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700 text-sm">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Apply Filters
              </Button>
              <Button variant="outline" onClick={handleClearFilters} className="text-sm">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create User Button */}
        {canAdd && (
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-sm"
            >
              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Create User
            </Button>
          </div>
        )}

        {/* Load Data Section */}
        <div className="text-center py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Users Management
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
            Apply filters above and click the button below to load users data
          </p>
          <Button 
            onClick={handleLoadData} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-sm"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                Loading Data...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Load Data
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            User Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {/* ... keep existing filter inputs ... */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Search by ID</label>
              <Input
                placeholder="Enter User ID"
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Search</label>
              <Input
                placeholder="Name, email, phone, NIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">User Type</label>
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="INSTITUTE_ADMIN">Institute Admin</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="ATTEDANCE_MARKER">Attendance Marker</SelectItem>
                  <SelectItem value="TEACHER">Teacher</SelectItem>
                  <SelectItem value="PARENT">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Status</label>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Gender</label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">City</label>
              <Input
                placeholder="Enter city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">District</label>
              <Input
                placeholder="Enter district"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Province</label>
              <Input
                placeholder="Enter province"
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Items per page</label>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700 text-sm">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters} className="text-sm">
              Clear Filters
            </Button>
            <Button 
              onClick={handleLoadData} 
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                  Refresh
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Refresh
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
        itemsPerPage={itemsPerPage}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} users
          </div>
          
          <Pagination className="order-1 sm:order-2">
            <PaginationContent className="flex-wrap gap-1">
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={`text-xs sm:text-sm ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                />
              </PaginationItem>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={currentPage === pageNum}
                      className="text-xs sm:text-sm cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={`text-xs sm:text-sm ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
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
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              User Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Name:</label>
                    <p className="text-gray-900 dark:text-gray-100">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Email:</label>
                    <p className="text-gray-900 dark:text-gray-100">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Phone:</label>
                    <p className="text-gray-900 dark:text-gray-100">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">User Type:</label>
                    <p><Badge variant="outline">{selectedUser.userType}</Badge></p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Gender:</label>
                    <p><Badge variant="secondary">{selectedUser.gender}</Badge></p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Date of Birth:</label>
                    <p className="text-gray-900 dark:text-gray-100">{new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">NIC:</label>
                    <p className="text-gray-900 dark:text-gray-100">{selectedUser.nic}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Birth Certificate:</label>
                    <p className="text-gray-900 dark:text-gray-100">{selectedUser.birthCertificateNo}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Address:</label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedUser.addressLine1}
                      {selectedUser.addressLine2 && `, ${selectedUser.addressLine2}`}
                      <br />
                      {selectedUser.city}, {selectedUser.district}, {selectedUser.province}
                      <br />
                      {selectedUser.postalCode}, {selectedUser.country}
                    </p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Status:</label>
                    <p>
                      <Badge variant={selectedUser.isActive ? 'default' : 'destructive'}>
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Created At:</label>
                    <p className="text-gray-900 dark:text-gray-100">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Updated At:</label>
                    <p className="text-gray-900 dark:text-gray-100">{new Date(selectedUser.updatedAt).toLocaleString()}</p>
                  </div>
                  {selectedUser.imageUrl && (
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-gray-700 dark:text-gray-300">Profile Image:</label>
                      <div className="mt-2">
                        <img 
                          src={selectedUser.imageUrl} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
