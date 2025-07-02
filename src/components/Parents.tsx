
import React, { useState } from 'react';
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SearchIcon, RefreshCwIcon, EyeIcon, PencilIcon, Users2Icon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
    addressLine2?: string;
    city: string;
    district: string;
    province: string;
    postalCode: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl?: string;
  };
}

interface ApiResponse {
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

interface Child {
  id: string;
  userId: string;
  fatherId?: string;
  motherId?: string;
  guardianId?: string;
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
    city: string;
    district: string;
    province: string;
    postalCode: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl?: string;
  };
}

interface ChildrenResponse {
  parent: Parent;
  children: {
    asFather: Child[];
    asMother: Child[];
    asGuardian: Child[];
  };
}

const Parents = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelationship, setSelectedrelationship] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // View dialogs
  const [viewingParent, setViewingParent] = useState<Parent | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showChildrenDialog, setShowChildrenDialog] = useState(false);
  const [childrenData, setChildrenData] = useState<ChildrenResponse | null>(null);

  const getBaseUrl = () => {
    return localStorage.getItem('baseUrl') || 'http://localhost:3000';
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    params.append('page', currentPage.toString());
    params.append('limit', itemsPerPage.toString());
    
    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }
    if (selectedRelationship && selectedRelationship !== 'all') {
      params.append('relationship', selectedRelationship);
    }
    if (selectedStatus && selectedStatus !== 'all') {
      params.append('isActive', selectedStatus);
    }
    
    return params.toString();
  };

  const fetchParents = async () => {
    try {
      console.log('Loading parents data...');
      setLoading(true);
      setError(null);
      
      const baseUrl = getBaseUrl();
      const queryParams = buildQueryParams();
      const url = `${baseUrl}/parents?${queryParams}`;
      
      console.log('API URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Parents data:', data);
      
      if (data.data && Array.isArray(data.data)) {
        setParents(data.data);
        setTotalPages(data.meta?.totalPages || 1);
        setTotalItems(data.meta?.total || 0);
      } else {
        console.error('Unexpected data format:', data);
        setParents([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error loading parents:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load parents';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage + ". Please check if backend is running.",
        variant: "destructive",
      });
      setParents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewParent = (parent: Parent) => {
    setViewingParent(parent);
    setShowViewDialog(true);
  };

  const handleViewChildren = async (parentId: string) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/parents/${parentId}/children`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch children data');
      }

      const data = await response.json();
      setChildrenData(data);
      setShowChildrenDialog(true);
    } catch (error) {
      console.error('Error loading children:', error);
      toast({
        title: "Error",
        description: "Failed to load children data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditParent = (parent: Parent) => {
    setEditingParent(parent);
    setShowEditForm(true);
  };

  const handleUpdateParent = async (updatedData: any) => {
    if (!editingParent) return;
    
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/parents/${editingParent.userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update parent');
      }

      toast({
        title: "Success",
        description: "Parent updated successfully",
      });

      await fetchParents();
      setShowEditForm(false);
      setEditingParent(null);
    } catch (error) {
      console.error('Error updating parent:', error);
      toast({
        title: "Error",
        description: "Failed to update parent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchParents();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedrelationship('all');
    setSelectedStatus('all');
    setCurrentPage(1);
    setParents([]);
  };

  // Don't show Parents section if not SystemAdmin
  if (currentUser?.role !== 'SystemAdmin') {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-600">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view this section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parents Management</h1>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>
            Filter parents by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search parents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="relationship">Relationship</Label>
              <Select 
                value={selectedRelationship} 
                onValueChange={setSelectedrelationship}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Relationships" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Relationships</SelectItem>
                  <SelectItem value="father">Father</SelectItem>
                  <SelectItem value="mother">Mother</SelectItem>
                  <SelectItem value="guardian">Guardian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={selectedStatus} 
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSearch}>
              <SearchIcon className="h-4 w-4 mr-2" />
              Load Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center p-8">
          <p>Loading parents...</p>
        </div>
      ) : error ? (
        <div className="text-center p-8">
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-600 font-medium">Error Loading Parents</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => fetchParents()} 
                className="mt-4"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : parents.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Occupation</TableHead>
                  <TableHead>Workplace</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parents.map(parent => (
                  <TableRow key={parent.userId}>
                    <TableCell className="font-medium">
                      {parent.user.firstName} {parent.user.lastName}
                    </TableCell>
                    <TableCell>{parent.user.email}</TableCell>
                    <TableCell>{parent.user.phone}</TableCell>
                    <TableCell>{parent.occupation}</TableCell>
                    <TableCell>{parent.workplace}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        parent.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {parent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewParent(parent)}
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditParent(parent)}
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewChildren(parent.userId)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Users2Icon className="h-4 w-4 mr-2" />
                          View Children
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing page {currentPage} of {totalPages} ({totalItems} total parents)
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => {
                    const newPage = currentPage - 1;
                    handlePageChange(newPage);
                    setTimeout(() => fetchParents(), 100);
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    const newPage = currentPage + 1;
                    handlePageChange(newPage);
                    setTimeout(() => fetchParents(), 100);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-8">
          <p>No parents found. Click "Load Data" to fetch parents.</p>
        </div>
      )}

      {/* View Parent Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Parent Details</DialogTitle>
            <DialogDescription>
              Complete information for {viewingParent?.user.firstName} {viewingParent?.user.lastName}
            </DialogDescription>
          </DialogHeader>
          {viewingParent && (
            <div className="space-y-4">
              {viewingParent.user.imageUrl && (
                <div className="flex justify-center">
                  <img 
                    src={viewingParent.user.imageUrl} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">First Name</Label>
                  <p className="text-sm">{viewingParent.user.firstName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Last Name</Label>
                  <p className="text-sm">{viewingParent.user.lastName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p className="text-sm">{viewingParent.user.email}</p>
                </div>
                <div>
                  <Label className="font-semibold">Phone</Label>
                  <p className="text-sm">{viewingParent.user.phone}</p>
                </div>
                <div>
                  <Label className="font-semibold">Gender</Label>
                  <p className="text-sm">{viewingParent.user.gender}</p>
                </div>
                <div>
                  <Label className="font-semibold">Date of Birth</Label>
                  <p className="text-sm">{viewingParent.user.dateOfBirth}</p>
                </div>
                <div>
                  <Label className="font-semibold">NIC</Label>
                  <p className="text-sm">{viewingParent.user.nic}</p>
                </div>
                <div>
                  <Label className="font-semibold">Birth Certificate No</Label>
                  <p className="text-sm">{viewingParent.user.birthCertificateNo}</p>
                </div>
                <div className="col-span-2">
                  <Label className="font-semibold">Address</Label>
                  <p className="text-sm">
                    {viewingParent.user.addressLine1}
                    {viewingParent.user.addressLine2 && `, ${viewingParent.user.addressLine2}`}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">City</Label>
                  <p className="text-sm">{viewingParent.user.city}</p>
                </div>
                <div>
                  <Label className="font-semibold">District</Label>
                  <p className="text-sm">{viewingParent.user.district}</p>
                </div>
                <div>
                  <Label className="font-semibold">Province</Label>
                  <p className="text-sm">{viewingParent.user.province}</p>
                </div>
                <div>
                  <Label className="font-semibold">Postal Code</Label>
                  <p className="text-sm">{viewingParent.user.postalCode}</p>
                </div>
                <div>
                  <Label className="font-semibold">Country</Label>
                  <p className="text-sm">{viewingParent.user.country}</p>
                </div>
                <div>
                  <Label className="font-semibold">Occupation</Label>
                  <p className="text-sm">{viewingParent.occupation}</p>
                </div>
                <div>
                  <Label className="font-semibold">Workplace</Label>
                  <p className="text-sm">{viewingParent.workplace}</p>
                </div>
                <div>
                  <Label className="font-semibold">Work Phone</Label>
                  <p className="text-sm">{viewingParent.workPhone}</p>
                </div>
                <div>
                  <Label className="font-semibold">Education Level</Label>
                  <p className="text-sm">{viewingParent.educationLevel}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    viewingParent.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingParent.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Children Dialog */}
      <Dialog open={showChildrenDialog} onOpenChange={setShowChildrenDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Children Details</DialogTitle>
            <DialogDescription>
              Children associated with {childrenData?.parent.user.firstName} {childrenData?.parent.user.lastName}
            </DialogDescription>
          </DialogHeader>
          {childrenData && (
            <div className="space-y-6">
              {/* As Father */}
              {childrenData.children.asFather.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">As Father</h3>
                  <div className="space-y-3">
                    {childrenData.children.asFather.map((child) => (
                      <Card key={child.id}>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><strong>Name:</strong> {child.user.firstName} {child.user.lastName}</div>
                            <div><strong>Student ID:</strong> {child.studentId}</div>
                            <div><strong>Email:</strong> {child.user.email}</div>
                            <div><strong>Phone:</strong> {child.user.phone}</div>
                            <div><strong>Emergency Contact:</strong> {child.emergencyContact}</div>
                            <div><strong>Blood Group:</strong> {child.bloodGroup}</div>
                            <div className="col-span-2"><strong>Medical Conditions:</strong> {child.medicalConditions}</div>
                            <div className="col-span-2"><strong>Allergies:</strong> {child.allergies}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* As Mother */}
              {childrenData.children.asMother.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">As Mother</h3>
                  <div className="space-y-3">
                    {childrenData.children.asMother.map((child) => (
                      <Card key={child.id}>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><strong>Name:</strong> {child.user.firstName} {child.user.lastName}</div>
                            <div><strong>Student ID:</strong> {child.studentId}</div>
                            <div><strong>Email:</strong> {child.user.email}</div>
                            <div><strong>Phone:</strong> {child.user.phone}</div>
                            <div><strong>Emergency Contact:</strong> {child.emergencyContact}</div>
                            <div><strong>Blood Group:</strong> {child.bloodGroup}</div>
                            <div className="col-span-2"><strong>Medical Conditions:</strong> {child.medicalConditions}</div>
                            <div className="col-span-2"><strong>Allergies:</strong> {child.allergies}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* As Guardian */}
              {childrenData.children.asGuardian.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">As Guardian</h3>
                  <div className="space-y-3">
                    {childrenData.children.asGuardian.map((child) => (
                      <Card key={child.id}>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><strong>Name:</strong> {child.user.firstName} {child.user.lastName}</div>
                            <div><strong>Student ID:</strong> {child.studentId}</div>
                            <div><strong>Email:</strong> {child.user.email}</div>
                            <div><strong>Phone:</strong> {child.user.phone}</div>
                            <div><strong>Emergency Contact:</strong> {child.emergencyContact}</div>
                            <div><strong>Blood Group:</strong> {child.bloodGroup}</div>
                            <div className="col-span-2"><strong>Medical Conditions:</strong> {child.medicalConditions}</div>
                            <div className="col-span-2"><strong>Allergies:</strong> {child.allergies}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {childrenData.children.asFather.length === 0 && 
               childrenData.children.asMother.length === 0 && 
               childrenData.children.asGuardian.length === 0 && (
                <p className="text-center text-gray-500">No children found for this parent.</p>
              )}
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowChildrenDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Parents;
