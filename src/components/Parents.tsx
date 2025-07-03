
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/ui/data-table';
import { Eye, Users, Phone, Mail, MapPin, Briefcase, Search, Filter } from 'lucide-react';

interface Parent {
  userId: string;
  occupation: string;
  workplace: string;
  workPhone: string;
  educationLevel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userType: string;
    dateOfBirth: string;
    gender: string;
    nic: string;
    birthCertificateNo: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    district: string;
    province: string;
    postalCode: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string | null;
  };
}

interface ChildData {
  id: string;
  userId: string;
  fatherId: string | null;
  motherId: string | null;
  guardianId: string | null;
  studentId: string;
  emergencyContact: string;
  medicalConditions: string;
  allergies: string;
  bloodGroup: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userType: string;
    dateOfBirth: string;
    gender: string;
    nic: string;
    birthCertificateNo: string;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string;
    district: string;
    province: string;
    postalCode: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
}

interface ChildrenResponse {
  parent: Parent;
  children: {
    asFather: ChildData[];
    asMother: ChildData[];
    asGuardian: ChildData[];
  };
}

interface ParentsResponse {
  data: Parent[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    previousPage: number | null;
    nextPage: number | null;
  };
}

const Parents = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [childrenData, setChildrenData] = useState<ChildrenResponse | null>(null);
  const [showChildrenDialog, setShowChildrenDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('true');
  const { toast } = useToast();

  const API_BASE_URL = 'http://localhost:3000';

  const fetchParents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login to access this page.",
          variant: "destructive"
        });
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        isActive: statusFilter
      });

      // Only add search parameter if it has a value
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      console.log('Fetching parents with params:', params.toString());

      const response = await fetch(`${API_BASE_URL}/parents?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ParentsResponse = await response.json();
      console.log('Parents data received:', data);
      
      setParents(data.data);
      setTotalPages(data.meta.totalPages);
      setTotalItems(data.meta.total);
    } catch (error) {
      console.error('Error fetching parents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch parents data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async (parentId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login to access this page.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/parents/${parentId}/children`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch children');
      }

      const data: ChildrenResponse = await response.json();
      setChildrenData(data);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: "Error",
        description: "Failed to fetch children data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchParents();
  }, [currentPage, itemsPerPage, searchTerm, statusFilter]);

  const handleViewParent = (parent: Parent) => {
    setSelectedParent(parent);
    setShowViewDialog(true);
  };

  const handleViewChildren = async (parent: Parent) => {
    setSelectedParent(parent);
    await fetchChildren(parent.userId);
    setShowChildrenDialog(true);
  };

  const columns = [
    {
      key: 'user.firstName',
      header: 'Parent',
      render: (value: any, row: Parent) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.user.imageUrl || ''} alt={row.user.firstName} />
            <AvatarFallback>
              {row.user.firstName.charAt(0)}{row.user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.user.firstName} {row.user.lastName}</p>
            <p className="text-sm text-gray-500">{row.user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'user.phone',
      header: 'Contact',
      render: (value: any, row: Parent) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Phone className="h-3 w-3 mr-1" />
            {row.user.phone}
          </div>
          <div className="flex items-center text-sm">
            <Briefcase className="h-3 w-3 mr-1" />
            {row.workPhone}
          </div>
        </div>
      )
    },
    {
      key: 'occupation',
      header: 'Occupation',
      render: (value: any, row: Parent) => (
        <div className="space-y-1">
          <p className="font-medium">{row.occupation}</p>
          <p className="text-sm text-gray-500">{row.workplace}</p>
        </div>
      )
    },
    {
      key: 'user.isActive',
      header: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      )
    }
  ];

  const renderChildrenSection = (children: ChildData[], title: string) => {
    if (children.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-blue-700">{title}</h4>
        <div className="space-y-4">
          {children.map((child) => (
            <Card key={child.id} className="p-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={child.user.imageUrl} alt={child.user.firstName} />
                  <AvatarFallback>
                    {child.user.firstName.charAt(0)}{child.user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-lg">
                      {child.user.firstName} {child.user.lastName}
                    </h5>
                    <Badge variant={child.user.isActive ? "default" : "secondary"}>
                      {child.user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p><strong>Student ID:</strong> {child.studentId || 'Not assigned'}</p>
                      <p><strong>Email:</strong> {child.user.email}</p>
                      <p><strong>Phone:</strong> {child.user.phone}</p>
                      <p><strong>Date of Birth:</strong> {child.user.dateOfBirth}</p>
                    </div>
                    <div className="space-y-1">
                      <p><strong>Emergency Contact:</strong> {child.emergencyContact}</p>
                      <p><strong>Blood Group:</strong> {child.bloodGroup}</p>
                      <p><strong>Allergies:</strong> {child.allergies || 'None'}</p>
                      <p><strong>Medical Conditions:</strong> {child.medicalConditions || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading parents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parents Management</h1>
          <p className="text-gray-600 mt-1">Manage parent accounts and view their children</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-blue-600" />
          <Badge variant="outline" className="text-sm">
            {totalItems} Total Parents
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search parents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        title="Parents List"
        data={parents}
        columns={columns}
        onView={handleViewParent}
        searchPlaceholder="Search parents..."
        allowAdd={false}
        allowEdit={false}
        allowDelete={false}
        customActions={[
          {
            label: "View Children",
            action: handleViewChildren,
            icon: <Users className="h-3 w-3" />,
            variant: "outline"
          }
        ]}
        currentPage={currentPage}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* View Parent Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Parent Details</DialogTitle>
            <DialogDescription>
              Complete information about the parent
            </DialogDescription>
          </DialogHeader>
          
          {selectedParent && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedParent.user.imageUrl || ''} alt={selectedParent.user.firstName} />
                  <AvatarFallback className="text-2xl">
                    {selectedParent.user.firstName.charAt(0)}{selectedParent.user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">{selectedParent.user.firstName} {selectedParent.user.lastName}</h3>
                  <p className="text-gray-600">{selectedParent.occupation}</p>
                  <Badge variant={selectedParent.user.isActive ? "default" : "secondary"}>
                    {selectedParent.user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedParent.user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{selectedParent.user.phone}</span>
                    </div>
                    <p><strong>Date of Birth:</strong> {selectedParent.user.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {selectedParent.user.gender}</p>
                    <p><strong>NIC:</strong> {selectedParent.user.nic}</p>
                    <p><strong>Birth Certificate:</strong> {selectedParent.user.birthCertificateNo}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p><strong>Occupation:</strong> {selectedParent.occupation}</p>
                    <p><strong>Workplace:</strong> {selectedParent.workplace}</p>
                    <p><strong>Work Phone:</strong> {selectedParent.workPhone}</p>
                    <p><strong>Education Level:</strong> {selectedParent.educationLevel}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Address Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <p>{selectedParent.user.addressLine1}</p>
                        {selectedParent.user.addressLine2 && <p>{selectedParent.user.addressLine2}</p>}
                        <p>{selectedParent.user.city}, {selectedParent.user.district}</p>
                        <p>{selectedParent.user.province}, {selectedParent.user.country}</p>
                        <p>{selectedParent.user.postalCode}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p><strong>User Type:</strong> {selectedParent.user.userType}</p>
                    <p><strong>Created:</strong> {new Date(selectedParent.user.createdAt).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(selectedParent.user.updatedAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Children Dialog */}
      <Dialog open={showChildrenDialog} onOpenChange={setShowChildrenDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Children Information</DialogTitle>
            <DialogDescription>
              Children associated with {selectedParent?.user.firstName} {selectedParent?.user.lastName}
            </DialogDescription>
          </DialogHeader>
          
          {childrenData && (
            <div className="space-y-6">
              {renderChildrenSection(childrenData.children.asFather, "As Father")}
              {renderChildrenSection(childrenData.children.asMother, "As Mother")}
              {renderChildrenSection(childrenData.children.asGuardian, "As Guardian")}
              
              {childrenData.children.asFather.length === 0 && 
               childrenData.children.asMother.length === 0 && 
               childrenData.children.asGuardian.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No children found for this parent.</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const renderChildrenSection = (children: ChildData[], title: string) => {
  if (children.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-3 text-blue-700">{title}</h4>
      <div className="space-y-4">
        {children.map((child) => (
          <Card key={child.id} className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={child.user.imageUrl} alt={child.user.firstName} />
                <AvatarFallback>
                  {child.user.firstName.charAt(0)}{child.user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-lg">
                    {child.user.firstName} {child.user.lastName}
                  </h5>
                  <Badge variant={child.user.isActive ? "default" : "secondary"}>
                    {child.user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p><strong>Student ID:</strong> {child.studentId || 'Not assigned'}</p>
                    <p><strong>Email:</strong> {child.user.email}</p>
                    <p><strong>Phone:</strong> {child.user.phone}</p>
                    <p><strong>Date of Birth:</strong> {child.user.dateOfBirth}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Emergency Contact:</strong> {child.emergencyContact}</p>
                    <p><strong>Blood Group:</strong> {child.bloodGroup}</p>
                    <p><strong>Allergies:</strong> {child.allergies || 'None'}</p>
                    <p><strong>Medical Conditions:</strong> {child.medicalConditions || 'None'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Parents;
