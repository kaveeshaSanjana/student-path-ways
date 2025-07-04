
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { BookOpen, Clock, CheckCircle, RefreshCw, User, School } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClassSubjectData {
  instituteId: string;
  classId: string;
  subjectId: string;
  studentId?: string;
  teacherId?: string;
  institute?: {
    id: string;
    name: string;
    code: string;
  };
  class: {
    id: string;
    instituteId?: string;
    name: string;
    code: string;
    academicYear?: string;
    level?: number;
    grade?: number;
    specialty?: string;
    classType?: string;
    capacity?: number;
    classTeacherId?: string;
    description?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    enrollmentCode?: string;
    enrollmentEnabled?: boolean;
    requireTeacherVerification?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SubjectCardData {
  id: string;
  name: string;
  code: string;
  description: string;
  className: string;
  classCode: string;
  teacherName?: string;
  isMandatory: boolean;
}

const SubjectSelector = () => {
  const { user, selectedInstitute, setSelectedSubject, currentInstituteId } = useAuth();
  const { toast } = useToast();
  const [subjectsData, setSubjectsData] = useState<SubjectCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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

  const fetchSubjectsByRole = async () => {
    setIsLoading(true);
    console.log('Loading subjects data for user role:', user?.role);
    
    try {
      const baseUrl = getBaseUrl();
      const headers = getApiHeaders();
      let url = '';
      
      const userRole = (user?.role || 'Student') as UserRole;
      
      if (userRole === 'Student') {
        // For students: get subjects they are enrolled in
        url = `${baseUrl}/institute-class-subject-students/student/${user?.id}/class-details?limit=100&instituteId=${currentInstituteId}&isActive=true`;
      } else if (userRole === 'Teacher') {
        // For teachers: get subjects they teach
        url = `${baseUrl}/institute-class-subjects/teacher/${user?.id}`;
      } else if (userRole === 'InstituteAdmin' || userRole === 'AttendanceMarker') {
        // For institute admin/attendance marker: get all institute subjects
        url = `${baseUrl}/institute-class-subjects/institute/${currentInstituteId}`;
      } else {
        throw new Error('Unsupported user role for subject selection');
      }

      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subjects data: ${response.status}`);
      }

      const result = await response.json();
      console.log('Raw API response:', result);
      
      let classSubjects: ClassSubjectData[] = [];
      
      // Handle different response structures
      if (Array.isArray(result)) {
        classSubjects = result;
      } else if (result.data && Array.isArray(result.data)) {
        classSubjects = result.data;
      } else {
        console.warn('Unexpected response structure:', result);
        classSubjects = [];
      }

      // Transform the data to subject cards
      const transformedSubjects = await transformToSubjectCards(classSubjects, userRole);
      
      console.log('Transformed subjects:', transformedSubjects);
      setSubjectsData(transformedSubjects);
      setDataLoaded(true);
      
      toast({
        title: "Subjects Loaded",
        description: `Successfully loaded ${transformedSubjects.length} subjects.`
      });
      
    } catch (error) {
      console.error('Failed to load subjects:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load subjects data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const transformToSubjectCards = async (classSubjects: ClassSubjectData[], userRole: UserRole): Promise<SubjectCardData[]> => {
    const subjectCards: SubjectCardData[] = [];
    const baseUrl = getBaseUrl();
    const headers = getApiHeaders();

    for (const item of classSubjects) {
      let subjectInfo = item.subject;
      
      // If subject info is not in the response, fetch it
      if (!subjectInfo && item.subjectId) {
        try {
          const subjectResponse = await fetch(`${baseUrl}/subjects/${item.subjectId}`, {
            method: 'GET',
            headers
          });
          
          if (subjectResponse.ok) {
            subjectInfo = await subjectResponse.json();
          }
        } catch (error) {
          console.error('Error fetching subject details:', error);
        }
      }

      if (subjectInfo) {
        const teacherName = item.teacher 
          ? `${item.teacher.firstName} ${item.teacher.lastName}`
          : 'Not assigned';

        subjectCards.push({
          id: item.subjectId,
          name: subjectInfo.name,
          code: subjectInfo.code,
          description: `${item.class.name} - ${item.class.specialty || item.class.classType || 'General'}`,
          className: item.class.name,
          classCode: item.class.code,
          teacherName: teacherName,
          isMandatory: true // You can determine this based on your business logic
        });
      }
    }

    // Remove duplicates based on subject ID
    const uniqueSubjects = subjectCards.filter((subject, index, self) => 
      index === self.findIndex(s => s.id === subject.id)
    );

    return uniqueSubjects;
  };

  const handleSelectSubject = (subject: SubjectCardData) => {
    console.log('Selecting subject:', subject);
    
    // Set the selected subject in auth context
    setSelectedSubject({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      description: subject.description
    });

    toast({
      title: "Subject Selected",
      description: `Selected ${subject.name} (${subject.code})`
    });
  };

  useEffect(() => {
    if (user && currentInstituteId) {
      fetchSubjectsByRole();
    }
  }, [user, currentInstituteId]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Please log in to view subjects.</p>
      </div>
    );
  }

  if (!currentInstituteId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Please select an institute first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Select Subject
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a subject to manage lectures and attendance
          </p>
          {selectedInstitute && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              Institute: {selectedInstitute.name}
            </p>
          )}
        </div>
        <Button 
          onClick={fetchSubjectsByRole} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {!dataLoaded ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the refresh button above to load your subjects
          </p>
          <Button 
            onClick={fetchSubjectsByRole} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading Subjects...
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Load My Subjects
              </>
            )}
          </Button>
        </div>
      ) : subjectsData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No subjects found for your role.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectsData.map((subject) => (
            <Card 
              key={subject.id} 
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
              onClick={() => handleSelectSubject(subject)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <Badge 
                    variant={subject.isMandatory ? "default" : "secondary"}
                    className={subject.isMandatory ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                  >
                    {subject.isMandatory ? "Mandatory" : "Elective"}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{subject.name}</CardTitle>
                <CardDescription>
                  Code: {subject.code}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {subject.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <School className="h-4 w-4 mr-2" />
                    <span>{subject.className} ({subject.classCode})</span>
                  </div>
                  {subject.teacherName && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      <span>Teacher: {subject.teacherName}</span>
                    </div>
                  )}
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Select Subject
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectSelector;
