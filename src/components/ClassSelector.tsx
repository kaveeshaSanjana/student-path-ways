
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { School, Users, CheckCircle, RefreshCw, Calendar, GraduationCap, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClassData {
  id: string;
  instituteId: string;
  name: string;
  code: string;
  academicYear: string;
  level: number;
  grade: number;
  specialty: string;
  classType: string;
  capacity: number;
  classTeacherId: string;
  description: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  enrollmentCode: string;
  enrollmentEnabled: boolean;
  requireTeacherVerification: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: ClassData[];
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

const ClassSelector = () => {
  const { selectedInstitute, setSelectedClass } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [grade, setGrade] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  const [classType, setClassType] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<string>('');

  const getBaseUrl = () => {
    return localStorage.getItem('baseUrl') || 'http://localhost:3000';
  };

  const getAuthToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No authentication token found in localStorage');
      toast({
        title: "Authentication Error",
        description: "No authentication token found. Please login again.",
        variant: "destructive"
      });
      return null;
    }
    return token;
  };

  const getApiHeaders = () => {
    const token = getAuthToken();
    if (!token) return null;
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    };
  };

  const handleLoadClasses = async () => {
    if (!selectedInstitute?.id) {
      console.error('No institute selected');
      toast({
        title: "Error",
        description: "Please select an institute first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('Loading classes...');
    
    const headers = getApiHeaders();
    if (!headers) {
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = getBaseUrl();
      const params = new URLSearchParams({
        page: '1',
        limit: '10',
        instituteId: selectedInstitute.id,
        isActive: 'true'
      });

      // Add optional filters
      if (grade && grade !== 'all') {
        params.append('grade', grade);
      }
      if (search.trim()) {
        params.append('search', search.trim());
      }
      if (specialty && specialty !== 'all') {
        params.append('specialty', specialty);
      }
      if (classType && classType !== 'all') {
        params.append('classType', classType);
      }
      if (academicYear && academicYear !== 'all') {
        params.append('academicYear', academicYear);
      }

      const url = `${baseUrl}/institute-classes?${params.toString()}`;
      console.log(`API Request URL: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        throw new Error('Server returned non-JSON response');
      }

      const result: ApiResponse = await response.json();
      console.log('Classes API Response:', result);

      setClasses(result.data);
      
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${result.data.length} classes.`
      });
    } catch (error) {
      console.error('Failed to load classes:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load classes data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectClass = (classData: ClassData) => {
    const classInfo = {
      id: classData.id,
      name: classData.name,
      code: classData.code,
      description: classData.description,
      grade: classData.grade,
      specialty: classData.specialty
    };
    setSelectedClass(classInfo);
    
    toast({
      title: "Class Selected",
      description: `Selected class: ${classInfo.name}`
    });
  };

  const clearFilters = () => {
    setGrade('');
    setSearch('');
    setSpecialty('');
    setClassType('');
    setAcademicYear('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Select Class
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a class to manage subjects and attendance
        </p>
        {selectedInstitute && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            Institute: {selectedInstitute.name}
          </p>
        )}
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Classes</CardTitle>
          <CardDescription>Use filters to find specific classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="grade-filter">Grade</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {Array.from({ length: 13 }, (_, i) => i + 1).map(gradeNum => (
                    <SelectItem key={gradeNum} value={gradeNum.toString()}>
                      Grade {gradeNum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="specialty-filter">Specialty</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="class-type-filter">Class Type</Label>
              <Select value={classType} onValueChange={setClassType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="academic-year-filter">Academic Year</Label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search-filter">Search</Label>
              <Input
                id="search-filter"
                placeholder="Search classes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleLoadClasses} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 flex-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading Classes...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Load Classes
                </>
              )}
            </Button>
            <Button 
              onClick={clearFilters}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Classes List */}
      {classes.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Available Classes ({classes.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classData) => (
              <Card 
                key={classData.id} 
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-blue-500"
                onClick={() => handleSelectClass(classData)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <School className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{classData.name}</CardTitle>
                    </div>
                    {classData.isActive && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Code: {classData.code} | {classData.specialty}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Grade {classData.grade}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{classData.capacity} students</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{classData.academicYear}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{classData.classType}</span>
                    </div>
                  </div>

                  {classData.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {classData.description}
                    </p>
                  )}

                  {classData.enrollmentEnabled && (
                    <Badge variant="outline" className="w-fit">
                      Enrollment Open
                    </Badge>
                  )}

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectClass(classData);
                    }}
                  >
                    Select Class
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {classes.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <School className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No classes loaded yet. Use the filters above and click "Load Classes" to see available classes.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassSelector;
