
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

const instituteSchema = z.object({
  code: z.string().min(1, 'Institute code is required'),
  name: z.string().min(2, 'Institute name must be at least 2 characters'),
  address: z.string().min(10, 'Address is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email'),
  establishedDate: z.string().min(1, 'Established date is required'),
  status: z.string().default('Active'),
  type: z.string().min(1, 'Institute type is required'),
  accreditation: z.string().optional(),
  website: z.string().optional(),
  description: z.string().min(10, 'Description is required')
});

type InstituteFormData = z.infer<typeof instituteSchema>;

interface CreateInstituteFormProps {
  onSubmit: (data: InstituteFormData) => void;
  onCancel: () => void;
  initialData?: any;
}

const CreateInstituteForm = ({ onSubmit, onCancel, initialData }: CreateInstituteFormProps) => {
  const isEditing = !!initialData;
  
  const form = useForm<InstituteFormData>({
    resolver: zodResolver(instituteSchema),
    defaultValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      address: initialData?.address || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      establishedDate: initialData?.establishedDate || '',
      status: initialData?.status || 'Active',
      type: initialData?.type || '',
      accreditation: initialData?.accreditation || '',
      website: initialData?.website || '',
      description: initialData?.description || ''
    }
  });

  const handleSubmit = (data: InstituteFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Institute' : 'Add New Institute'}</CardTitle>
        <CardDescription>{isEditing ? 'Update institute information' : 'Enter institute information to create a new record'}</CardDescription>
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
                    <FormLabel>Institute Code</FormLabel>
                    <FormControl>
                      <Input placeholder="MIT001" {...field} />
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
                    <FormLabel>Institute Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Modern Institute of Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@institute.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 100-2000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institute Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="University">University</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="establishedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Established Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accreditation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accreditation (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="NAAC, AICTE, etc." {...field} />
                    </FormControl>
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
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Tech Street, Silicon Valley, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.institute.edu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Institute description and mission" {...field} />
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
                {isEditing ? 'Update Institute' : 'Create Institute'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateInstituteForm;
