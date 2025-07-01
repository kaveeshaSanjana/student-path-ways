
import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Filter, Search, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateUserForm from '@/components/forms/CreateUserForm';

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

  const buildApiUrl = () => {
    const baseUrl = '{{base_url}}/users';
    const params = new URLSearchParams();
    
    // Add pagination
    params.append('page', currentPage.toString());
    params.append('limit', '10');
    
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
        apiUrl = `{{base_url}}/users/${userIdFilter}`;
      }
      
      console.log('API URL:', apiUrl);
      
      // Simulate API call with mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response based on API structure
      const mockResponse: ApiResponse = {
        data: [
          {
            id: '1',
            firstName: 'Kavindu',
            lastName: 'Sanula',
            email: 'student.perera@example.com',
            phone: '0712345678',
            userType: 'STUDENT',
            dateOfBirth: '2005-04-20',
            gender: 'MALE',
            nic: '902345676V',
            birthCertificateNo: 'BC123456799',
            addressLine1: 'No. 24, Rosewood Gardens',
            addressLine2: 'Malabe',
            city: 'Colombo',
            district: 'Colombo',
            province: 'Western',
            postalCode: '10115',
            country: 'Sri Lanka',
            isActive: true,
            createdAt: '2025-06-30T16:54:07.229Z',
            updatedAt: '2025-07-01T17:16:21.211Z',
            imageUrl: 'https://example.com/images/kavindu.jpg'
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '0771234567',
            userType: 'TEACHER',
            dateOfBirth: '1985-03-15',
            gender: 'FEMALE',
            nic: '852345678V',
            birthCertificateNo: 'BC987654321',
            addressLine1: 'No. 15, Palm Avenue',
            addressLine2: 'Nugegoda',
            city: 'Colombo',
            district: 'Colombo',
            province: 'Western',
            postalCode: '10250',
            country: 'Sri Lanka',
            isActive: true,
            createdAt: '2025-06-28T10:30:00.000Z',
            updatedAt: '2025-06-28T10:30:00.000Z'
          }
        ],
        meta: {
          page: currentPage,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasPreviousPage: false,
          hasNextPage: false,
          previousPage: null,
          nextPage: null
        }
      };
      
      if (userIdFilter) {
        // For single user by ID
        setUsersData([mockResponse.data[0]]);
        setTotalRecords(1);
        setTotalPages(1);
      } else {
        setUsersData(mockResponse.data);
        setTotalRecords(mockResponse.meta.total);
        setTotalPages(mockResponse.meta.totalPages);
      }
      
      setDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${mockResponse.data.length} users.`
      });
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load users data.",
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

  const handleCreateUser = (userData: any) => {
    console.log('Creating user:', userData);
    toast({
      title: "User Created",
      description: `User ${userData.firstName} ${userData.lastName} has been created successfully.`
    });
    setIsCreateDialogOpen(false);
    if (dataLoaded) {
      handleLoadData();
    }
  };

  const handleEditUser = (userData: User) => {
    console.log('Editing user:', userData);
    setSelectedUser(userData);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = (userData: any) => {
    console.log('Updating user:', userData);
    toast({
      title: "User Updated",
      description: `User ${userData.firstName} ${userData.lastName} has been updated successfully.`
    });
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    if (dataLoaded) {
      handleLoadData();
    }
  };

  const handleDeleteUser = (userData: User) => {
    console.log('Deleting user:', userData);
    toast({
      title: "User Deleted",
      description: `User ${userData.firstName} ${userData.lastName} has been deleted.`,
      variant: "destructive"
    });
    if (dataLoaded) {
      handleLoadData();
    }
  };

  const handleViewUser = (userData: User) => {
    console.log('View user details:', userData);
    toast({
      title: "View User",
      description: `Viewing user: ${userData.firstName} ${userData.lastName}`
    });
  };

  const userRole = user?.role || 'Student';
  const canAdd = AccessControl.hasPermission(userRole, 'create-user');
  const canEdit = AccessControl.hasPermission(userRole, 'edit-user');
  const canDelete = AccessControl.hasPermission(userRole, 'delete-user');

  if (!dataLoaded) {
    return (
      <div className="space-y-6">
        {/* Filters Card - Always Available */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              User Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search by ID</label>
                <Input
                  placeholder="Enter User ID"
                  value={userIdFilter}
                  onChange={(e) => setUserIdFilter(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Name, email, phone, NIC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">User Type</label>
                <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="INSTITUTE_ADMIN">Institute Admin</SelectItem>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="ATTENDANCE_MARKER">Attendance Marker</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="PARENT">Parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={activeFilter} onValueChange={setActiveFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger>
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
                <label className="text-sm font-medium">City</label>
                <Input
                  placeholder="Enter city"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">District</label>
                <Input
                  placeholder="Enter district"
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Province</label>
                <Input
                  placeholder="Enter province"
                  value={provinceFilter}
                  onChange={(e) => setProvinceFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create User Button - Always Available */}
        {canAdd && (
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </div>
        )}

        {/* Load Data Section */}
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Users Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Apply filters above and click the button below to load users data
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            User Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search by ID</label>
              <Input
                placeholder="Enter User ID"
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Name, email, phone, NIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">User Type</label>
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="INSTITUTE_ADMIN">Institute Admin</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="ATTENDANCE_MARKER">Attendance Marker</SelectItem>
                  <SelectItem value="TEACHER">Teacher</SelectItem>
                  <SelectItem value="PARENT">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
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
              <label className="text-sm font-medium">City</label>
              <Input
                placeholder="Enter city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Input
                placeholder="Enter district"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Province</label>
              <Input
                placeholder="Enter province"
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button 
              onClick={handleLoadData} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Refresh
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
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
      />

      {/* Pagination Info */}
      <div className="text-sm text-gray-500 text-center">
        Showing {usersData.length} of {totalRecords} users (Page {currentPage} of {totalPages})
      </div>

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
