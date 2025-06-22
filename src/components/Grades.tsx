
import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

const mockGrades = [
  {
    id: '1',
    gradeId: 'GRD001',
    name: 'Grade 10',
    level: 'Secondary',
    description: 'Tenth grade level students',
    totalClasses: 3,
    totalStudents: 85,
    subjects: 'Math, Science, English, History',
    academicYear: '2024-2025',
    status: 'Active'
  },
  {
    id: '2',
    gradeId: 'GRD002',
    name: 'Grade 11',
    level: 'Higher Secondary',
    description: 'Eleventh grade level students',
    totalClasses: 2,
    totalStudents: 56,
    subjects: 'Math, Physics, Chemistry, Biology',
    academicYear: '2024-2025',
    status: 'Active'
  },
  {
    id: '3',
    gradeId: 'GRD003',
    name: 'Grade 12',
    level: 'Higher Secondary',
    description: 'Twelfth grade level students',
    totalClasses: 2,
    totalStudents: 48,
    subjects: 'Advanced Math, Physics, Chemistry',
    academicYear: '2024-2025',
    status: 'Active'
  }
];

const mockClasses = [
  {
    id: '1',
    classId: 'CLS001',
    name: 'Grade 10-A',
    grade: 'Grade 10',
    section: 'A',
    studentsCount: 30,
    teacher: 'Mr. Johnson',
    room: 'Room 101',
    status: 'Active'
  },
  {
    id: '2',
    classId: 'CLS002',
    name: 'Grade 10-B',
    grade: 'Grade 10',
    section: 'B',
    studentsCount: 28,
    teacher: 'Ms. Smith',
    room: 'Room 102',
    status: 'Active'
  },
  {
    id: '3',
    classId: 'CLS003',
    name: 'Grade 11-S',
    grade: 'Grade 11',
    section: 'Science',
    studentsCount: 25,
    teacher: 'Dr. Wilson',
    room: 'Room 201',
    status: 'Active'
  }
];

const Grades = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [selectedGradeForClasses, setSelectedGradeForClasses] = useState<string>('');

  const gradesColumns = [
    { key: 'gradeId', header: 'Grade ID' },
    { key: 'name', header: 'Grade Name' },
    { key: 'level', header: 'Level' },
    { key: 'description', header: 'Description' },
    { key: 'totalClasses', header: 'Classes' },
    { key: 'totalStudents', header: 'Students' },
    { key: 'subjects', header: 'Subjects' },
    { key: 'academicYear', header: 'Academic Year' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    }
  ];

  const classesColumns = [
    { key: 'classId', header: 'Class ID' },
    { key: 'name', header: 'Class Name' },
    { key: 'section', header: 'Section' },
    { key: 'studentsCount', header: 'Students' },
    { key: 'teacher', header: 'Class Teacher' },
    { key: 'room', header: 'Room' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    }
  ];

  const handleCreateGrade = () => {
    toast({
      title: "Create Grade",
      description: "Opening grade creation form..."
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditGrade = (grade: any) => {
    setSelectedGrade(grade);
    setIsEditDialogOpen(true);
    toast({
      title: "Edit Grade",
      description: `Editing grade: ${grade.name}`
    });
  };

  const handleDeleteGrade = (grade: any) => {
    toast({
      title: "Grade Deleted",
      description: `Grade ${grade.name} has been deleted.`,
      variant: "destructive"
    });
  };

  const handleViewGrade = (grade: any) => {
    toast({
      title: "View Grade",
      description: `Viewing grade: ${grade.name}`
    });
  };

  const handleAssignClass = (gradeClass: any) => {
    toast({
      title: "Assign Class",
      description: `Managing assignments for ${gradeClass.name}`
    });
  };

  const userRole = user?.role || 'Student';
  const canCreate = AccessControl.hasPermission(userRole, 'create-grade');
  const canEdit = AccessControl.hasPermission(userRole, 'edit-grade');
  const canDelete = AccessControl.hasPermission(userRole, 'delete-grade');
  const canView = AccessControl.hasPermission(userRole, 'view-grade-details');

  const filteredClasses = selectedGradeForClasses 
    ? mockClasses.filter(cls => cls.grade === selectedGradeForClasses)
    : mockClasses;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Grades Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage academic grades and assign classes
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Grades</p>
                <p className="text-3xl font-bold text-blue-600">{mockGrades.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Classes</p>
                <p className="text-3xl font-bold text-green-600">{mockClasses.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-3xl font-bold text-purple-600">
                  {mockGrades.reduce((sum, grade) => sum + grade.totalStudents, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <DataTable
        title="Academic Grades"
        data={mockGrades}
        columns={gradesColumns}
        onAdd={canCreate ? handleCreateGrade : undefined}
        onEdit={canEdit ? handleEditGrade : undefined}
        onDelete={canDelete ? handleDeleteGrade : undefined}
        onView={canView ? handleViewGrade : undefined}
        searchPlaceholder="Search grades..."
      />

      {/* Class Assignment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Class Assignment to Grades</CardTitle>
          <CardDescription>Assign and manage classes for each grade level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={selectedGradeForClasses} onValueChange={setSelectedGradeForClasses}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Grades</SelectItem>
                {mockGrades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.name}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {canCreate && (
              <Button onClick={() => toast({ title: "Create Class", description: "Opening class creation form..." })}>
                Create New Class
              </Button>
            )}
          </div>

          <DataTable
            title="Classes by Grade"
            data={filteredClasses}
            columns={classesColumns}
            onEdit={canEdit ? handleAssignClass : undefined}
            onView={canView ? handleAssignClass : undefined}
            searchPlaceholder="Search classes..."
            customActions={[
              {
                label: 'Assign',
                action: handleAssignClass,
                variant: 'outline',
                condition: () => canEdit
              }
            ]}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Grade</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-600">Grade creation form would go here...</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => {
                toast({ title: "Grade Created", description: "New grade has been created successfully." });
                setIsCreateDialogOpen(false);
              }}>
                Create Grade
              </Button>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Grade</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-600">Grade edit form would go here...</p>
            {selectedGrade && (
              <p className="text-sm text-gray-500 mt-2">Editing: {selectedGrade.name}</p>
            )}
            <div className="flex gap-2 mt-4">
              <Button onClick={() => {
                toast({ title: "Grade Updated", description: "Grade has been updated successfully." });
                setIsEditDialogOpen(false);
                setSelectedGrade(null);
              }}>
                Update Grade
              </Button>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedGrade(null);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Grades;
