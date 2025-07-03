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
import { GraduationCap, Phone, Mail, MapPin, Heart, RefreshCw } from 'lucide-react';
import CreateStudentForm from '@/components/forms/CreateStudentForm';

interface Student {
  userId: string;
  studentId: string;
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
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const { toast } = useToast();

  const getBaseUrl = () => {
    return localStorage.getItem('baseUrl') || 'http://localhost:3000';
  };

  const getAuthToken = () => {
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken');
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
        limit: itemsPerPage.toString()
      });

      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter);
      }

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      if (gradeFilter !== 'all') {
        params.append('grade', gradeFilter);
      }

      console.log('Fetching students with params:', params.toString());

      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/students?${params}`, {
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
      setDataLoaded(true);
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

  useEffect(() => {
    if (!dataLoaded) {
      fetchStudents();
    }
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      fetchStudents();
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, gradeFilter]);

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowViewDialog(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowEditDialog(true);
  };

  const handleDeleteStudent = async (student: Student) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/students/${student.userId}`, {
        method: 'DELETE',
        headers: getApiHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      toast({
        title: "Student Deleted",
        description: `Student ${student.user.firstName} ${student.user.lastName} has been deleted.`,
        variant: "destructive"
      });
      
      await fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete student. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateStudent = async (studentData: any) => {
    try {
      setLoading(true);
      
      const headers = getApiHeaders();
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/students`, {
        method: 'POST',
        headers,
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      toast({
        title: "Student Created",
        description: `Student ${studentData.firstName} ${studentData.lastName} has been created successfully.`
      });
      
      setShowCreateDialog(false);
      await fetchStudents();
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create student. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (studentData: any) => {
    if (!selectedStudent) return;
    
    try {
      setLoading(true);
      
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/students/${selectedStudent.userId}`, {
        method: 'PATCH',
        headers: getApiHeaders(),
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      toast({
        title: "Student Updated",
        description: `Student ${studentData.firstName} ${studentData.lastName} has been updated successfully.`
      });
      
      setShowEditDialog(false);
      setSelectedStudent(null);
      await fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update student. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'user.firstName',
      header: 'Student',
      render: (value: any, row: Student) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.user.imageUrl} alt={row.user.firstName} />
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
      key: 'studentId',
      header: 'Student ID',
      render: (value: string) => value || 'N/A'
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-600 mt-1">Manage student accounts and information</p>
        </div>
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <Badge variant="outline" className="text-sm">
            {totalItems} Total Students
          </Badge>
        </div>
      </div>

      {!dataLoaded ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Students Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load students data
          </p>
          <Button 
            onClick={fetchStudents} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
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
          <div className="flex flex-wrap gap-4 items-end mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="min-w-[150px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                    <SelectItem key={grade} value={grade.toString()}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={fetchStudents} 
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>

          <DataTable
            title=""
            data={students}
            columns={columns}
            onAdd={() => setShowCreateDialog(true)}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onView={handleViewStudent}
            searchPlaceholder="Search students..."
            currentPage={currentPage}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}

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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <CreateStudentForm
            initialData={selectedStudent}
            onSubmit={handleUpdateStudent}
            onCancel={() => {
              setShowEditDialog(false);
              setSelectedStudent(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedStudent.user.imageUrl} alt={selectedStudent.user.firstName} />
                  <AvatarFallback>
                    {selectedStudent.user.firstName.charAt(0)}{selectedStudent.user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedStudent.user.firstName} {selectedStudent.user.lastName}
                  </h3>
                  <p className="text-gray-600">Student ID: {selectedStudent.studentId}</p>
                  <Badge variant={selectedStudent.user.isActive ? "default" : "secondary"}>
                    {selectedStudent.user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email:</label>
                  <p className="text-sm">{selectedStudent.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone:</label>
                  <p className="text-sm">{selectedStudent.user.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Emergency Contact:</label>
                  <p className="text-sm">{selectedStudent.emergencyContact}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Blood Group:</label>
                  <p className="text-sm">{selectedStudent.bloodGroup}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth:</label>
                  <p className="text-sm">{selectedStudent.user.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender:</label>
                  <p className="text-sm">{selectedStudent.user.gender}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Address:</label>
                <p className="text-sm">
                  {selectedStudent.user.addressLine1}
                  {selectedStudent.user.addressLine2 && `, ${selectedStudent.user.addressLine2}`}
                  <br />
                  {selectedStudent.user.city}, {selectedStudent.user.district}, {selectedStudent.user.province}
                  <br />
                  {selectedStudent.user.postalCode}, {selectedStudent.user.country}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Allergies:</label>
                <p className="text-sm">{selectedStudent.allergies || 'None'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Medical Conditions:</label>
                <p className="text-sm">{selectedStudent.medicalConditions || 'None'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
