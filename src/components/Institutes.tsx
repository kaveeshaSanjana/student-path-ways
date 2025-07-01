import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Search, Pencil, Trash2, RefreshCw, Building2 } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import CreateInstituteForm from '@/components/forms/CreateInstituteForm';
import { useToast } from '@/hooks/use-toast';

const BASE_URL = 'https://e2e0-2402-4000-2280-68b1-b149-ba1b-ef57-a0b9.ngrok-free.app';

interface Institute {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

const Institutes = () => {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'code',
      header: 'Code',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'success' : 'destructive'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
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
          <Button variant="outline" size="sm">
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Institute</DialogTitle>
              </DialogHeader>
              <CreateInstituteForm onClose={() => setIsCreateDialogOpen(false)} onInstituteCreated={handleLoadData} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Institutes List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={institutes} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Institutes;
