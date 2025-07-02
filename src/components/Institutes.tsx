
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from '@/contexts/AuthContext';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, EyeIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CreateInstituteForm from '@/components/forms/CreateInstituteForm';

const Institutes = () => {
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('true');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const itemsPerPage = 10;

  const getBaseUrl = () => {
    return localStorage.getItem('baseUrl') || 'https://a174-123-231-85-77.ngrok-free.app';
  };

  const fetchInstitutes = async (page: number = 1, search: string = '', isActive: string = 'true') => {
    try {
      console.log('Loading institutes data...');
      setLoading(true);
      setError(null);
      
      const baseUrl = getBaseUrl();
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: search,
        isActive: isActive
      });
      
      const response = await fetch(`${baseUrl}/institutes?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (response.status === 404) {
        setInstitutes([]);
        setTotalPages(1);
        toast({
          title: "No Institutes Found",
          description: "No institutes found according to the current filter.",
          variant: "default",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Institutes data:', data);
      
      if (data.data && Array.isArray(data.data)) {
        setInstitutes(data.data);
        setTotalPages(data.meta?.totalPages || 1);
      } else if (Array.isArray(data)) {
        setInstitutes(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } else {
        console.error('Unexpected data format:', data);
        setInstitutes([]);
      }
    } catch (error) {
      console.error('Error loading institutes:', error);
      setError('Failed to load institutes. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load institutes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInstituteById = async (id: string) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/institutes/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching institute by ID:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchInstitutes(currentPage, searchTerm, isActiveFilter);
  }, [currentPage, searchTerm, isActiveFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleActiveFilterChange = (value: string) => {
    setIsActiveFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCreateInstitute = async (instituteData: any) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/institutes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(instituteData),
      });

      if (!response.ok) {
        throw new Error('Failed to create institute');
      }

      toast({
        title: "Success",
        description: "Institute created successfully",
      });

      await fetchInstitutes(currentPage, searchTerm, isActiveFilter);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating institute:', error);
      toast({
        title: "Error",
        description: "Failed to create institute. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditInstitute = async (id: string) => {
    try {
      const instituteData = await fetchInstituteById(id);
      setSelectedInstitute(instituteData);
      setShowEditDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch institute details.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateInstitute = async (instituteData: any) => {
    try {
      const baseUrl = getBaseUrl();
      // Remove id from the data to prevent updating it
      const { id, createdAt, updatedAt, isActive, ...updateData } = instituteData;
      
      const response = await fetch(`${baseUrl}/institutes/${selectedInstitute.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update institute');
      }

      toast({
        title: "Success",
        description: "Institute updated successfully",
      });

      await fetchInstitutes(currentPage, searchTerm, isActiveFilter);
      setShowEditDialog(false);
      setSelectedInstitute(null);
    } catch (error) {
      console.error('Error updating institute:', error);
      toast({
        title: "Error",
        description: "Failed to update institute. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInstitute = async (instituteId: string) => {
    if (!confirm('Are you sure you want to delete this institute?')) return;

    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/institutes/${instituteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete institute');
      }

      toast({
        title: "Success",
        description: "Institute deleted successfully",
      });

      await fetchInstitutes(currentPage, searchTerm, isActiveFilter);
    } catch (error) {
      console.error('Error deleting institute:', error);
      toast({
        title: "Error",
        description: "Failed to delete institute. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewInstitute = async (id: string) => {
    try {
      const instituteData = await fetchInstituteById(id);
      setSelectedInstitute(instituteData);
      setShowViewDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch institute details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Institutes</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search institutes..."
              value={searchTerm}
              onChange={handleSearch}
              className="pr-10"
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          <Select value={isActiveFilter} onValueChange={handleActiveFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
              <SelectItem value="">All</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default" onClick={() => setShowCreateDialog(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Institute
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading institutes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : institutes.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {institutes.map(institute => (
                <TableRow key={institute.id}>
                  <TableCell className="font-medium">{institute.code}</TableCell>
                  <TableCell>{institute.name}</TableCell>
                  <TableCell>{institute.email}</TableCell>
                  <TableCell>{institute.phone}</TableCell>
                  <TableCell>{institute.city}</TableCell>
                  <TableCell>{institute.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewInstitute(institute.id)}>
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditInstitute(institute.id)}>
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteInstitute(institute.id)}>
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>No institutes found according to the current filter.</p>
      )}

      {institutes.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Institute</DialogTitle>
          </DialogHeader>
          <CreateInstituteForm
            onSubmit={handleCreateInstitute}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Institute</DialogTitle>
          </DialogHeader>
          <CreateInstituteForm
            initialData={selectedInstitute}
            onSubmit={handleUpdateInstitute}
            onCancel={() => {
              setShowEditDialog(false);
              setSelectedInstitute(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Institute Details</DialogTitle>
          </DialogHeader>
          {selectedInstitute && (
            <div className="space-y-4">
              {selectedInstitute.imageUrl && (
                <div className="flex justify-center">
                  <img 
                    src={selectedInstitute.imageUrl} 
                    alt={selectedInstitute.name}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name:</label>
                  <p className="text-sm">{selectedInstitute.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Code:</label>
                  <p className="text-sm">{selectedInstitute.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email:</label>
                  <p className="text-sm">{selectedInstitute.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone:</label>
                  <p className="text-sm">{selectedInstitute.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">City:</label>
                  <p className="text-sm">{selectedInstitute.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">State:</label>
                  <p className="text-sm">{selectedInstitute.state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Country:</label>
                  <p className="text-sm">{selectedInstitute.country}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Pin Code:</label>
                  <p className="text-sm">{selectedInstitute.pinCode}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address:</label>
                <p className="text-sm">{selectedInstitute.address}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Institutes;
