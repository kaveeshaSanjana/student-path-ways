import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateSubjectForm from '@/components/forms/CreateSubjectForm';

const mockSubjects = [
  {
    id: '1',
    code: 'MATH101',
    name: 'Mathematics',
    class: 'Grade 10',
    teacher: 'Mr. Smith',
    credits: 3,
    description: 'Basic mathematics course for grade 10 students.',
    status: 'Active'
  },
  {
    id: '2',
    code: 'SCI101',
    name: 'Science',
    class: 'Grade 10',
    teacher: 'Mrs. Johnson',
    credits: 4,
    description: 'Introduction to science for grade 10 students.',
    status: 'Active'
  },
  {
    id: '3',
    code: 'ENG101',
    name: 'English',
    class: 'Grade 10',
    teacher: 'Mr. Williams',
    credits: 3,
    description: 'English language and literature course for grade 10 students.',
    status: 'Active'
  },
  {
    id: '4',
    code: 'HIST101',
    name: 'History',
    class: 'Grade 10',
    teacher: 'Ms. Brown',
    credits: 3,
    description: 'World history course for grade 10 students.',
    status: 'Inactive'
  }
];

const Subjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  const subjectsColumns = [
    { key: 'code', header: 'Subject Code' },
    { key: 'name', header: 'Subject Name' },
    { key: 'class', header: 'Class' },
    { key: 'teacher', header: 'Teacher' },
    { key: 'credits', header: 'Credits' },
    { key: 'description', header: 'Description' },
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

  const handleCreateSubject = (subjectData: any) => {
    console.log('Creating subject:', subjectData);
    toast({
      title: "Subject Created",
      description: `Subject ${subjectData.name} has been created successfully.`
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditSubject = (subjectData: any) => {
    console.log('Editing subject:', subjectData);
    setSelectedSubject(subjectData);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubject = (subjectData: any) => {
    console.log('Updating subject:', subjectData);
    toast({
      title: "Subject Updated",
      description: `Subject ${subjectData.name} has been updated successfully.`
    });
    setIsEditDialogOpen(false);
    setSelectedSubject(null);
  };

  const handleDeleteSubject = (subjectData: any) => {
    console.log('Deleting subject:', subjectData);
    toast({
      title: "Subject Deleted",
      description: `Subject ${subjectData.name} has been deleted.`,
      variant: "destructive"
    });
  };

  const handleViewSubject = (subjectData: any) => {
    console.log('View subject:', subjectData);
    toast({
      title: "Subject Viewed",
      description: `Viewing subject: ${subjectData.name}`
    });
  };

  const canAdd = AccessControl.hasPermission(user?.role || 'Student', 'add-subjects');
  const canEdit = AccessControl.hasPermission(user?.role || 'Student', 'edit-subjects');
  const canDelete = AccessControl.hasPermission(user?.role || 'Student', 'delete-subjects');

  return (
    <div className="space-y-6">
      <DataTable
        title="Subjects Management"
        data={mockSubjects}
        columns={subjectsColumns}
        onAdd={canAdd ? () => setIsCreateDialogOpen(true) : undefined}
        onEdit={canEdit ? handleEditSubject : undefined}
        onDelete={canDelete ? handleDeleteSubject : undefined}
        onView={handleViewSubject}
        searchPlaceholder="Search subjects..."
        allowAdd={canAdd}
        allowEdit={canEdit}
        allowDelete={canDelete}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Subject</DialogTitle>
          </DialogHeader>
          <CreateSubjectForm
            onSubmit={handleCreateSubject}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <CreateSubjectForm
            initialData={selectedSubject}
            onSubmit={handleUpdateSubject}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedSubject(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
