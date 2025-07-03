
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateSubjectForm from '@/components/forms/CreateSubjectForm';

interface SubjectsProps {
  apiLevel?: 'institute' | 'class' | 'subject';
}

const mockSubjects = [
  {
    id: '1',
    code: 'MATH101',
    name: 'Mathematics',
    class: 'Grade 10 - A',
    teacher: 'Mr. Smith',
    credits: 3,
    description: 'Basic mathematics course for grade 10 students.',
    status: 'Active',
    institute: 'Main Campus'
  },
  {
    id: '2',
    code: 'SCI101',
    name: 'Science',
    class: 'Grade 10 - A',
    teacher: 'Mrs. Johnson',
    credits: 4,
    description: 'Introduction to science for grade 10 students.',
    status: 'Active',
    institute: 'Main Campus'
  },
  {
    id: '3',
    code: 'ENG101',
    name: 'English',
    class: 'Grade 10 - B',
    teacher: 'Mr. Williams',
    credits: 3,
    description: 'English language and literature course for grade 10 students.',
    status: 'Active',
    institute: 'Main Campus'
  },
  {
    id: '4',
    code: 'HIST101',
    name: 'History',
    class: 'Grade 11 - Science',
    teacher: 'Ms. Brown',
    credits: 3,
    description: 'World history course for grade 11 students.',
    status: 'Inactive',
    institute: 'Science Branch'
  }
];

const Subjects = ({ apiLevel = 'institute' }: SubjectsProps) => {
  const { user, selectedInstitute, selectedClass } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [subjectsData, setSubjectsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log(`Loading subjects data for API level: ${apiLevel}`);
    console.log(`Current context - Institute: ${selectedInstitute?.name}, Class: ${selectedClass?.name}`);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate filtering based on API level
      let filteredData = mockSubjects;
      if (apiLevel === 'class' && selectedClass) {
        // Class level: show subjects for selected class
        filteredData = mockSubjects.filter(subject => subject.class === selectedClass.name);
      } else if (apiLevel === 'institute' && selectedInstitute) {
        // Institute level: show subjects for selected institute
        filteredData = mockSubjects.filter(subject => subject.institute === selectedInstitute.name);
      }
      
      setSubjectsData(filteredData);
      setDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${filteredData.length} subjects.`
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load subjects data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLoadData();
  }, [apiLevel, selectedInstitute, selectedClass]);

  const subjectsColumns = [
    { key: 'code', header: 'Subject Code' },
    { key: 'name', header: 'Subject Name' },
    { key: 'class', header: 'Class' },
    { key: 'teacher', header: 'Teacher' },
    { key: 'credits', header: 'Credits' },
    { key: 'institute', header: 'Institute' },
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

  const handleCreateSubject = async (subjectData: any) => {
    console.log('Creating subject:', subjectData);
    
    try {
      setIsLoading(true);
      
      // Call the POST /subjects API
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subjectData)
      });

      if (!response.ok) {
        throw new Error('Failed to create subject');
      }

      const result = await response.json();
      console.log('Subject created successfully:', result);
      
      toast({
        title: "Subject Created",
        description: `Subject ${subjectData.name} has been created successfully.`
      });
      
      setIsCreateDialogOpen(false);
      
      // Refresh the data to show the new subject
      await handleLoadData();
      
    } catch (error) {
      console.error('Error creating subject:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create subject. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

  const userRole = user?.role || 'Student';
  const canAdd = AccessControl.hasPermission(userRole, 'create-subject');
  const canEdit = AccessControl.hasPermission(userRole, 'edit-subject');
  const canDelete = AccessControl.hasPermission(userRole, 'delete-subject');

  const getTitle = () => {
    let title = 'All Subjects';
    if (apiLevel === 'class' && selectedClass) {
      title += ` (${selectedClass.name})`;
    } else if (apiLevel === 'institute' && selectedInstitute) {
      title += ` (${selectedInstitute.name})`;
    }
    return title;
  };

  return (
    <div className="space-y-6">
      {!dataLoaded ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {getTitle()}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load subjects data
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
            title={getTitle()}
            data={subjectsData}
            columns={subjectsColumns}
            onAdd={canAdd ? () => setIsCreateDialogOpen(true) : undefined}
            onEdit={canEdit ? handleEditSubject : undefined}
            onDelete={canDelete ? handleDeleteSubject : undefined}
            onView={handleViewSubject}
            searchPlaceholder="Search subjects..."
          />
        </>
      )}

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
