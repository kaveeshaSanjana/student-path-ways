
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Users, CheckCircle } from 'lucide-react';

// Mock class data
const mockClasses = [
  {
    id: '1',
    name: 'Grade 10 - Science',
    code: 'G10-SCI',
    description: 'Advanced Science stream for Grade 10 students',
    studentsCount: 35,
    isActive: true,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology']
  },
  {
    id: '2',
    name: 'Grade 11 - Commerce',
    code: 'G11-COM',
    description: 'Commerce stream for Grade 11 students',
    studentsCount: 28,
    isActive: true,
    subjects: ['Accounting', 'Economics', 'Business Studies']
  },
  {
    id: '3',
    name: 'Grade 12 - Arts',
    code: 'G12-ART',
    description: 'Arts stream for Grade 12 students',
    studentsCount: 22,
    isActive: true,
    subjects: ['History', 'Geography', 'Literature', 'Psychology']
  }
];

const ClassSelector = () => {
  const { setSelectedClass } = useAuth();

  const handleSelectClass = (classData: any) => {
    setSelectedClass(classData);
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClasses.map((classItem) => (
          <Card 
            key={classItem.id} 
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
            onClick={() => handleSelectClass(classItem)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                {classItem.isActive && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{classItem.name}</CardTitle>
              <CardDescription>
                Code: {classItem.code}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {classItem.description}
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Users className="h-4 w-4 mr-2" />
                <span>{classItem.studentsCount} Students</span>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subjects:</p>
                <div className="flex flex-wrap gap-1">
                  {classItem.subjects.slice(0, 3).map((subject, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                  {classItem.subjects.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{classItem.subjects.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Select Class
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClassSelector;
