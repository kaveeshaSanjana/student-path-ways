import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  userType: z.string().min(1, 'User type is required'),
  nic: z.string().min(10, 'NIC must be at least 10 characters'),
  birthCertificateNo: z.string().min(5, 'Birth certificate number is required'),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  district: z.string().min(2, 'District is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  isActive: z.boolean().default(true)
});

type UserFormData = z.infer<typeof userSchema>;

interface CreateUserFormProps {
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

const CreateUserForm = ({ onSubmit, onCancel, initialData, isEditing = false }: CreateUserFormProps) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      userType: initialData?.userType || '',
      nic: initialData?.nic || '',
      birthCertificateNo: initialData?.birthCertificateNo || '',
      addressLine1: initialData?.addressLine1 || '',
      addressLine2: initialData?.addressLine2 || '',
      city: initialData?.city || '',
      district: initialData?.district || '',
      province: initialData?.province || '',
      postalCode: initialData?.postalCode || '',
      country: initialData?.country || 'Sri Lanka',
      gender: initialData?.gender || '',
      dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
      isActive: initialData?.isActive ?? true
    }
  });

  const formatDateToMMDDYYYY = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSubmit = (data: UserFormData) => {
    const formattedData = {
      ...data,
      dateOfBirth: formatDateToMMDDYYYY(data.dateOfBirth)
    };
    onSubmit(formattedData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{isEditing ? 'Edit User' : 'Create New User'}</CardTitle>
          <CardDescription className="text-sm">
            {isEditing ? 'Update user information' : 'Enter user information to create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Gender *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Date of Birth *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                        <p className="text-xs text-gray-500">Will be sent as MM/DD/YYYY format</p>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Identification */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Identification</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="nic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">NIC *</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789V" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="birthCertificateNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Birth Certificate No *</FormLabel>
                        <FormControl>
                          <Input placeholder="BC123456789" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Address Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Address Line 1 *</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Address Line 2</FormLabel>
                        <FormControl>
                          <Input placeholder="Apartment 4B" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Colombo" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">District *</FormLabel>
                        <FormControl>
                          <Input placeholder="Colombo" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Province *</FormLabel>
                        <FormControl>
                          <Input placeholder="Western" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Postal Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="10100" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="Sri Lanka" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">User Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isEditing} // Disable user type editing
                        >
                          <FormControl>
                            <SelectTrigger className={`text-sm ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            <SelectItem value="INSTITUTE_ADMIN">Institute Admin</SelectItem>
                            <SelectItem value="TEACHER">Teacher</SelectItem>
                            <SelectItem value="ATTEDANCE_MARKER">Attendance Marker</SelectItem>
                            {/* Note: STUDENT and PARENT creation restricted as per requirements */}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                        {isEditing && (
                          <p className="text-xs text-amber-600">User type cannot be changed after creation</p>
                        )}
                      </FormItem>
                    )}
                  />
                  
                  {!isEditing && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Password *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="text-sm" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="text-sm">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-sm">
                  {isEditing ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUserForm;
