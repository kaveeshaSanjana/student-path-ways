import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const Institutes = () => {
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const itemsPerPage = 10;

  const getBaseUrl = () => {
    return localStorage.getItem('baseUrl') || 'http://localhost:3000';
  };

  const fetchInstitutes = async (page: number = 1) => {
    try {
      console.log('Loading institutes data...');
      setLoading(true);
      setError(null);
      
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/institutes?page=${page}&limit=${itemsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Institutes data:', data);
      
      if (Array.isArray(data)) {
        setInstitutes(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } else if (data.institutes && Array.isArray(data.institutes)) {
        setInstitutes(data.institutes);
        setTotalPages(Math.ceil((data.total || data.institutes.length) / itemsPerPage));
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

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredInstitutes = institutes.filter(institute =>
    institute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institute.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchInstitutes(newPage);
  };

  const [newInstitute, setNewInstitute] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewInstitute(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleIsActiveChange = (checked: boolean) => {
    setNewInstitute(prevState => ({
      ...prevState,
      isActive: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/institutes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInstitute),
      });

      if (!response.ok) {
        throw new Error('Failed to create institute');
      }

      toast({
        title: "Success",
        description: "Institute created successfully",
      });

      // Refresh the institutes list
      await fetchInstitutes(currentPage);
      setShowCreateForm(false);
      setNewInstitute({ name: '', code: '', description: '', isActive: true });
    } catch (error) {
      console.error('Error creating institute:', error);
      toast({
        title: "Error",
        description: "Failed to create institute. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInstitute = async (instituteId: string) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/institutes/${instituteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete institute');
      }

      toast({
        title: "Success",
        description: "Institute deleted successfully",
      });

      // Refresh the institutes list
      await fetchInstitutes(currentPage);
    } catch (error) {
      console.error('Error deleting institute:', error);
      toast({
        title: "Error",
        description: "Failed to delete institute. Please try again.",
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Institute
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Institute</DialogTitle>
                <DialogDescription>
                  Create a new institute by entering the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={newInstitute.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Code
                  </Label>
                  <Input
                    type="text"
                    id="code"
                    name="code"
                    value={newInstitute.code}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={newInstitute.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="active" className="text-right">
                    Active
                  </Label>
                  <Switch
                    id="active"
                    checked={newInstitute.isActive}
                    onCheckedChange={handleIsActiveChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button type="submit" onClick={handleSubmit}>Create Institute</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <p>Loading institutes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredInstitutes.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstitutes.map(institute => (
                <TableRow key={institute.id}>
                  <TableCell className="font-medium">{institute.code}</TableCell>
                  <TableCell>{institute.name}</TableCell>
                  <TableCell>{institute.description}</TableCell>
                  <TableCell>{institute.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
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
        <p>No institutes found.</p>
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
    </div>
  );
};

export default Institutes;
