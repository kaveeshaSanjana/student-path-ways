import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Plus, Edit, Trash2, Eye, Users, BookOpen } from 'lucide-react';

// Mock grades data
const mockGrades = [
  {
    id: '1',
    name: 'Grade 10',
    level: 10,
    description: 'Secondary School Grade 10',
    studentsCount: 150,
    classesCount: 5,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    createdAt: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    name: 'Grade 11',
    level: 11,
    description: 'Secondary School Grade 11',
    studentsCount: 120,
    classesCount: 4,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'],
    createdAt: '2024-01-15',
    isActive: true
  },
  {
    id: '3',
    name: 'Grade 12',
    level: 12,
    description: 'Secondary School Grade 12',
    studentsCount: 100,
    classesCount: 3,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'],
    createdAt: '2024-01-15',
    isActive: true
  }
];

// Mock classes data for assignment
const mockClasses = [
  { id: '1', name: 'Class 10-A', studentsCount: 35 },
  { id: '2', name: 'Class 10-B', studentsCount: 30 },
  { id: '3', name: 'Class 11-A', studentsCount: 28 },
  { id: '4', name: 'Class 11-B', studentsCount: 32 },
  { id: '5', name: 'Class 12-A', studentsCount: 25 }
];

interface Grade {
  id: string;
  name: string;
  level: number;
  description: string;
  studentsCount: number;
  classesCount: number;
  subjects: string[];
  createdAt: string;
  isActive: boolean;
}

interface Class {
  id: string;
  name: string;
  studentsCount: number;
}

const Grades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [currentView, setCurrentView] = useState('list');
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    description: ''
  });

  // Class assignment states
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [assignedClasses, setAssignedClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState('');

  const userRole = user?.role || 'Student';

  useEffect(() => {
    if (selectedGrade) {
      // Filter classes - in real app, this would be based on grade level
      const available = classes.filter(cls => !assignedClasses.find(ac => ac.id === cls.id));
      setAvailableClasses(available);
    }
  }, [selectedGrade, classes, assignedClasses]);

  // Filter grades based on search and filters
  const filteredGrades = grades.filter((grade) => {
    const matchesSearch = grade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || grade.level.toString() === filterLevel;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && grade.isActive) ||
                         (filterStatus === 'inactive' && !grade.isActive);
    
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Table columns
  const columns = [
    {
      key: 'name',
      header: 'Grade Name',
    },
    {
      key: 'level',
      header: 'Level',
      render: (value: any, row: any) => (
        <Badge variant="outline">Level {value}</Badge>
      ),
    },
    {
      key: 'description',
      header: 'Description',
    },
    {
      key: 'studentsCount',
      header: 'Students',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-gray-500" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'classesCount',
      header: 'Classes',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-1">
          <BookOpen className="h-4 w-4 text-gray-500" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value: any, row: any) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const handleViewGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    setCurrentView('details');
  };

  const handleEditGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    setFormData({
      name: grade.name,
      level: grade.level.toString(),
      description: grade.description
    });
    setIsCreating(true);
    setCurrentView('form');
  };

  const handleCreateGrade = () => {
    setSelectedGrade(null);
    setFormData({ name: '', level: '', description: '' });
    setIsCreating(true);
    setCurrentView('form');
  };

  const handleDeleteGrade = (gradeId: string) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      setGrades(grades.filter(g => g.id !== gradeId));
    }
  };

  const handleSubmitForm = () => {
    if (selectedGrade) {
      // Update existing grade
      setGrades(grades.map(g => g.id === selectedGrade.id ? {
        ...g,
        name: formData.name,
        level: parseInt(formData.level),
        description: formData.description
      } : g));
    } else {
      // Create new grade
      const newGrade: Grade = {
        id: Date.now().toString(),
        name: formData.name,
        level: parseInt(formData.level),
        description: formData.description,
        studentsCount: 0,
        classesCount: 0,
        subjects: [],
        createdAt: new Date().toISOString().split('T')[0],
        isActive: true
      };
      setGrades([...grades, newGrade]);
    }
    setCurrentView('list');
    setIsCreating(false);
  };

  const handleAssignClasses = () => {
    setCurrentView('assign-classes');
    setAssignedClasses([]); // Reset assigned classes
  };

  const handleAddClassToGrade = () => {
    if (selectedClass) {
      const classToAdd = availableClasses.find(c => c.id === selectedClass);
      if (classToAdd) {
        setAssignedClasses([...assignedClasses, classToAdd]);
        setSelectedClass('');
      }
    }
  };

  const handleRemoveClassFromGrade = (classId: string) => {
    setAssignedClasses(assignedClasses.filter(c => c.id !== classId));
  };

  const handleSaveClassAssignments = () => {
    // In real app, save the class assignments to backend
    console.log('Saving class assignments for grade:', selectedGrade?.name, assignedClasses);
    setCurrentView('details');
  };

  // Render different views
  if (currentView === 'form') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isCreating ? (selectedGrade ? 'Edit Grade' : 'Create Grade') : 'Grade Details'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isCreating ? 'Fill in the grade information' : 'View grade details'}
            </p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('list')}>
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selectedGrade ? 'Edit Grade' : 'Create New Grade'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Grade Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter grade name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Grade Level</label>
                <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                    <SelectItem value="5">Level 5</SelectItem>
                    <SelectItem value="6">Level 6</SelectItem>
                    <SelectItem value="7">Level 7</SelectItem>
                    <SelectItem value="8">Level 8</SelectItem>
                    <SelectItem value="9">Level 9</SelectItem>
                    <SelectItem value="10">Level 10</SelectItem>
                    <SelectItem value="11">Level 11</SelectItem>
                    <SelectItem value="12">Level 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter grade description"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmitForm}>
                {selectedGrade ? 'Update Grade' : 'Create Grade'}
              </Button>
              <Button variant="outline" onClick={() => setCurrentView('list')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'details' && selectedGrade) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {selectedGrade.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Grade level {selectedGrade.level} details and management
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentView('list')}>
              Back to List
            </Button>
            {AccessControl.hasPermission(userRole as any, 'edit-grade') && (
              <Button onClick={() => handleEditGrade(selectedGrade)}>
                Edit Grade
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {selectedGrade.studentsCount}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total enrolled students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {selectedGrade.classesCount}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={selectedGrade.isActive ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                {selectedGrade.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grade Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 dark:text-white">{selectedGrade.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-gray-900 dark:text-white">{selectedGrade.createdAt}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Subjects</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedGrade.subjects.map((subject, index) => (
                    <Badge key={index} variant="outline">{subject}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={handleAssignClasses}>
                Assign Classes
              </Button>
              <Button variant="outline">
                View Students
              </Button>
              <Button variant="outline">
                Manage Subjects
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'assign-classes' && selectedGrade) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Assign Classes to {selectedGrade.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage class assignments for this grade
            </p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('details')}>
            Back to Details
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Classes</CardTitle>
              <CardDescription>Select classes to assign to this grade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} ({cls.studentsCount} students)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddClassToGrade} disabled={!selectedClass}>
                  Add
                </Button>
              </div>
              
              <div className="space-y-2">
                {availableClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{cls.name}</p>
                      <p className="text-sm text-gray-600">{cls.studentsCount} students</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Classes</CardTitle>
              <CardDescription>Classes currently assigned to this grade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assignedClasses.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No classes assigned yet</p>
                ) : (
                  assignedClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div>
                        <p className="font-medium">{cls.name}</p>
                        <p className="text-sm text-gray-600">{cls.studentsCount} students</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveClassFromGrade(cls.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
              
              {assignedClasses.length > 0 && (
                <div className="pt-4 border-t">
                  <Button onClick={handleSaveClassAssignments} className="w-full">
                    Save Assignments
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main list view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Grades</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage academic grades and levels
          </p>
        </div>
        {AccessControl.hasPermission(userRole as any, 'create-grade') && (
          <Button onClick={handleCreateGrade} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Grade
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search grades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
                <SelectItem value="4">Level 4</SelectItem>
                <SelectItem value="5">Level 5</SelectItem>
                <SelectItem value="6">Level 6</SelectItem>
                <SelectItem value="7">Level 7</SelectItem>
                <SelectItem value="8">Level 8</SelectItem>
                <SelectItem value="9">Level 9</SelectItem>
                <SelectItem value="10">Level 10</SelectItem>
                <SelectItem value="11">Level 11</SelectItem>
                <SelectItem value="12">Level 12</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Grades</CardTitle>
          <CardDescription>
            {filteredGrades.length} grade{filteredGrades.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            title="All Grades"
            columns={columns}
            data={filteredGrades}
            onView={handleViewGrade}
            onEdit={AccessControl.hasPermission(userRole as any, 'edit-grade') ? handleEditGrade : undefined}
            onDelete={AccessControl.hasPermission(userRole as any, 'delete-grade') ? handleDeleteGrade : undefined}
            onAdd={AccessControl.hasPermission(userRole as any, 'create-grade') ? handleCreateGrade : undefined}
            searchPlaceholder="Search grades..."
            allowAdd={AccessControl.hasPermission(userRole as any, 'create-grade')}
            allowEdit={AccessControl.hasPermission(userRole as any, 'edit-grade')}
            allowDelete={AccessControl.hasPermission(userRole as any, 'delete-grade')}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Grades;
