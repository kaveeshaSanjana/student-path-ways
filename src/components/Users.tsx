import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Search, Filter, Download, Upload, RefreshCw } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import CreateUserForm from '@/components/forms/CreateUserForm';
import { useToast } from '@/hooks/use-toast';

const BASE_URL = 'https://e2e0-2402-4000-2280-68b1-b149-ba1b-ef57-a0b9.ngrok-free.app';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'STUDENT' | 'TEACHER' | 'ADMIN';
  status: 'active' | 'inactive' | 'pending';
  location: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    userType: 'STUDENT',
    status: 'active',
    location: 'New York',
    createdAt: '2023-01-01'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    userType: 'TEACHER',
    status: 'inactive',
    location: 'Los Angeles',
    createdAt: '2023-02-15'
  },
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    userType: 'ADMIN',
    status: 'pending',
    location: 'Chicago',
    createdAt: '2023-03-20'
  },
];

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [userIdSearch, setUserIdSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    handleLoadData();
  }, [currentPage, itemsPerPage, searchTerm, selectedUserType, selectedStatus, selectedLocation, userIdSearch]);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleUserTypeChange = (value: string) => {
    setSelectedUserType(value);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleUserIdSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserIdSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on ID search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page on items per page change
  };

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log('Loading users data...');
    
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedUserType && selectedUserType !== 'all' && { userType: selectedUserType }),
        ...(selectedStatus && selectedStatus !== 'all' && { status: selectedStatus }),
        ...(selectedLocation && selectedLocation !== 'all' && { location: selectedLocation }),
        ...(userIdSearch && { id: userIdSearch })
      });

      const response = await fetch(`${BASE_URL}/users?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Users data loaded:', data);
      
      setUsers(data.users || []);
      setTotalUsers(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
      
      toast({
        title: "Success",
        description: `Loaded ${data.users?.length || 0} users successfully`,
      });
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'userType',
      header: 'User Type',
      cell: ({ cell }) => (
        <Badge variant="secondary">{cell.getValue()}</Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ cell }) => (
        <Badge
          variant={
            cell.getValue() === 'active'
              ? 'success'
              : cell.getValue() === 'inactive'
              ? 'destructive'
              : 'default'
          }
        >
          {cell.getValue()}
        </Badge>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
    },
  ];

  return (
    <div>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Users</CardTitle>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="max-w-sm"
            />
            <Input
              type="text"
              placeholder="Search by User ID..."
              value={userIdSearch}
              onChange={handleUserIdSearchChange}
              className="max-w-xs"
            />
            <Select value={selectedUserType} onValueChange={handleUserTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All User Types</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={handleLocationChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleLoadData} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <CreateUserForm onClose={handleCloseCreateModal} onUserCreated={handleLoadData} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} isLoading={isLoading} />
          <div className="flex items-center justify-between mt-4">
            <Select value={itemsPerPage.toString()} onValueChange={(value) => handleItemsPerPageChange({ target: { value } } as any)}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span>{`Page ${currentPage} of ${totalPages}`}</span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
