
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/ui/data-table';
import CreateStudentForm from '@/components/forms/CreateStudentForm';
import { Eye, Users, Phone, Mail, MapPin, BookOpen, Search, Filter, Plus } from 'lucide-react';

interface Student {
  id: string;
  userId: string;
  studentId: string;
  fatherId: string | null;
  motherId: string | null;
  guardianId: string | null;
  emergencyContact: string;
  medicalConditions: string;
  allergies: string;
  bloodGroup: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
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
    addressLine1: string | null;
    addressLine2: string | null;
    city: string;
    district: string;
    province: string;
    postalCode: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
}

interface StudentsResponse {
  data: Student[];
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

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('true');
  const { toast } = useToast();

  const API_BASE_URL = 'http://localhost:3000';

  const getAuthToken = () => {
    // Try multiple possible token keys
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken');
    console.log('Auth token check:', token ? 'Token found' : 'No token found');
    return token;
  };

  const getApiHeaders = () => {
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        isActive: statusFilter
      });

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      console.log('Fetching students with params:', params.toString());

      const response = await fetch(`${API_BASE_URL}/students?${params}`, {
        headers: getApiHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StudentsResponse = await response.json();
      console.log('Students data received:', data);
      
      setStudents(data.data);
      setTotalPages(data.meta.totalPages);
      setTotalItems(data.meta.total);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (studentData: any) => {
    try {
      console.log('Creating student:', studentData);
      
      // Format date to YYYY-MM-DD
      const formattedData = {
        ...studentData,
        dateOfBirth: studentData.dateOfBirth ? 
          new Date(studentData.dateOfBirth).toISOString().split('T')[0] : 
          new Date().toISOString().split('T')[0]
      };

      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Student Created",
        description: `Student ${studentData.firstName} ${studentData.lastName} has been created successfully.`
      });
      
      setShowCreateDialog(false);
      fetchStudents();
    } catch (error) {
      console.error('Failed to create student:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create student.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, itemsPerPage, searchTerm, statusFilter]);

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowViewDialog(true);
  };

  const columns = [
    {
      key: 'user.firstName',
      header: 'Student',
      render: (value: any, row: Student) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.user.imageUrl || ''} alt={row.user.firstName} />
            <AvatarFallback>
              {row.user.firstName.charAt(0)}{row.user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.user.firstName} {row.user.lastName}</p>
            <p className="text-sm text-gray-500">{row.user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'studentId',
      header: 'Student ID',
      render: (value: string) => (
        <Badge variant="outline">{value || 'Not assigned'}</Badge>
      )
    },
    {
      key: 'user.phone',
      header: 'Contact',
      render: (value: any, row: Student) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Phone className="h-3 w-3 mr-1" />
            {row.user.phone}
          </div>
          <div className="flex items-center text-sm">
            <Mail className="h-3 w-3 mr-1" />
            {row.user.email}
          </div>
        </div>
      )
    },
    {
      key: 'user.dateOfBirth',
      header: 'Date of Birth',
      render: (value: string) => (
        <span>{new Date(value).toLocaleDateString()}</span>
      )
    },
    {
      key: 'user.isActive',
      header: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-600 mt-1">Manage student accounts and information</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-blue-600" />
          <Badge variant="outline" className="text-sm">
            {totalItems} Total Students
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        title="Students List"
        data={students}
        columns={columns}
        onAdd={() => setShowCreateDialog(true)}
        onView={handleViewStudent}
        searchPlaceholder="Search students..."
        allowEdit={false}
        allowDelete={false}
        currentPage={currentPage}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Student</DialogTitle>
          </DialogHeader>
          <CreateStudentForm
            onSubmit={handleCreateStudent}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete information about the student
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedStudent.user.imageUrl || ''} alt={selectedStudent.user.firstName} />
                  <AvatarFallback className="text-2xl">
                    {selectedStudent.user.firstName.charAt(0)}{selectedStudent.user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">{selectedStudent.user.firstName} {selectedStudent.user.lastName}</h3>
                  <p className="text-gray-600">Student ID: {selectedStudent.studentId || 'Not assigned'}</p>
                  <Badge variant={selectedStudent.user.isActive ? "default" : "secondary"}>
                    {selectedStudent.user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedStudent.user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{selectedStudent.user.phone}</span>
                    </div>
                    <p><strong>Date of Birth:</strong> {selectedStudent.user.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {selectedStudent.user.gender}</p>
                    <p><strong>NIC:</strong> {selectedStudent.user.nic}</p>
                    <p><strong>Birth Certificate:</strong> {selectedStudent.user.birthCertificateNo}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Medical Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p><strong>Blood Group:</strong> {selectedStudent.bloodGroup}</p>
                    <p><strong>Emergency Contact:</strong> {selectedStudent.emergencyContact}</p>
                    <p><strong>Allergies:</strong> {selectedStudent.allergies || 'None'}</p>
                    <p><strong>Medical Conditions:</strong> {selectedStudent.medicalConditions || 'None'}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Address Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        {selectedStudent.user.addressLine1 && <p>{selectedStudent.user.addressLine1}</p>}
                        {selectedStudent.user.addressLine2 && <p>{selectedStudent.user.addressLine2}</p>}
                        <p>{selectedStudent.user.city}, {selectedStudent.user.district}</p>
                        <p>{selectedStudent.user.province}, {selectedStudent.user.country}</p>
                        <p>{selectedStudent.user.postalCode}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p><strong>User Type:</strong> {selectedStudent.user.userType}</p>
                    <p><strong>Created:</strong> {new Date(selectedStudent.user.createdAt).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(selectedStudent.user.updatedAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
