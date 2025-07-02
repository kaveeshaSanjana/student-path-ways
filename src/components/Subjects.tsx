
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, RefreshCwIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const getBaseUrl = () => {
    return localStorage.getItem('baseUrl') || 'http://localhost:3000';
  };

  const fetchSubjects = async () => {
    try {
      console.log('Loading subjects data...');
      setLoading(true);
      setError(null);
      
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/subjects`;
      
      console.log('API URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Subjects data:', data);
      
      if (Array.isArray(data)) {
        setSubjects(data);
      } else if (data.data && Array.isArray(data.data)) {
        setSubjects(data.data);
      } else {
        console.error('Unexpected data format:', data);
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load subjects';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage + ". Please check if backend is running.",
        variant: "destructive",
      });
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete subject');
      }

      toast({
        title: "Success",
        description: "Subject deleted successfully",
      });

      // Refresh the subjects list
      await fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Error",
        description: "Failed to delete subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CreateSubjectSchema = z.object({
    code: z.string().min(1, "Subject code is required").max(50, "Code must be 50 characters or less"),
    name: z.string().min(1, "Subject name is required").max(255, "Name must be 255 characters or less"),
    description: z.string().optional(),
    category: z.string().max(100, "Category must be 100 characters or less").optional(),
    creditHours: z.number().min(1, "Credit hours must be at least 1").max(1000, "Credit hours must be 1000 or less").optional(),
    isActive: z.boolean().default(true)
  });

  const createForm = useForm<z.infer<typeof CreateSubjectSchema>>({
    resolver: zodResolver(CreateSubjectSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      category: "",
      creditHours: undefined,
      isActive: true
    },
  });

  const editForm = useForm<z.infer<typeof CreateSubjectSchema>>({
    resolver: zodResolver(CreateSubjectSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      category: "",
      creditHours: undefined,
      isActive: true
    },
  });

  const onCreateSubjectSubmit = async (values: z.infer<typeof CreateSubjectSchema>) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/subjects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subject');
      }
  
      toast({
        title: "Success",
        description: "Subject created successfully",
      });
  
      // Refresh the subjects list
      await fetchSubjects();
      setShowCreateForm(false);
      createForm.reset();
    } catch (error) {
      console.error('Error creating subject:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onEditSubjectSubmit = async (values: z.infer<typeof CreateSubjectSchema>) => {
    if (!editingSubject) return;
    
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/subjects/${editingSubject.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update subject');
      }
  
      toast({
        title: "Success",
        description: "Subject updated successfully",
      });
  
      // Refresh the subjects list
      await fetchSubjects();
      setShowEditForm(false);
      setEditingSubject(null);
      editForm.reset();
    } catch (error) {
      console.error('Error updating subject:', error);
      toast({
        title: "Error",
        description: "Failed to update subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    editForm.reset({
      code: subject.code,
      name: subject.name,
      description: subject.description || "",
      category: subject.category || "",
      creditHours: subject.creditHours,
      isActive: subject.isActive
    });
    setShowEditForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subjects Management</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchSubjects} variant="outline">
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Load Data
          </Button>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Subject</DialogTitle>
                <DialogDescription>
                  Add a new subject to the system
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreateSubjectSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., CS101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Computer Science Fundamentals" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Subject description..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Science, Arts" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="creditHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credit Hours</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 3" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={createForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <FormDescription>
                            Set whether the subject is active
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Subject</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center p-8">
          <p>Loading subjects...</p>
        </div>
      ) : error ? (
        <div className="text-center p-8">
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-600 font-medium">Error Loading Subjects</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => fetchSubjects()} 
                className="mt-4"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : subjects.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Credit Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map(subject => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.code}</TableCell>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.category || 'N/A'}</TableCell>
                    <TableCell>{subject.creditHours || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        subject.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subject.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditSubject(subject)}
                        className="mr-2"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <p>No subjects found. Click "Load Data" to fetch subjects.</p>
        </div>
      )}

      {/* Edit Subject Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update subject information
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubjectSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CS101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Computer Science Fundamentals" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Subject description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Science, Arts" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="creditHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Hours</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 3" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Set whether the subject is active
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setShowEditForm(false);
                  setEditingSubject(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">Update Subject</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
