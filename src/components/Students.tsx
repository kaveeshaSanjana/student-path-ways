import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Eye, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreateStudentForm from '@/components/forms/CreateStudentForm';
import AssignParentForm from '@/components/forms/AssignParentForm';

const Students = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAssignParentDialogOpen, setIsAssignParentDialogOpen] = useState(false);
  const [isParentViewDialogOpen, setIsParentViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [studentIdFilter, setStudentIdFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const BASE_URL = 'https://a174-123-231-85-77.ngrok-free.app';

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('limit', '10');
    
    if (statusFilter !== 'all') {
      params.append('isActive', statusFilter);
    }
    
    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }
    
    return params.toString();
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    console.log('Loading students data...');
    
    try {
      const token = localStorage.getItem('authToken');
      const queryParams = buildQueryParams();
      
      const response = await fetch(`${BASE_URL}/students?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      
      // Transform the data to match the table structure
      const transformedData = data.data.map((item: any) => ({
        id: item.userId,
        studentId: item.studentId || item.user?.id || item.userId,
        name: `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim(),
        email: item.user?.email || '',
        phone: item.user?.phone || '',
        class: 'N/A',
        guardian: 'N/A',
        guardianPhone: 'N/A',
        enrollmentDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
        status: item.isActive ? 'Active' : 'Inactive',
        user: item.user,
        originalData: item,
        fatherId: item.fatherId,
        motherId: item.motherId,
        guardianId: item.guardianId
      }));

      setStudentsData(transformedData);
      setTotalCount(data.meta?.total || 0);
      setDataLoaded(true);
      
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${transformedData.length} students.`
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load students data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentById = async (id: string) => {
    if (!id.trim()) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${BASE_URL}/students/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error('Student not found');
      }

      const data = await response.json();
      
      // Transform single student data
      const transformedStudent = {
        id: data.userId,
        studentId: data.studentId || data.user?.id || data.userId,
        name: `${data.user?.firstName || ''} ${data.user?.lastName || ''}`.trim(),
        email: data.user?.email || '',
        phone: data.user?.phone || '',
        class: 'N/A',
        guardian: 'N/A',
        guardianPhone: 'N/A',
        enrollmentDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '',
        status: data.isActive ? 'Active' : 'Inactive',
        user: data.user,
        originalData: data,
        fatherId: data.fatherId,
        motherId: data.motherId,
        guardianId: data.guardianId
      };

      setStudentsData([transformedStudent]);
      setTotalCount(1);
      setDataLoaded(true);
      
      toast({
        title: "Student Found",
        description: `Found student: ${transformedStudent.name}`
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      toast({
        title: "Student Not Found",
        description: "Could not find student with the provided ID.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadData = () => {
    if (studentIdFilter.trim()) {
      fetchStudentById(studentIdFilter);
    } else {
      fetchStudents();
    }
  };

  const handleCreateStudent = async (studentData: any) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ user: studentData })
      });

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      toast({
        title: "Student Created",
        description: `Student ${studentData.firstName} ${studentData.lastName} has been created successfully.`
      });
      
      setIsCreateDialogOpen(false);
      handleLoadData();
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create student.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStudent = async (studentData: any) => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Include all required fields for student update
      const updateData = {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        phone: studentData.phone,
        userType: "STUDENT",
        nic: studentData.nic,
        birthCertificateNo: studentData.birthCertificateNo,
        city: studentData.city,
        district: studentData.district,
        province: studentData.province,
        postalCode: studentData.postalCode,
        country: studentData.country,
        gender: studentData.gender,
        dateOfBirth: studentData.dateOfBirth,
        isActive: studentData.isActive,
        imageUrl: studentData.imageUrl,
        studentId: selectedStudent.originalData?.studentId,
        emergencyContact: selectedStudent.originalData?.emergencyContact,
        medicalConditions: selectedStudent.originalData?.medicalConditions,
        allergies: selectedStudent.originalData?.allergies,
        bloodGroup: selectedStudent.originalData?.bloodGroup
      };
      
      const response = await fetch(`${BASE_URL}/students/${selectedStudent.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      toast({
        title: "Student Updated",
        description: `Student ${studentData.firstName} ${studentData.lastName} has been updated successfully.`
      });
      
      setIsEditDialogOpen(false);
      setSelectedStudent(null);
      handleLoadData();
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update student.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStudent = async (student: any) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${BASE_URL}/students/${student.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      toast({
        title: "Student Deleted",
        description: `Student ${student.name} has been deleted.`,
        variant: "destructive"
      });
      
      handleLoadData();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete student.",
        variant: "destructive"
      });
    }
  };

  const handleViewStudent = (student: any) => {
    console.log('View student details:', student);
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  const handleEditStudent = (student: any) => {
    console.log('Edit student:', student);
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleAssignParent = (student: any) => {
    console.log('Assign parent to student:', student);
    setSelectedStudent(student);
    setIsAssignParentDialogOpen(true);
  };

  const handleViewParent = async (parentId: string, parentType: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      // First get user data
      const userResponse = await fetch(`${BASE_URL}/users/${parentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch parent user data');
      }

      const userData = await userResponse.json();

      // Then get parent-specific data
      const parentResponse = await fetch(`${BASE_URL}/parents/${parentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!parentResponse.ok) {
        throw new Error('Failed to fetch parent data');
      }

      const parentData = await parentResponse.json();

      setSelectedParent({
        type: parentType,
        user: userData,
        parent: parentData
      });
      setIsParentViewDialogOpen(true);

    } catch (error) {
      console.error('Error fetching parent data:', error);
      toast({
        title: "Error",
        description: "Failed to load parent information.",
        variant: "destructive"
      });
    }
  };

  const handleAssignParentSubmit = async (assignmentData: any) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${BASE_URL}/students/${selectedStudent.id}/assign-parent`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(assignmentData)
      });

      if (!response.ok) {
        throw new Error('Failed to assign parent');
      }

      toast({
        title: "Parent Assigned",
        description: `Parent has been assigned to ${selectedStudent.name} successfully.`
      });
      
      setIsAssignParentDialogOpen(false);
      setSelectedStudent(null);
      handleLoadData();
    } catch (error) {
      console.error('Error assigning parent:', error);
      toast({
        title: "Assignment Failed",
        description: "Failed to assign parent.",
        variant: "destructive"
      });
    }
  };

  const studentsColumns = [
    { key: 'studentId', header: 'Student ID' },
    { key: 'name', header: 'Full Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'class', header: 'Class' },
    { key: 'guardian', header: 'Guardian' },
    { key: 'guardianPhone', header: 'Guardian Phone' },
    { key: 'enrollmentDate', header: 'Enrollment Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'assignParent',
      header: 'Assign Parent',
      render: (value: any, row: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAssignParent(row)}
          className="flex items-center gap-1"
        >
          <Users className="h-3 w-3" />
          Assign
        </Button>
      )
    }
  ];

  const canAdd = AccessControl.hasPermission(user?.role || 'Student' as const, 'create-student');
  const canEdit = AccessControl.hasPermission(user?.role || 'Student' as const, 'edit-student');
  const canDelete = AccessControl.hasPermission(user?.role || 'Student' as const, 'delete-student');

  // Effect to reload data when filters change
  useEffect(() => {
    if (dataLoaded && !studentIdFilter.trim()) {
      fetchStudents();
    }
  }, [statusFilter, searchTerm, currentPage]);

  return (
    <div className="space-y-6">
      {!dataLoaded ? (
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Students Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load students data
          </p>
          
          {/* Filters Section */}
          <Card className="mb-6 mx-auto max-w-4xl">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter students by status, search term, or specific student ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <Input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Student ID</label>
                  <Input
                    type="text"
                    placeholder="Enter student ID"
                    value={studentIdFilter}
                    onChange={(e) => setStudentIdFilter(e.target.value)}
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
              Students Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage student enrollments, information, and academic records
            </p>
          </div>

          {/* Filters for loaded state */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <Input
                  type="text"
                  placeholder="Enter student ID"
                  value={studentIdFilter}
                  onChange={(e) => setStudentIdFilter(e.target.value)}
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
            title="Students Management"
            data={studentsData}
            columns={studentsColumns}
            onAdd={canAdd ? () => setIsCreateDialogOpen(true) : undefined}
            onEdit={canEdit ? handleEditStudent : undefined}
            onDelete={canDelete ? handleDeleteStudent : undefined}
            onView={handleViewStudent}
            searchPlaceholder="Search students..."
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
            <DialogTitle>Create New Student</DialogTitle>
          </DialogHeader>
          <CreateStudentForm
            onSubmit={handleCreateStudent}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <CreateStudentForm
            initialData={selectedStudent?.user}
            onSubmit={handleUpdateStudent}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedStudent(null);
            }}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* Enhanced View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {selectedStudent.user?.imageUrl && (
                <div className="flex justify-center">
                  <img 
                    src={selectedStudent.user.imageUrl} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
              
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Student ID:</strong> {selectedStudent.originalData?.studentId || 'N/A'}</div>
                    <div><strong>Name:</strong> {selectedStudent.name}</div>
                    <div><strong>Email:</strong> {selectedStudent.email}</div>
                    <div><strong>Phone:</strong> {selectedStudent.phone}</div>
                    <div><strong>NIC:</strong> {selectedStudent.user?.nic}</div>
                    <div><strong>Birth Certificate:</strong> {selectedStudent.user?.birthCertificateNo}</div>
                    <div><strong>Date of Birth:</strong> {selectedStudent.user?.dateOfBirth}</div>
                    <div><strong>Gender:</strong> {selectedStudent.user?.gender}</div>
                    <div><strong>City:</strong> {selectedStudent.user?.city}</div>
                    <div><strong>District:</strong> {selectedStudent.user?.district}</div>
                    <div><strong>Province:</strong> {selectedStudent.user?.province}</div>
                    <div><strong>Country:</strong> {selectedStudent.user?.country}</div>
                    <div><strong>Postal Code:</strong> {selectedStudent.user?.postalCode}</div>
                    <div><strong>Status:</strong> 
                      <Badge variant={selectedStudent.status === 'Active' ? 'default' : 'secondary'} className="ml-2">
                        {selectedStudent.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Emergency Contact:</strong> {selectedStudent.originalData?.emergencyContact || 'N/A'}</div>
                    <div><strong>Blood Group:</strong> {selectedStudent.originalData?.bloodGroup || 'N/A'}</div>
                    <div><strong>Medical Conditions:</strong> {selectedStudent.originalData?.medicalConditions || 'None'}</div>
                    <div><strong>Allergies:</strong> {selectedStudent.originalData?.allergies || 'None'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Parent Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Parent Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {selectedStudent.fatherId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewParent(selectedStudent.fatherId, 'Father')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Father
                      </Button>
                    )}
                    {selectedStudent.motherId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewParent(selectedStudent.motherId, 'Mother')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Mother
                      </Button>
                    )}
                    {selectedStudent.guardianId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewParent(selectedStudent.guardianId, 'Guardian')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Guardian
                      </Button>
                    )}
                    {!selectedStudent.fatherId && !selectedStudent.motherId && !selectedStudent.guardianId && (
                      <p className="text-gray-500">No parent information available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Parent Dialog */}
      <Dialog open={isAssignParentDialogOpen} onOpenChange={setIsAssignParentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Parent</DialogTitle>
          </DialogHeader>
          <AssignParentForm
            onSubmit={handleAssignParentSubmit}
            onCancel={() => {
              setIsAssignParentDialogOpen(false);
              setSelectedStudent(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Parent View Dialog */}
      <Dialog open={isParentViewDialogOpen} onOpenChange={setIsParentViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedParent?.type} Details</DialogTitle>
          </DialogHeader>
          {selectedParent && (
            <div className="space-y-4">
              {selectedParent.user?.imageUrl && (
                <div className="flex justify-center">
                  <img 
                    src={selectedParent.user.imageUrl} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
              
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {selectedParent.user?.firstName} {selectedParent.user?.lastName}</div>
                    <div><strong>Email:</strong> {selectedParent.user?.email}</div>
                    <div><strong>Phone:</strong> {selectedParent.user?.phone}</div>
                    <div><strong>NIC:</strong> {selectedParent.user?.nic}</div>
                    <div><strong>Date of Birth:</strong> {selectedParent.user?.dateOfBirth}</div>
                    <div><strong>Gender:</strong> {selectedParent.user?.gender}</div>
                    <div><strong>City:</strong> {selectedParent.user?.city}</div>
                    <div><strong>District:</strong> {selectedParent.user?.district}</div>
                    <div><strong>Province:</strong> {selectedParent.user?.province}</div>
                    <div><strong>Country:</strong> {selectedParent.user?.country}</div>
                    <div><strong>Postal Code:</strong> {selectedParent.user?.postalCode}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Occupation:</strong> {selectedParent.parent?.occupation || 'N/A'}</div>
                    <div><strong>Workplace:</strong> {selectedParent.parent?.workplace || 'N/A'}</div>
                    <div><strong>Work Phone:</strong> {selectedParent.parent?.workPhone || 'N/A'}</div>
                    <div><strong>Education Level:</strong> {selectedParent.parent?.educationLevel || 'N/A'}</div>
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

export default Students;
