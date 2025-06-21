
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';

// Mock subject data
const mockSubjects = [
  {
    id: '1',
    name: 'Mathematics',
    code: 'MATH-101',
    description: 'Advanced Mathematics including Algebra and Calculus',
    periodsPerWeek: 6,
    isMandatory: true,
    teacher: 'Dr. Smith Johnson'
  },
  {
    id: '2',
    name: 'Physics',
    code: 'PHY-101',
    description: 'Fundamental Physics concepts and laboratory work',
    periodsPerWeek: 5,
    isMandatory: true,
    teacher: 'Prof. Emily Davis'
  },
  {
    id: '3',
    name: 'Chemistry',
    code: 'CHEM-101',
    description: 'Organic and Inorganic Chemistry with practical sessions',
    periodsPerWeek: 5,
    isMandatory: true,
    teacher: 'Dr. Michael Brown'
  },
  {
    id: '4',
    name: 'Biology',
    code: 'BIO-101',
    description: 'Life Sciences and Human Biology',
    periodsPerWeek: 4,
    isMandatory: false,
    teacher: 'Dr. Sarah Wilson'
  }
];

const SubjectSelector = () => {
  const { setSelectedSubject } = useAuth();

  const handleSelectSubject = (subject: any) => {
    setSelectedSubject(subject);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Select Subject
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a subject to manage lectures and attendance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSubjects.map((subject) => (
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
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{subject.periodsPerWeek} periods/week</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Teacher: </span>
                  {subject.teacher}
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Select Subject
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
