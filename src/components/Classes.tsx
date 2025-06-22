
import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateClassForm from '@/components/forms/CreateClassForm';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockClasses = [
  {
    id: '1',
    name: 'Grade 10 - A',
    code: 'G10A',
    capacity: 30,
    enrolled: 28,
    teacher: 'John Smith',
    room: 'Room 101',
    status: 'Active',
    subjects: 8,
    assignedTeachers: ['John Smith', 'Sarah Johnson']
  },
  {
    id: '2',
    name: 'Grade 10 - B',
    code: 'G10B',
    capacity: 30,
    enrolled: 25,
    teacher: 'Sarah Johnson',
    room: 'Room 102',
    status: 'Active',
    subjects: 8,
    assignedTeachers: ['Sarah Johnson', 'Michael Brown']
  },
  {
    id: '3',
    name: 'Grade 11 - Science',
    code: 'G11S',
    capacity: 25,
    enrolled: 23,
    teacher: 'Michael Brown',
    room: 'Room 201',
    status: 'Active',
    subjects: 10,
    assignedTeachers: ['Michael Brown', 'Emily Davis']
  },
  {
    id: '4',
    name: 'Grade 12 - Commerce',
    code: 'G12C',
    capacity: 20,
    enrolled: 18,
    teacher: 'Emily Davis',
    room: 'Room 301',
    status: 'Inactive',
    subjects: 6,
    assignedTeachers: ['Emily Davis']
  }
];

const mockTeachers = [
  { id: '1', name: 'John Smith', subject: 'Mathematics' },
  { id: '2', name: 'Sarah Johnson', subject: 'Science' },
  { id: '3', name: 'Michael Brown', subject: 'Physics' },
  { id: '4', name: 'Emily Davis', subject: 'English' },
  { id: '5', name: 'Dr. Alice Johnson', subject: 'Chemistry' }
];

const Classes = () => {
  const { user, setSelectedClass } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignTeacherDialogOpen, setIsAssignTeacherDialogOpen] = useState(false);
  const [selectedClassData, setSelectedClassData] = useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const classesColumns = [
    { key: 'name', header: 'Class Name' },
    { key: 'code', header: 'Class Code' },
    { key: 'teacher', header: 'Main Teacher' },
    { key: 'room', header: 'Room' },
    { 
      key: 'enrolled', 
      header: 'Students',
      render: (value: number, row: any) => `${value}/${row.capacity}`
    },
    { key: 'subjects', header: 'Subjects' },
    { 
      key: 'assignedTeachers',
      header: 'Assigned Teachers',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.map((teacher, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {teacher}
            </Badge>
          ))}
        </div>
      )
    },
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

  const handleCreateClass = (classData: any) => {
    console.log('Creating class:', classData);
    toast({
      title: "Class Created",
      description: `Class ${classData.name} has been created successfully.`
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditClass = (classData: any) => {
    console.log('Editing class:', classData);
    setSelectedClassData(classData);
    setIsEditDialogOpen(true);
  };

  const handleUpdateClass = (classData: any) => {
    console.log('Updating class:', classData);
    toast({
      title: "Class Updated",
      description: `Class ${classData.name} has been updated successfully.`
    });
    setIsEditDialogOpen(false);
    setSelectedClassData(null);
  };

  const handleDeleteClass = (classData: any) => {
    console.log('Deleting class:', classData);
    toast({
      title: "Class Deleted",
      description: `Class ${classData.name} has been deleted.`,
      variant: "destructive"
    });
  };

  const handleViewClass = (classData: any) => {
    setSelectedClass(classData);
    toast({
      title: "Class Selected",
      description: `Selected class: ${classData.name}`
    });
  };

  const handleAssignTeacher = (classData: any) => {
    setSelectedClassData(classData);
    setIsAssignTeacherDialogOpen(true);
  };

  const handleConfirmTeacherAssignment = () => {
    if (selectedTeacher && selectedClassData) {
      toast({
        title: "Teacher Assigned",
        description: `${selectedTeacher} has been assigned to ${selectedClassData.name}`
      });
      setIsAssignTeacherDialogOpen(false);
      setSelectedTeacher('');
      setSelectedClassData(null);
    }
  };

  const canAdd = AccessControl.hasPermission(user?.role || 'Student', 'add-classes');
  const canEdit = AccessControl.hasPermission(user?.role || 'Student', 'edit-classes');
  const canDelete = AccessControl.hasPermission(user?.role || 'Student', 'delete-classes');
  const canAssignTeachers = AccessControl.hasPermission(user?.role || 'Student', 'assign-teachers');

  return (
    <div className="space-y-6">
      <DataTable
        title="Classes Management"
        data={mockClasses}
        columns={classesColumns}
        onAdd={canAdd ? () => setIsCreateDialogOpen(true) : undefined}
        onEdit={canEdit ? handleEditClass : undefined}
        onDelete={canDelete ? handleDeleteClass : undefined}
        onView={handleViewClass}
        searchPlaceholder="Search classes..."
        allowAdd={canAdd}
        allowEdit={canEdit}
        allowDelete={canDelete}
        customActions={[
          {
            label: 'Assign Teacher',
            action: handleAssignTeacher,
            variant: 'outline',
            condition: () => canAssignTeachers
          }
        ]}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
          </DialogHeader>
          <CreateClassForm
            onSubmit={handleCreateClass}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          <CreateClassForm
            initialData={selectedClassData}
            onSubmit={handleUpdateClass}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedClassData(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Assign Teacher Dialog */}
      <Dialog open={isAssignTeacherDialogOpen} onOpenChange={setIsAssignTeacherDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Teacher to {selectedClassData?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Teacher</label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.name}>
                      {teacher.name} - {teacher.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAssignTeacherDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmTeacherAssignment}
                disabled={!selectedTeacher}
              >
                Assign Teacher
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classes;
