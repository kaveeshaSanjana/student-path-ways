
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateSubjectForm from '@/components/forms/CreateSubjectForm';

interface SubjectsProps {
  apiLevel?: 'institute' | 'class' | 'subject';
}

interface Subject {
  id: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  creditHours?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const Subjects = ({ apiLevel = 'institute' }: SubjectsProps) => {
  const { user, selectedInstitute, selectedClass } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjectsData, setSubjectsData] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const baseUrl = localStorage.getItem('baseUrl') || 'https://a174-123-231-85-77.ngrok-free.app';

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log(`Loading subjects data for API level: ${apiLevel}`);
    console.log(`Current context - Institute: ${selectedInstitute?.name}, Class: ${selectedClass?.name}`);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${baseUrl}/subjects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if (response.status === 404) {
        setSubjectsData([]);
        setDataLoaded(true);
        toast({
          title: "No Subjects Found",
          description: "There are no subjects available according to the current filters.",
          variant: "default"
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSubjectsData(data);
      setDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${data.length} subjects.`
      });
    } catch (error: any) {
      console.error('Error loading subjects:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load subjects data. Please check if the backend is running.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataLoaded) {
      handleLoadData();
    }
  }, [apiLevel, selectedInstitute, selectedClass]);

  const subjectsColumns = [
    { key: 'code', header: 'Subject Code' },
    { key: 'name', header: 'Subject Name' },
    { key: 'description', header: 'Description' },
    { key: 'category', header: 'Category' },
    { key: 'creditHours', header: 'Credit Hours' },
    { 
      key: 'isActive', 
      header: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      header: 'Created At',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const handleCreateSubject = async (subjectData: any) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${baseUrl}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(subjectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subject');
      }

      const newSubject = await response.json();
      setSubjectsData(prev => [...prev, newSubject]);
      toast({
        title: "Subject Created",
        description: `Subject ${subjectData.name} has been created successfully.`
      });
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditSubject = (subjectData: Subject) => {
    setSelectedSubject(subjectData);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubject = async (subjectData: any) => {
    if (!selectedSubject) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${baseUrl}/subjects/${selectedSubject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(subjectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update subject');
      }

      const updatedSubject = await response.json();
      setSubjectsData(prev => prev.map(subject => 
        subject.id === selectedSubject.id ? updatedSubject : subject
      ));
      toast({
        title: "Subject Updated",
        description: `Subject ${subjectData.name} has been updated successfully.`
      });
      setIsEditDialogOpen(false);
      setSelectedSubject(null);
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteSubject = async (subjectData: Subject) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${baseUrl}/subjects/${subjectData.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete subject');
      }

      setSubjectsData(prev => prev.filter(subject => subject.id !== subjectData.id));
      toast({
        title: "Subject Deleted",
        description: `Subject ${subjectData.name} has been deleted.`,
        variant: "destructive"
      });
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const userRole = user?.role || 'Student';
  const canAdd = AccessControl.hasPermission(userRole, 'create-subject');
  const canEdit = AccessControl.hasPermission(userRole, 'edit-subject');
  const canDelete = AccessControl.hasPermission(userRole, 'delete-subject');

  return (
    <div className="space-y-6">
      {!dataLoaded ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            All Subjects {apiLevel === 'institute' ? `(${selectedInstitute?.name || 'All Institutes'})` : ''}
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
            title={`All Subjects ${apiLevel === 'institute' ? `(${selectedInstitute?.name || 'All Institutes'})` : ''}`}
            data={subjectsData}
            columns={subjectsColumns}
            onAdd={canAdd ? () => setIsCreateDialogOpen(true) : undefined}
            onEdit={canEdit ? handleEditSubject : undefined}
            onDelete={canDelete ? handleDeleteSubject : undefined}
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
