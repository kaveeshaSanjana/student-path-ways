
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Search, Pencil, Trash2, RefreshCw, Building2 } from 'lucide-react';
import DataTable from '@/components/ui/data-table';
import CreateInstituteForm from '@/components/forms/CreateInstituteForm';
import { useToast } from '@/hooks/use-toast';

const BASE_URL = 'https://e2e0-2402-4000-2280-68b1-b149-ba1b-ef57-a0b9.ngrok-free.app';

interface Institute {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  imageUrl?: string;
}

const Institutes = () => {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    handleLoadData();
  }, []);

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log('Loading institutes data...');
    
    try {
      const response = await fetch(`${BASE_URL}/institutes`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Institutes data loaded:', data);
      
      setInstitutes(Array.isArray(data) ? data : []);
      
      toast({
        title: "Success",
        description: `Loaded ${Array.isArray(data) ? data.length : 0} institutes successfully`,
      });
    } catch (error) {
      console.error('Error loading institutes:', error);
      toast({
        title: "Error",
        description: "Failed to load institutes data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInstitute = async (data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/institutes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Institute created:', result);
      
      toast({
        title: "Success",
        description: "Institute created successfully",
      });
      
      setIsCreateDialogOpen(false);
      handleLoadData();
    } catch (error) {
      console.error('Error creating institute:', error);
      toast({
        title: "Error",
        description: "Failed to create institute. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditInstitute = async (data: any) => {
    if (!selectedInstitute) return;

    try {
      const response = await fetch(`${BASE_URL}/institutes/${selectedInstitute.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Institute updated:', result);
      
      toast({
        title: "Success",
        description: "Institute updated successfully",
      });
      
      setIsEditDialogOpen(false);
      setSelectedInstitute(null);
      handleLoadData();
    } catch (error) {
      console.error('Error updating institute:', error);
      toast({
        title: "Error",
        description: "Failed to update institute. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInstitute = async (institute: Institute) => {
    if (!confirm(`Are you sure you want to delete ${institute.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/institutes/${institute.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Success",
        description: "Institute deleted successfully",
      });
      
      handleLoadData();
    } catch (error) {
      console.error('Error deleting institute:', error);
      toast({
        title: "Error",
        description: "Failed to delete institute. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (institute: Institute) => {
    setSelectedInstitute(institute);
    setIsEditDialogOpen(true);
  };

  const columns = [
    {
      key: 'imageUrl',
      header: 'Image',
      render: (value: string) => (
        value ? (
          <img src={value} alt="Institute" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
        )
      ),
    },
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'code',
      header: 'Code',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'city',
      header: 'City',
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'destructive'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <CardTitle className="text-2xl flex items-center">
          <Building2 className="mr-2 h-6 w-6" />
          Institutes
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleLoadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Institute
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Institute</DialogTitle>
              </DialogHeader>
              <CreateInstituteForm 
                onSubmit={handleCreateInstitute} 
                onCancel={() => setIsCreateDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Institutes List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            title="Institutes"
            columns={columns} 
            data={institutes} 
            onEdit={handleEdit}
            onDelete={handleDeleteInstitute}
            allowAdd={false}
            allowEdit={true}
            allowDelete={true}
          />
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Institute</DialogTitle>
          </DialogHeader>
          {selectedInstitute && (
            <CreateInstituteForm 
              onSubmit={handleEditInstitute} 
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedInstitute(null);
              }}
              initialData={selectedInstitute}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Institutes;
