
import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateInstituteForm from '@/components/forms/CreateInstituteForm';

const mockInstitutes = [
  {
    id: '1',
    code: 'MIT001',
    name: 'Modern Institute of Technology',
    address: '123 Tech Street, Silicon Valley, CA',
    phone: '+1 (555) 100-2000',
    email: 'admin@mit001.edu',
    establishedDate: '2010-01-15',
    totalStudents: 1234,
    totalTeachers: 78,
    totalClasses: 24,
    status: 'Active',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    code: 'SCI002',
    name: 'Science Excellence Academy',
    address: '456 Learning Ave, Education City, NY',
    phone: '+1 (555) 200-3000',
    email: 'info@sci002.edu',
    establishedDate: '2015-08-20',
    totalStudents: 856,
    totalTeachers: 45,
    totalClasses: 18,
    status: 'Active',
    lastUpdated: '2024-01-14'
  },
  {
    id: '3',
    code: 'COM003',
    name: 'Commerce Business School',
    address: '789 Business Blvd, Trade Town, TX',
    phone: '+1 (555) 300-4000',
    email: 'contact@com003.edu',
    establishedDate: '2012-03-10',
    totalStudents: 567,
    totalTeachers: 32,
    totalClasses: 12,
    status: 'Inactive',
    lastUpdated: '2024-01-10'
  }
];

const Institutes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<any>(null);

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

  const institutesColumns = [
    { key: 'code', header: 'Institute Code' },
    { key: 'name', header: 'Institute Name' },
    { key: 'address', header: 'Address' },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' },
    { key: 'establishedDate', header: 'Established' },
    { key: 'totalStudents', header: 'Students' },
    { key: 'totalTeachers', header: 'Teachers' },
    { key: 'totalClasses', header: 'Classes' },
    { key: 'lastUpdated', header: 'Last Updated' },
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

  const handleAddInstitute = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateInstitute = (instituteData: any) => {
    console.log('Creating institute:', instituteData);
    toast({
      title: "Institute Created",
      description: `Institute ${instituteData.name} has been created successfully.`
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditInstitute = (institute: any) => {
    console.log('Edit institute:', institute);
    setSelectedInstitute(institute);
    setIsEditDialogOpen(true);
  };

  const handleUpdateInstitute = (instituteData: any) => {
    console.log('Updating institute:', instituteData);
    toast({
      title: "Institute Updated",
      description: `Institute ${instituteData.name} has been updated successfully.`
    });
    setIsEditDialogOpen(false);
    setSelectedInstitute(null);
  };

  const handleDeleteInstitute = (institute: any) => {
    console.log('Delete institute:', institute);
    toast({
      title: "Institute Deleted",
      description: `Institute ${institute.name} has been deleted.`,
      variant: "destructive"
    });
  };

  const handleViewInstitute = (institute: any) => {
    console.log('View institute details:', institute);
    toast({
      title: "View Institute",
      description: `Viewing institute: ${institute.name}`
    });
  };

  const handleDisableInstitute = (institute: any) => {
    console.log('Disable institute:', institute);
    toast({
      title: "Institute Disabled",
      description: `Institute ${institute.name} has been disabled.`,
      variant: "destructive"
    });
  };

  const handleEnableInstitute = (institute: any) => {
    console.log('Enable institute:', institute);
    toast({
      title: "Institute Enabled",
      description: `Institute ${institute.name} has been enabled.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Institutes Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          System-wide institute management and administration
        </p>
      </div>

      <DataTable
        title="All Institutes"
        data={mockInstitutes}
        columns={institutesColumns}
        onAdd={handleAddInstitute}
        onEdit={handleEditInstitute}
        onDelete={handleDeleteInstitute}
        onView={handleViewInstitute}
        searchPlaceholder="Search institutes..."
        customActions={[
          {
            label: 'Disable',
            action: handleDisableInstitute,
            variant: 'destructive',
            condition: (row: any) => row.status === 'Active'
          },
          {
            label: 'Enable',
            action: handleEnableInstitute,
            variant: 'default',
            condition: (row: any) => row.status === 'Inactive'
          }
        ]}
      />

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
