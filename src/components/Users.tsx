import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, RefreshCwIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
  addressLine2?: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showViewUser, setShowViewUser] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchById, setSearchById] = useState('');

  const getBaseUrl = () => {
    return localStorage.getItem('baseUrl') || 'http://localhost:3000';
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (searchById.trim()) {
      // If searching by ID, don't add other filters
      return '';
    }
    
    params.append('page', currentPage.toString());
    params.append('limit', itemsPerPage.toString());
    
    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }
    if (selectedUserType && selectedUserType !== 'all') {
      params.append('userType', selectedUserType);
    }
    if (selectedGender && selectedGender !== 'all') {
      params.append('gender', selectedGender);
    }
    if (selectedStatus && selectedStatus !== 'all') {
      params.append('isActive', selectedStatus);
    }
    
    return params.toString();
  };

  const fetchUsers = async () => {
    try {
      console.log('Loading users data...');
      setLoading(true);
      setError(null);
      
      const baseUrl = getBaseUrl();
      let url = `${baseUrl}/users`;
      
      // If searching by ID, use different endpoint
      if (searchById.trim()) {
        url = `${baseUrl}/users/${searchById.trim()}`;
      } else {
        const queryParams = buildQueryParams();
        if (queryParams) {
          url += `?${queryParams}`;
        }
      }
      
      console.log('API URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      console.log('Response status:', response.status);

      if (response.status === 404) {
        // Handle 404 specifically
        if (searchById.trim()) {
          setError(`User with ID "${searchById.trim()}" not found.`);
        } else {
          setError('No users found matching the current filters. Please try adjusting your search criteria.');
        }
        setUsers([]);
        setTotalPages(1);
        setTotalItems(0);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      console.log('Users data:', data);
      
      if (searchById.trim()) {
        // Single user response
        setUsers([data]);
        setTotalPages(1);
        setTotalItems(1);
      } else {
        // Paginated response
        if (data.data && Array.isArray(data.data)) {
          setUsers(data.data);
          setTotalPages(data.meta?.totalPages || 1);
          setTotalItems(data.meta?.total || 0);
        } else {
          console.error('Unexpected data format:', data);
          setUsers([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load users';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage + ". Please check if backend is running.",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CreateUserSchema = z.object({
    firstName: z.string().min(2, "First Name must be at least 2 characters."),
    lastName: z.string().min(2, "Last Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    phone: z.string().min(10, "Phone number must be at least 10 characters."),
    userType: z.enum(['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'TEACHER', 'ATTEDANCE_MARKER']),
    nic: z.string().min(10, "NIC must be at least 10 characters."),
    birthCertificateNo: z.string().min(5, "Birth certificate number is required."),
    addressLine1: z.string().min(5, "Address line 1 is required."),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is required."),
    district: z.string().min(2, "District is required."),
    province: z.string().min(2, "Province is required."),
    postalCode: z.string().min(4, "Postal code is required."),
    country: z.string().min(2, "Country is required."),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    dateOfBirth: z.string().min(1, "Date of birth is required."),
    isActive: z.boolean().default(true)
  });

  const EditUserSchema = z.object({
    firstName: z.string().min(2, "First Name must be at least 2 characters."),
    lastName: z.string().min(2, "Last Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    phone: z.string().min(10, "Phone number must be at least 10 characters."),
    userType: z.enum(['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'TEACHER', 'ATTEDANCE_MARKER', 'STUDENT', 'PARENT']),
    nic: z.string().min(10, "NIC must be at least 10 characters."),
    birthCertificateNo: z.string().min(5, "Birth certificate number is required."),
    addressLine1: z.string().min(5, "Address line 1 is required."),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is required."),
    district: z.string().min(2, "District is required."),
    province: z.string().min(2, "Province is required."),
    postalCode: z.string().min(4, "Postal code is required."),
    country: z.string().min(2, "Country is required."),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    dateOfBirth: z.string().min(1, "Date of birth is required."),
    isActive: z.boolean().default(true)
  });
  
  const createForm = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      userType: 'TEACHER',
      nic: "",
      birthCertificateNo: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      province: "",
      postalCode: "",
      country: "Sri Lanka",
      gender: 'MALE',
      dateOfBirth: "",
      isActive: true
    },
  });

  const editForm = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      userType: 'TEACHER',
      nic: "",
      birthCertificateNo: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      province: "",
      postalCode: "",
      country: "Sri Lanka",
      gender: 'MALE',
      dateOfBirth: "",
      isActive: true
    },
  });

  const onCreateUserSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
    try {
      // Format the date to YYYY-MM-DD
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth // Already in YYYY-MM-DD format from date input
      };

      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(formattedValues),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
  
      toast({
        title: "Success",
        description: "User created successfully",
      });
  
      // Refresh the users list
      await fetchUsers();
      setShowCreateForm(false);
      createForm.reset();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onEditUserSubmit = async (values: z.infer<typeof EditUserSchema>) => {
    if (!editingUser) return;
    
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
  
      toast({
        title: "Success",
        description: "User updated successfully",
      });
  
      // Refresh the users list
      await fetchUsers();
      setShowEditForm(false);
      setEditingUser(null);
      editForm.reset();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    editForm.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userType: user.userType as any,
      nic: user.nic,
      birthCertificateNo: user.birthCertificateNo,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2 || "",
      city: user.city,
      district: user.district,
      province: user.province,
      postalCode: user.postalCode,
      country: user.country,
      gender: user.gender as any,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
      isActive: user.isActive
    });
    setShowEditForm(true);
  };

  const handleViewUser = (user: User) => {
    setViewingUser(user);
    setShowViewUser(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedUserType('all');
    setSelectedGender('all');
    setSelectedStatus('all');
    setSearchById('');
    setCurrentPage(1);
    setUsers([]);
  };

  // Don't show Users section if not SystemAdmin
  if (currentUser?.role !== 'SystemAdmin') {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-600">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view this section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex items-center space-x-2">
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
                <DialogDescription>
                  Create a new user account (Cannot create Students or Parents)
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreateUserSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Password" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select user type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                              <SelectItem value="INSTITUTE_ADMIN">Institute Admin</SelectItem>
                              <SelectItem value="TEACHER">Teacher</SelectItem>
                              <SelectItem value="ATTEDANCE_MARKER">Attendance Marker</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="nic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIC</FormLabel>
                          <FormControl>
                            <Input placeholder="NIC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="birthCertificateNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Certificate No</FormLabel>
                          <FormControl>
                            <Input placeholder="Birth Certificate No" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input placeholder="Address Line 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2</FormLabel>
                          <FormControl>
                            <Input placeholder="Address Line 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={createForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input placeholder="District" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <FormControl>
                            <Input placeholder="Province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Postal Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={createForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <FormDescription>
                            Set whether the user account is active
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create User</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>
            Filter users by various criteria or search by ID
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search by ID */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchById" className="w-24">Search by ID:</Label>
            <Input
              id="searchById"
              type="text"
              placeholder="Enter user ID"
              value={searchById}
              onChange={(e) => setSearchById(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Other filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!!searchById}
              />
            </div>
            
            <div>
              <Label htmlFor="userType">User Type</Label>
              <Select 
                value={selectedUserType} 
                onValueChange={setSelectedUserType}
                disabled={!!searchById}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="INSTITUTE_ADMIN">Institute Admin</SelectItem>
                  <SelectItem value="TEACHER">Teacher</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="ATTEDANCE_MARKER">Attendance Marker</SelectItem>
                  <SelectItem value="PARENT">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={selectedGender} 
                onValueChange={setSelectedGender}
                disabled={!!searchById}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={selectedStatus} 
                onValueChange={setSelectedStatus}
                disabled={!!searchById}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSearch}>
              <SearchIcon className="h-4 w-4 mr-2" />
              Load Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center p-8">
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className="text-center p-8">
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-600 font-medium">Error Loading Users</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => fetchUsers()} 
                className="mt-4"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : users.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.userType}</TableCell>
                    <TableCell>{user.gender || 'N/A'}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewUser(user)}
                        className="mr-2"
                      >
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      {currentUser?.email !== user.email && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!searchById && totalPages > 1 && (
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing page {currentPage} of {totalPages} ({totalItems} total users)
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => {
                    const newPage = currentPage - 1;
                    handlePageChange(newPage);
                    setTimeout(() => fetchUsers(), 100);
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    const newPage = currentPage + 1;
                    handlePageChange(newPage);
                    setTimeout(() => fetchUsers(), 100);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-8">
          <p>No users found. Click "Load Data" to fetch users.</p>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditUserSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                          <SelectItem value="INSTITUTE_ADMIN">Institute Admin</SelectItem>
                          <SelectItem value="TEACHER">Teacher</SelectItem>
                          <SelectItem value="ATTEDANCE_MARKER">Attendance Marker</SelectItem>
                          <SelectItem value="STUDENT">Student</SelectItem>
                          <SelectItem value="PARENT">Parent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="nic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIC</FormLabel>
                      <FormControl>
                        <Input placeholder="NIC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="birthCertificateNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Certificate No</FormLabel>
                      <FormControl>
                        <Input placeholder="Birth Certificate No" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Address Line 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Address Line 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={editForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <Input placeholder="District" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input placeholder="Province" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Postal Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Set whether the user account is active
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setShowEditForm(false);
                  setEditingUser(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">Update User</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={showViewUser} onOpenChange={setShowViewUser}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about the user
            </DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-6">
              {/* Profile Image */}
              {viewingUser.imageUrl && (
                <div className="flex justify-center">
                  <img 
                    src={viewingUser.imageUrl} 
                    alt={`${viewingUser.firstName} ${viewingUser.lastName}`}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
              
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">First Name</Label>
                  <p className="text-sm font-medium">{viewingUser.firstName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Name</Label>
                  <p className="text-sm font-medium">{viewingUser.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-sm">{viewingUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="text-sm">{viewingUser.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">User Type</Label>
                  <p className="text-sm">{viewingUser.userType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Gender</Label>
                  <p className="text-sm">{viewingUser.gender || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
                  <p className="text-sm">{viewingUser.dateOfBirth ? new Date(viewingUser.dateOfBirth).toLocaleDateString() : 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">NIC</Label>
                  <p className="text-sm">{viewingUser.nic}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Birth Certificate No</Label>
                  <p className="text-sm">{viewingUser.birthCertificateNo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    viewingUser.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Address Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">Address Line 1</Label>
                    <p className="text-sm">{viewingUser.addressLine1}</p>
                  </div>
                  {viewingUser.addressLine2 && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">Address Line 2</Label>
                      <p className="text-sm">{viewingUser.addressLine2}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-gray-500">City</Label>
                    <p className="text-sm">{viewingUser.city}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">District</Label>
                    <p className="text-sm">{viewingUser.district}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Province</Label>
                    <p className="text-sm">{viewingUser.province}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Postal Code</Label>
                    <p className="text-sm">{viewingUser.postalCode}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Country</Label>
                    <p className="text-sm">{viewingUser.country}</p>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">System Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">User ID</Label>
                    <p className="text-sm font-mono">{viewingUser.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Created At</Label>
                    <p className="text-sm">{new Date(viewingUser.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Updated At</Label>
                    <p className="text-sm">{new Date(viewingUser.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowViewUser(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
