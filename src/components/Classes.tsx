
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ClassesProps {
  apiLevel?: 'institute' | 'class' | 'subject';
}

interface ClassData {
  id: string;
  instituteId: string;
  name: string;
  code: string;
  academicYear: string;
  level: number;
  grade: number;
  specialty: string;
  classType: string;
  capacity: number;
  classTeacherId: string;
  description: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  enrollmentCode: string | null;
  enrollmentEnabled: boolean;
  requireTeacherVerification: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: ClassData[];
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

const BASE_URL = 'http://localhost:3000';

const Classes = ({ apiLevel = 'institute' }: ClassesProps) => {
  const { user, setSelectedClass, selectedInstitute } = useAuth();
  const { toast } = useToast();
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEnrollmentDialogOpen, setIsEnrollmentDialogOpen] = useState(false);
  
  // Data states
  const [selectedClassData, setSelectedClassData] = useState<ClassData | null>(null);
  const [classesData, setClassesData] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('true');
  
  // Enrollment form states
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [requireTeacherVerification, setRequireTeacherVerification] = useState(true);

  const getAuthToken = () => {
    const token = localStorage.getItem('access_token');
    console.log('Auth token check:', token ? 'Token found' : 'No token found');
    if (!token) {
      console.error('No authentication token found in localStorage');
      toast({
        title: "Authentication Error",
        description: "No authentication token found. Please login again.",
        variant: "destructive"
      });
      return null;
    }
    return token;
  };

  const getApiHeaders = () => {
    const token = getAuthToken();
    if (!token) return null;
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleLoadData = async (page = 1, limit = itemsPerPage) => {
    setIsLoading(true);
    console.log(`Loading classes data for API level: ${apiLevel}`);
    console.log(`Current context - Institute: ${selectedInstitute?.name}`);
    
    const headers = getApiHeaders();
    if (!headers) {
      setIsLoading(false);
      return;
    }

    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        isActive: activeFilter
      });

      if (selectedInstitute?.id) {
        params.append('instituteId', selectedInstitute.id);
      }

      if (gradeFilter) {
        params.append('grade', gradeFilter);
      }

      const url = `${BASE_URL}/institute-classes?${params.toString()}`;
      console.log(`API Request URL: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      console.log('Classes API Response:', result);

      setClassesData(result.data);
      setTotalItems(result.meta.total);
      setTotalPages(result.meta.totalPages);
      setCurrentPage(result.meta.page);
      setDataLoaded(true);
      
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${result.data.length} classes.`
      });
    } catch (error) {
      console.error('Failed to load classes:', error);
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
    if (selectedInstitute?.id) {
      handleLoadData();
    }
  }, [apiLevel, selectedInstitute, gradeFilter, activeFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleLoadData(page, itemsPerPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    handleLoadData(1, newItemsPerPage);
  };

  const classesColumns = [
    { key: 'name', header: 'Class Name' },
    { key: 'code', header: 'Class Code' },
    { key: 'academicYear', header: 'Academic Year' },
    { key: 'grade', header: 'Grade' },
    { key: 'specialty', header: 'Specialty' },
    { key: 'classType', header: 'Type' },
    { key: 'capacity', header: 'Capacity' },
    { 
      key: 'startDate', 
      header: 'Start Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'endDate', 
      header: 'End Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'enrollmentEnabled',
      header: 'Enrollment',
      render: (value: boolean, row: ClassData) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Enabled' : 'Disabled'}
        </Badge>
      )
    },
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

  const handleCreateClass = async (classData: any) => {
    const headers = getApiHeaders();
    if (!headers) return;

    try {
      console.log('Creating class:', classData);
      
      // Format dates to YYYY-MM-DD
      const formattedData = {
        ...classData,
        instituteId: selectedInstitute?.id || "1",
        startDate: classData.startDate ? new Date(classData.startDate).toISOString().split('T')[0] : "2025-09-01",
        endDate: classData.endDate ? new Date(classData.endDate).toISOString().split('T')[0] : "2026-06-30",
        capacity: parseInt(classData.capacity),
        grade: parseInt(classData.grade),
        level: parseInt(classData.level || "1"),
        isActive: true,
        enrollmentEnabled: false,
        requireTeacherVerification: true
      };

      const response = await fetch(`${BASE_URL}/institute-classes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Class Created",
        description: `Class ${classData.name} has been created successfully.`
      });
      
      setIsCreateDialogOpen(false);
      handleLoadData(currentPage, itemsPerPage);
    } catch (error) {
      console.error('Failed to create class:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create class.",
        variant: "destructive"
      });
    }
  };

  const handleEditClass = (classData: ClassData) => {
    console.log('Editing class:', classData);
    setSelectedClassData(classData);
    setIsEditDialogOpen(true);
  };

  const handleUpdateClass = async (classData: any) => {
    const headers = getApiHeaders();
    if (!headers || !selectedClassData) return;

    try {
      console.log('Updating class:', classData);
      
      // Format dates to YYYY-MM-DD
      const formattedData = {
        ...classData,
        instituteId: selectedClassData.instituteId,
        startDate: classData.startDate ? new Date(classData.startDate).toISOString().split('T')[0] : selectedClassData.startDate,
        endDate: classData.endDate ? new Date(classData.endDate).toISOString().split('T')[0] : selectedClassData.endDate,
        capacity: parseInt(classData.capacity),
        grade: parseInt(classData.grade),
        level: parseInt(classData.level || selectedClassData.level.toString())
      };

      const response = await fetch(`${BASE_URL}/institute-classes/${selectedClassData.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Class Updated",
        description: `Class ${classData.name} has been updated successfully.`
      });
      
      setIsEditDialogOpen(false);
      setSelectedClassData(null);
      handleLoadData(currentPage, itemsPerPage);
    } catch (error) {
      console.error('Failed to update class:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update class.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClass = (classData: ClassData) => {
    console.log('Deleting class:', classData);
    toast({
      title: "Class Deleted",
      description: `Class ${classData.name} has been deleted.`,
      variant: "destructive"
    });
  };

  const handleViewClass = (classData: ClassData) => {
    setSelectedClass(classData);
    toast({
      title: "Class Selected",
      description: `Selected class: ${classData.name}`
    });
  };

  const handleToggleEnrollment = (classData: ClassData) => {
    setSelectedClassData(classData);
    if (!classData.enrollmentEnabled) {
      // Show enrollment dialog for enabling
      setEnrollmentCode(classData.code || '');
      setRequireTeacherVerification(classData.requireTeacherVerification);
      setIsEnrollmentDialogOpen(true);
    } else {
      // Directly disable enrollment
      handleDisableEnrollment(classData);
    }
  };

  const handleEnableEnrollment = async () => {
    const headers = getApiHeaders();
    if (!headers || !selectedClassData) return;

    try {
      const response = await fetch(`${BASE_URL}/institute-classes/${selectedClassData.id}/enable-enrollment`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          enrollmentCode,
          requireTeacherVerification
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Enrollment Enabled",
        description: `Enrollment has been enabled for ${selectedClassData.name}`
      });
      
      setIsEnrollmentDialogOpen(false);
      setSelectedClassData(null);
      handleLoadData(currentPage, itemsPerPage);
    } catch (error) {
      console.error('Failed to enable enrollment:', error);
      toast({
        title: "Enable Failed",
        description: "Failed to enable enrollment.",
        variant: "destructive"
      });
    }
  };

  const handleDisableEnrollment = async (classData: ClassData) => {
    const headers = getApiHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`${BASE_URL}/institute-classes/${classData.id}/disable-enrollment`, {
        method: 'POST',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Enrollment Disabled",
        description: `Enrollment has been disabled for ${classData.name}`
      });
      
      handleLoadData(currentPage, itemsPerPage);
    } catch (error) {
      console.error('Failed to disable enrollment:', error);
      toast({
        title: "Disable Failed",
        description: "Failed to disable enrollment.",
        variant: "destructive"
      });
    }
  };

  const userRole = user?.role || 'Student';
  const canAdd = AccessControl.hasPermission(userRole, 'create-class');
  const canEdit = AccessControl.hasPermission(userRole, 'edit-class');
  const canDelete = AccessControl.hasPermission(userRole, 'delete-class');

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
            onClick={() => handleLoadData()} 
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
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="grade-filter">Grade Filter</Label>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Grades</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                    <SelectItem key={grade} value={grade.toString()}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="active-filter">Status Filter</Label>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={() => handleLoadData(1, itemsPerPage)} 
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
                label: 'Toggle Enrollment',
                action: handleToggleEnrollment,
                variant: 'outline',
                condition: () => canEdit
              }
            ]}
            // Server-side pagination props
            currentPage={currentPage}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPage={itemsPerPage}
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

      {/* Enrollment Dialog */}
      <Dialog open={isEnrollmentDialogOpen} onOpenChange={setIsEnrollmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Enrollment for {selectedClassData?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="enrollment-code">Enrollment Code</Label>
              <Input
                id="enrollment-code"
                value={enrollmentCode}
                onChange={(e) => setEnrollmentCode(e.target.value)}
                placeholder="Enter enrollment code"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="teacher-verification"
                checked={requireTeacherVerification}
                onCheckedChange={setRequireTeacherVerification}
              />
              <Label htmlFor="teacher-verification">Require Teacher Verification</Label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEnrollmentDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEnableEnrollment}
                disabled={!enrollmentCode.trim()}
              >
                Enable Enrollment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classes;
