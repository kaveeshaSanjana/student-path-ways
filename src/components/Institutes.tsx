import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateInstituteForm from '@/components/forms/CreateInstituteForm';

const BASE_URL = 'https://5ee1-2402-4000-2280-68b1-b149-ba1b-ef57-a0b9.ngrok-free.app';

const Institutes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<any>(null);
  const [institutesData, setInstitutesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Only SystemAdmin can access this page
  if (user?.role !== 'SystemAdmin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log('Loading institutes data...');
    
    try {
      const response = await fetch(`${BASE_URL}/institutes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setInstitutesData(result.data || result || []);
      setDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${(result.data || result || []).length} institutes.`
      });
    } catch (error) {
      console.error('Error loading institutes:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load institutes data. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const institutesColumns = [
    { key: 'code', header: 'Institute Code' },
    { key: 'name', header: 'Institute Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'city', header: 'City' },
    { key: 'state', header: 'State' },
    { key: 'country', header: 'Country' },
    { key: 'pinCode', header: 'Pin Code' },
    { 
      key: 'imageUrl', 
      header: 'Image',
      render: (value: string) => (
        value ? (
          <img src={value} alt="Institute" className="w-8 h-8 rounded object-cover" />
        ) : (
          <span className="text-gray-400">No image</span>
        )
      )
    }
  ];

  const handleAddInstitute = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateInstitute = async (instituteData: any) => {
    console.log('Creating institute:', instituteData);
    try {
      const response = await fetch(`${BASE_URL}/institutes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instituteData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Institute Created",
        description: `Institute ${instituteData.name} has been created successfully.`
      });
      setIsCreateDialogOpen(false);
      handleLoadData(); // Reload data
    } catch (error) {
      console.error('Error creating institute:', error);
      toast({
        title: "Create Failed",
        description: "Failed to create institute. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditInstitute = (institute: any) => {
    console.log('Edit institute:', institute);
    setSelectedInstitute(institute);
    setIsEditDialogOpen(true);
  };

  const handleUpdateInstitute = async (instituteData: any) => {
    console.log('Updating institute:', instituteData);
    try {
      const response = await fetch(`${BASE_URL}/institutes/${selectedInstitute.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instituteData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Institute Updated",
        description: `Institute ${instituteData.name} has been updated successfully.`
      });
      setIsEditDialogOpen(false);
      setSelectedInstitute(null);
      handleLoadData(); // Reload data
    } catch (error) {
      console.error('Error updating institute:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update institute. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteInstitute = async (institute: any) => {
    console.log('Delete institute:', institute);
    try {
      const response = await fetch(`${BASE_URL}/institutes/${institute.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Institute Deleted",
        description: `Institute ${institute.name} has been deleted.`,
        variant: "destructive"
      });
      handleLoadData(); // Reload data
    } catch (error) {
      console.error('Error deleting institute:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete institute. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewInstitute = async (institute: any) => {
    console.log('View institute details:', institute);
    try {
      const response = await fetch(`${BASE_URL}/institutes/${institute.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const detailedInstitute = await response.json();
      console.log('Detailed institute data:', detailedInstitute);
      
      toast({
        title: "View Institute",
        description: `Viewing institute: ${institute.name}`
      });
    } catch (error) {
      console.error('Error fetching institute details:', error);
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch institute details.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {!dataLoaded ? (
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Institutes Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load institutes data
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
              Institutes Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              System-wide institute management and administration
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
            title="All Institutes"
            data={institutesData}
            columns={institutesColumns}
            onAdd={handleAddInstitute}
            onEdit={handleEditInstitute}
            onDelete={handleDeleteInstitute}
            onView={handleViewInstitute}
            searchPlaceholder="Search institutes..."
            customActions={[
              {
                label: 'Delete',
                action: handleDeleteInstitute,
                variant: 'destructive',
              },
            ]}
          />
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Institute</DialogTitle>
          </DialogHeader>
          <CreateInstituteForm
            onSubmit={handleCreateInstitute}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Institute</DialogTitle>
          </DialogHeader>
          <CreateInstituteForm
            initialData={selectedInstitute}
            onSubmit={handleUpdateInstitute}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedInstitute(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Institutes;
