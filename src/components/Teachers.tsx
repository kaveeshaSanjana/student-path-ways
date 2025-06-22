import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateTeacherForm from '@/components/forms/CreateTeacherForm';

const mockTeachers = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Dr. Alice Johnson',
    email: 'alice.johnson@institute.edu',
    phone: '+1 (555) 111-2222',
    subjects: 'Mathematics, Statistics',
    classes: 'Grade 10-A, Grade 11-S',
    qualification: 'PhD in Mathematics',
    experience: '12 years',
    joinDate: '2020-08-15',
    status: 'Active'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Prof. Robert Brown',
    email: 'robert.brown@institute.edu',
    phone: '+1 (555) 222-3333',
    subjects: 'Physics, Chemistry',
    classes: 'Grade 11-S, Grade 12-S',
    qualification: 'MSc in Physics',
    experience: '8 years',
    joinDate: '2022-01-10',
    status: 'Active'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Ms. Emily Davis',
    email: 'emily.davis@institute.edu',
    phone: '+1 (555) 333-4444',
    subjects: 'English Literature',
    classes: 'Grade 10-A, Grade 10-B',
    qualification: 'MA in English',
    experience: '6 years',
    joinDate: '2021-09-01',
    status: 'On Leave'
  }
];

const Teachers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  const teachersColumns = [
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'name', header: 'Full Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'subjects', header: 'Subjects' },
    { key: 'classes', header: 'Classes' },
    { key: 'qualification', header: 'Qualification' },
    { key: 'experience', header: 'Experience' },
    { key: 'joinDate', header: 'Join Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Active' ? 'default' : 
          value === 'On Leave' ? 'secondary' : 
          'destructive'
        }>
          {value}
        </Badge>
      )
    }
  ];

  const handleAddTeacher = () => {
    console.log('Add new teacher');
  };

  const handleEditTeacher = (teacher: any) => {
    console.log('Edit teacher:', teacher);
    setSelectedTeacher(teacher);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTeacher = (teacherData: any) => {
    console.log('Updating teacher:', teacherData);
    toast({
      title: "Teacher Updated",
      description: `Teacher ${teacherData.name} has been updated successfully.`
    });
    setIsEditDialogOpen(false);
    setSelectedTeacher(null);
  };

  const handleDeleteTeacher = (teacher: any) => {
    console.log('Delete teacher:', teacher);
    toast({
      title: "Teacher Deleted",
      description: `Teacher ${teacher.name} has been deleted.`,
      variant: "destructive"
    });
  };

  const handleViewTeacher = (teacher: any) => {
    console.log('View teacher details:', teacher);
    toast({
      title: "View Teacher",
      description: `Viewing teacher: ${teacher.name}`
    });
  };

  const handleCreateTeacher = (teacherData: any) => {
    console.log('Creating teacher:', teacherData);
    toast({
      title: "Teacher Created",
      description: `Teacher ${teacherData.name} has been created successfully.`
    });
    setIsCreateDialogOpen(false);
  };

  const canAdd = AccessControl.hasPermission(user?.role || 'Student' as const, 'create-teacher');
  const canEdit = AccessControl.hasPermission(user?.role || 'Student' as const, 'edit-teacher');
  const canDelete = AccessControl.hasPermission(user?.role || 'Student' as const, 'delete-teacher');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Teachers Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage teaching staff, assignments, and professional information
        </p>
      </div>

      <DataTable
        title="Teachers"
        data={mockTeachers}
        columns={teachersColumns}
        onAdd={canAdd ? () => setIsCreateDialogOpen(true) : undefined}
        onEdit={canEdit ? handleEditTeacher : undefined}
        onDelete={canDelete ? handleDeleteTeacher : undefined}
        onView={handleViewTeacher}
        searchPlaceholder="Search teachers..."
        allowAdd={canAdd}
        allowEdit={canEdit}
        allowDelete={canDelete}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Teacher</DialogTitle>
          </DialogHeader>
          <CreateTeacherForm
            onSubmit={handleCreateTeacher}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>
          <CreateTeacherForm
            initialData={selectedTeacher}
            onSubmit={handleUpdateTeacher}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedTeacher(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teachers;
