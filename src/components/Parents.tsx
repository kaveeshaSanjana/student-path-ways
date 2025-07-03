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
import { Eye, Users, Phone, Mail, MapPin, Briefcase, Search, Filter, RefreshCw } from 'lucide-react';
import CreateParentForm from '@/components/forms/CreateParentForm';

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
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [childrenData, setChildrenData] = useState<ChildrenResponse | null>(null);
  const [showChildrenDialog, setShowChildrenDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [relationshipFilter, setRelationshipFilter] = useState('all');
  const { toast } = useToast();

  const getBaseUrl = () => {
    return localStorage.getItem('baseUrl') || 'http://localhost:3000';
  };

  const getAuthToken = () => {
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken');
    return token;
  };

  const getApiHeaders = () => {
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  const fetchParents = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });

      // Only add isActive if it's not 'all'
      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter);
      }

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      // Only add relationship if it's not 'all'
      if (relationshipFilter !== 'all') {
        params.append('relationship', relationshipFilter);
      }

      console.log('Fetching parents with params:', params.toString());

      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/parents?${params}`, {
        headers: getApiHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ParentsResponse = await response.json();
      console.log('Parents data received:', data);
      
      setParents(data.data);
      setTotalPages(data.meta.totalPages);
      setTotalItems(data.meta.total);
      setDataLoaded(true);
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
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/parents/${parentId}/children`, {
        headers: getApiHeaders()
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

  const handleLoadData = () => {
    fetchParents();
  };

  useEffect(() => {
    if (!dataLoaded) {
      handleLoadData();
    }
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      fetchParents();
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, relationshipFilter]);

  const handleViewParent = (parent: Parent) => {
    setSelectedParent(parent);
    setShowViewDialog(true);
  };

  const handleViewChildren = async (parent: Parent) => {
    setSelectedParent(parent);
    await fetchChildren(parent.userId);
    setShowChildrenDialog(true);
  };

  const handleEditParent = (parent: Parent) => {
    setSelectedParent(parent);
    setShowEditDialog(true);
  };

  const handleDeleteParent = async (parent: Parent) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/parents/${parent.userId}`, {
        method: 'DELETE',
        headers: getApiHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete parent');
      }

      toast({
        title: "Parent Deleted",
        description: `Parent ${parent.user.firstName} ${parent.user.lastName} has been deleted.`,
        variant: "destructive"
      });
      
      await fetchParents();
    } catch (error) {
      console.error('Error deleting parent:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete parent. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateParent = async (parentData: any) => {
    try {
      setLoading(true);
      
      const headers = getApiHeaders();
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/parents`, {
        method: 'POST',
        headers,
        body: JSON.stringify(parentData)
      });

      if (!response.ok) {
        throw new Error('Failed to create parent');
      }

      toast({
        title: "Parent Created",
        description: `Parent ${parentData.firstName} ${parentData.lastName} has been created successfully.`
      });
      
      setShowCreateDialog(false);
      await fetchParents();
    } catch (error) {
      console.error('Error creating parent:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create parent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateParent = async (parentData: any) => {
    if (!selectedParent) return;
    
    try {
      setLoading(true);
      
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/parents/${selectedParent.userId}`, {
        method: 'PATCH',
        headers: getApiHeaders(),
        body: JSON.stringify(parentData)
      });

      if (!response.ok) {
        throw new Error('Failed to update parent');
      }

      toast({
        title: "Parent Updated",
        description: `Parent ${parentData.firstName} ${parentData.lastName} has been updated successfully.`
      });
      
      setShowEditDialog(false);
      setSelectedParent(null);
      await fetchParents();
    } catch (error) {
      console.error('Error updating parent:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update parent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

      {!dataLoaded ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Parents Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load parents data
          </p>
          <Button 
            onClick={handleLoadData} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading Data...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Load Data
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 items-end mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search parents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="min-w-[150px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Relations</SelectItem>
                  <SelectItem value="father">Father</SelectItem>
                  <SelectItem value="mother">Mother</SelectItem>
                  <SelectItem value="guardian">Guardian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleLoadData} 
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>

          <DataTable
            title=""
            data={parents}
            columns={columns}
            onAdd={() => setShowCreateDialog(true)}
            onEdit={handleEditParent}
            onDelete={handleDeleteParent}
            onView={handleViewParent}
            searchPlaceholder="Search parents..."
            customActions={[
              {
                label: 'View Children',
                action: handleViewChildren,
                variant: 'outline',
                icon: Eye
              }
            ]}
            currentPage={currentPage}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Parent</DialogTitle>
          </DialogHeader>
          <CreateParentForm
            onSubmit={handleCreateParent}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Parent</DialogTitle>
          </DialogHeader>
          <CreateParentForm
            initialData={selectedParent}
            onSubmit={handleUpdateParent}
            onCancel={() => {
              setShowEditDialog(false);
              setSelectedParent(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Parent Details</DialogTitle>
          </DialogHeader>
          {selectedParent && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedParent.user.imageUrl || ''} alt={selectedParent.user.firstName} />
                  <AvatarFallback>
                    {selectedParent.user.firstName.charAt(0)}{selectedParent.user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedParent.user.firstName} {selectedParent.user.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedParent.occupation}</p>
                  <Badge variant={selectedParent.user.isActive ? "default" : "secondary"}>
                    {selectedParent.user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email:</label>
                  <p className="text-sm">{selectedParent.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone:</label>
                  <p className="text-sm">{selectedParent.user.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Work Phone:</label>
                  <p className="text-sm">{selectedParent.workPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Workplace:</label>
                  <p className="text-sm">{selectedParent.workplace}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Education Level:</label>
                  <p className="text-sm">{selectedParent.educationLevel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender:</label>
                  <p className="text-sm">{selectedParent.user.gender}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Address:</label>
                <p className="text-sm">
                  {selectedParent.user.addressLine1}
                  {selectedParent.user.addressLine2 && `, ${selectedParent.user.addressLine2}`}
                  <br />
                  {selectedParent.user.city}, {selectedParent.user.district}, {selectedParent.user.province}
                  <br />
                  {selectedParent.user.postalCode}, {selectedParent.user.country}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Children Dialog */}
      <Dialog open={showChildrenDialog} onOpenChange={setShowChildrenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Children of {selectedParent?.user.firstName} {selectedParent?.user.lastName}
            </DialogTitle>
            <DialogDescription>
              View all children associated with this parent
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
                <div className="text-center py-8">
                  <p className="text-gray-500">No children found for this parent.</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Parents;
