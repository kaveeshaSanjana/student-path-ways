import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateClassForm from '@/components/forms/CreateClassForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClassesProps {
  apiLevel?: 'institute' | 'class' | 'subject';
}

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
    assignedTeachers: ['John Smith', 'Sarah Johnson'],
    institute: 'Main Campus'
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
    assignedTeachers: ['Sarah Johnson', 'Michael Brown'],
    institute: 'Main Campus'
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
    assignedTeachers: ['Michael Brown', 'Emily Davis'],
    institute: 'Science Branch'
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
    assignedTeachers: ['Emily Davis'],
    institute: 'Commerce Branch'
  }
];

const mockTeachers = [
  { id: '1', name: 'John Smith', subject: 'Mathematics' },
  { id: '2', name: 'Sarah Johnson', subject: 'Science' },
  { id: '3', name: 'Michael Brown', subject: 'Physics' },
  { id: '4', name: 'Emily Davis', subject: 'English' },
  { id: '5', name: 'Dr. Alice Johnson', subject: 'Chemistry' }
];

const Classes = ({ apiLevel = 'institute' }: ClassesProps) => {
  const { user, setSelectedClass, selectedInstitute } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignTeacherDialogOpen, setIsAssignTeacherDialogOpen] = useState(false);
  const [selectedClassData, setSelectedClassData] = useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [classesData, setClassesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log(`Loading classes data for API level: ${apiLevel}`);
    console.log(`Current context - Institute: ${selectedInstitute?.name}`);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate filtering based on API level
      let filteredData = mockClasses;
      if (apiLevel === 'institute' && selectedInstitute) {
        // Institute level: show classes for selected institute
        filteredData = mockClasses.filter(cls => cls.institute === selectedInstitute.name);
      }
      
      setClassesData(filteredData);
      setDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${filteredData.length} classes.`
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load classes data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLoadData();
  }, [apiLevel, selectedInstitute]);

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
    { key: 'institute', header: 'Institute' },
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

  const userRole = user?.role || 'Student';
  const canAdd = AccessControl.hasPermission(userRole, 'create-class');
  const canEdit = AccessControl.hasPermission(userRole, 'edit-class');
  const canDelete = AccessControl.hasPermission(userRole, 'delete-class');
  const canAssignTeachers = AccessControl.hasPermission(userRole, 'edit-class');

  return (
    <div className="space-y-6">
      {!dataLoaded ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            All Classes {apiLevel === 'institute' ? `(${selectedInstitute?.name || 'All Institutes'})` : ''}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load classes data
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
            title={`All Classes ${apiLevel === 'institute' ? `(${selectedInstitute?.name || 'All Institutes'})` : ''}`}
            data={classesData}
            columns={classesColumns}
            onAdd={canAdd ? () => setIsCreateDialogOpen(true) : undefined}
            onEdit={canEdit ? handleEditClass : undefined}
            onDelete={canDelete ? handleDeleteClass : undefined}
            onView={handleViewClass}
            searchPlaceholder="Search classes..."
            customActions={[
              {
                label: 'Assign Teacher',
                action: handleAssignTeacher,
                variant: 'outline',
                condition: () => canAssignTeachers
              }
            ]}
          />
        </>
      )}

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
