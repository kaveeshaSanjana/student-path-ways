
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const subjectSchema = z.object({
  code: z.string().min(1, 'Subject code is required'),
  name: z.string().min(2, 'Subject name must be at least 2 characters'),
  class: z.string().min(1, 'Please select a class'),
  teacher: z.string().min(1, 'Please select a teacher'),
  credits: z.string().min(1, 'Credits are required'),
  description: z.string().min(5, 'Description is required'),
  status: z.string().default('Active'),
  department: z.string().min(1, 'Department is required'),
  prerequisites: z.string().optional(),
  gradeWeight: z.string().min(1, 'Grade weight is required')
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface CreateSubjectFormProps {
  onSubmit: (data: SubjectFormData) => void;
  onCancel: () => void;
  initialData?: any;
}

const CreateSubjectForm = ({ onSubmit, onCancel, initialData }: CreateSubjectFormProps) => {
  const isEditing = !!initialData;
  
  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      class: initialData?.class || '',
      teacher: initialData?.teacher || '',
      credits: initialData?.credits?.toString() || '',
      description: initialData?.description || '',
      status: initialData?.status || 'Active',
      department: initialData?.department || '',
      prerequisites: initialData?.prerequisites || '',
      gradeWeight: initialData?.gradeWeight?.toString() || ''
    }
  });

  const handleSubmit = (data: SubjectFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Subject' : 'Add New Subject'}</CardTitle>
        <CardDescription>{isEditing ? 'Update subject information' : 'Enter subject information to create a new record'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code</FormLabel>
                    <FormControl>
                      <Input placeholder="MATH101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
                        <SelectItem value="Grade 10-B">Grade 10-B</SelectItem>
                        <SelectItem value="Grade 11-S">Grade 11-S</SelectItem>
                        <SelectItem value="Grade 12-C">Grade 12-C</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mr. Smith">Mr. Smith</SelectItem>
                        <SelectItem value="Mrs. Johnson">Mrs. Johnson</SelectItem>
                        <SelectItem value="Mr. Williams">Mr. Williams</SelectItem>
                        <SelectItem value="Ms. Brown">Ms. Brown</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gradeWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Weight (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Social Studies">Social Studies</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Subject description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerequisites (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Basic Algebra, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Subject' : 'Create Subject'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateSubjectForm;
