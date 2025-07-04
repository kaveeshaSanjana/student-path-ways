import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateSubjectForm from '@/components/forms/CreateSubjectForm';

interface SubjectsProps {
  apiLevel?: 'institute' | 'class' | 'subject';
}

const Subjects = ({ apiLevel = 'institute' }: SubjectsProps) => {
  const { user, selectedInstitute, selectedClass, selectedSubject, currentInstituteId, currentClassId, currentSubjectId } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubjectData, setSelectedSubjectData] = useState<any>(null);
  const [subjectsData, setSubjectsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    // Add context-aware filtering
    if (currentInstituteId) {
      params.append('instituteId', currentInstituteId);
    }

    if (currentClassId) {
      params.append('classId', currentClassId);
    }

    if (currentSubjectId) {
      params.append('subjectId', currentSubjectId);
    }

    return params;
  };

  const buildRequestBody = (additionalData: any = {}) => {
    const body: any = { ...additionalData };

    if (currentInstituteId) {
      body.instituteId = currentInstituteId;
    }

    if (currentClassId) {
      body.classId = currentClassId;
    }

    if (currentSubjectId) {
      body.subjectId = currentSubjectId;
    }

    return body;
  };

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log(`Loading subjects data for API level: ${apiLevel}`);
    console.log(`Current context - Institute: ${selectedInstitute?.name}, Class: ${selectedClass?.name}, Subject: ${selectedSubject?.name}`);
    
    try {
      const baseUrl = getBaseUrl();
      const headers = getApiHeaders();
      const params = buildQueryParams();
      
      const url = params.toString() ? `${baseUrl}/subjects?${params}` : `${baseUrl}/subjects`;
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subjects data');
      }

      const result = await response.json();
      console.log('Subjects loaded successfully:', result);
      
      // Handle both array response and paginated response
      const subjects = Array.isArray(result) ? result : result.data || [];
      setSubjectsData(subjects);
      setDataLoaded(true);
      
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${subjects.length} subjects.`
      });
    } catch (error) {
      console.error('Failed to load subjects:', error);
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
  }, [apiLevel, selectedInstitute, selectedClass, selectedSubject]);

  const subjectsColumns = [
    { key: 'code', header: 'Subject Code' },
    { key: 'name', header: 'Subject Name' },
    { key: 'category', header: 'Category' },
    { key: 'creditHours', header: 'Credit Hours' },
    { key: 'description', header: 'Description' },
    { 
      key: 'isActive', 
      header: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const handleCreateSubject = async (subjectData: any) => {
    console.log('Creating subject:', subjectData);
    
    try {
      setIsLoading(true);
      const baseUrl = getBaseUrl();
      const headers = getApiHeaders();
      
      const requestBody = buildRequestBody({
        name: subjectData.name,
        code: subjectData.code,
        category: subjectData.category,
        creditHours: subjectData.creditHours,
        description: subjectData.description,
        isActive: subjectData.isActive
      });
      
      const response = await fetch(`${baseUrl}/subjects`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
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

  const handleEditSubject = async (subjectData: any) => {
    console.log('Loading subject for editing:', subjectData);
    
    try {
      setIsLoading(true);
      const baseUrl = getBaseUrl();
      const headers = getApiHeaders();
      const params = buildQueryParams();
      
      const url = params.toString() ? `${baseUrl}/subjects/${subjectData.id}?${params}` : `${baseUrl}/subjects/${subjectData.id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subject details');
      }

      const result = await response.json();
      console.log('Subject details loaded:', result);
      
      setSelectedSubjectData(result);
      setIsEditDialogOpen(true);
      
    } catch (error) {
      console.error('Error loading subject details:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load subject details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubject = async (subjectData: any) => {
    console.log('Updating subject:', subjectData);
    
    try {
      setIsLoading(true);
      const baseUrl = getBaseUrl();
      const headers = getApiHeaders();
      
      const requestBody = buildRequestBody({
        name: subjectData.name,
        description: subjectData.description,
        creditHours: subjectData.creditHours,
        category: subjectData.category
      });
      
      const response = await fetch(`${baseUrl}/subjects/${selectedSubjectData.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to update subject');
      }

      const result = await response.json();
      console.log('Subject updated successfully:', result);
      
      toast({
        title: "Subject Updated",
        description: `Subject ${subjectData.name} has been updated successfully.`
      });
      
      setIsEditDialogOpen(false);
      setSelectedSubjectData(null);
      await handleLoadData();
      
    } catch (error) {
      console.error('Error updating subject:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update subject. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubject = async (subjectData: any) => {
    console.log('Deleting subject:', subjectData);
    
    try {
      setIsLoading(true);
      const baseUrl = getBaseUrl();
      const headers = getApiHeaders();
      
      const response = await fetch(`${baseUrl}/subjects/${subjectData.id}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to delete subject');
      }

      console.log('Subject deleted successfully');
      
      toast({
        title: "Subject Deleted",
        description: `Subject ${subjectData.name} has been deleted successfully.`,
        variant: "destructive"
      });
      
      await handleLoadData();
      
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete subject. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSubject = (subjectData: any) => {
    console.log('View subject:', subjectData);
    toast({
      title: "Subject Viewed",
      description: `Viewing subject: ${subjectData.name}`
    });
  };

  const userRole = (user?.role || 'Student') as UserRole;
  const canAdd = AccessControl.hasPermission(userRole, 'create-subject');
  const canEdit = AccessControl.hasPermission(userRole, 'edit-subject');
  const canDelete = AccessControl.hasPermission(userRole, 'delete-subject');

  const getTitle = () => {
    const contexts = [];
    
    if (selectedInstitute) {
      contexts.push(selectedInstitute.name);
    }
    
    if (selectedClass) {
      contexts.push(selectedClass.name);
    }
    
    if (selectedSubject) {
      contexts.push(selectedSubject.name);
    }
    
    let title = 'All Subjects';
    if (contexts.length > 0) {
      title += ` (${contexts.join(' → ')})`;
    }
    
    return title;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getTitle()}
            </h1>
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
            title=""
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
            initialData={selectedSubjectData}
            onSubmit={handleUpdateSubject}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedSubjectData(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
