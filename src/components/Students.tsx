import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateStudentForm from '@/components/forms/CreateStudentForm';

const mockStudents = [
  {
    id: '1',
    studentId: 'STU001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    class: 'Grade 10-A',
    enrollmentDate: '2024-01-15',
    status: 'Active',
    guardian: 'Jane Doe',
    guardianPhone: '+1 (555) 987-6543'
  },
  {
    id: '2',
    studentId: 'STU002',
    name: 'Sarah Smith',
    email: 'sarah.smith@email.com',
    phone: '+1 (555) 234-5678',
    class: 'Grade 11-S',
    enrollmentDate: '2024-01-10',
    status: 'Active',
    guardian: 'Mike Smith',
    guardianPhone: '+1 (555) 876-5432'
  },
  {
    id: '3',
    studentId: 'STU003',
    name: 'Michael Johnson',
    email: 'michael.j@email.com',
    phone: '+1 (555) 345-6789',
    class: 'Grade 12-C',
    enrollmentDate: '2023-09-01',
    status: 'Inactive',
    guardian: 'Lisa Johnson',
    guardianPhone: '+1 (555) 765-4321'
  }
];

const Students = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log('Loading students data...');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStudentsData(mockStudents);
      setDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${mockStudents.length} students.`
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load students data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
    }
  ];

  const handleCreateStudent = (studentData: any) => {
    console.log('Creating student:', studentData);
    toast({
      title: "Student Created",
      description: `Student ${studentData.name} has been created successfully.`
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditStudent = (student: any) => {
    console.log('Edit student:', student);
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStudent = (studentData: any) => {
    console.log('Updating student:', studentData);
    toast({
      title: "Student Updated",
      description: `Student ${studentData.name} has been updated successfully.`
    });
    setIsEditDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleDeleteStudent = (student: any) => {
    console.log('Delete student:', student);
    toast({
      title: "Student Deleted",
      description: `Student ${student.name} has been deleted.`,
      variant: "destructive"
    });
  };

  const handleViewStudent = (student: any) => {
    console.log('View student details:', student);
    toast({
      title: "View Student",
      description: `Viewing student: ${student.name}`
    });
  };

  const canAdd = AccessControl.hasPermission(user?.role || 'Student' as const, 'create-student');
  const canEdit = AccessControl.hasPermission(user?.role || 'Student' as const, 'edit-student');
  const canDelete = AccessControl.hasPermission(user?.role || 'Student' as const, 'delete-student');

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
            initialData={selectedStudent}
            onSubmit={handleUpdateStudent}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedStudent(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
