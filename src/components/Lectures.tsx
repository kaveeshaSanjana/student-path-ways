
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

// Mock lecture data
const mockLectures = [
  {
    id: '1',
    title: 'Introduction to Calculus',
    date: '2024-01-15',
    time: '09:00 AM',
    duration: '60 min',
    type: 'Online',
    status: 'Completed',
    attendanceCount: 28
  },
  {
    id: '2',
    title: 'Algebraic Equations',
    date: '2024-01-16',
    time: '10:00 AM',
    duration: '45 min',
    type: 'Physical',
    status: 'Scheduled',
    attendanceCount: 0
  },
  {
    id: '3',
    title: 'Geometry Basics',
    date: '2024-01-17',
    time: '11:00 AM',
    duration: '50 min',
    type: 'Online',
    status: 'In Progress',
    attendanceCount: 25
  }
];

const lectureColumns = [
  { key: 'title', header: 'Lecture Title' },
  { key: 'date', header: 'Date' },
  { key: 'time', header: 'Time' },
  { key: 'duration', header: 'Duration' },
  { 
    key: 'type', 
    header: 'Type',
    render: (value: string) => (
      <Badge variant={value === 'Online' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    )
  },
  { 
    key: 'status', 
    header: 'Status',
    render: (value: string) => {
      const statusColors = {
        'Completed': 'bg-green-100 text-green-800',
        'Scheduled': 'bg-blue-100 text-blue-800',
        'In Progress': 'bg-yellow-100 text-yellow-800'
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}`}>
          {value}
        </span>
      );
    }
  },
  { key: 'attendanceCount', header: 'Attendance' }
];

const Lectures = () => {
  const handleAddLecture = () => {
    console.log('Add new lecture');
  };

  const handleEditLecture = (lecture: any) => {
    console.log('Edit lecture:', lecture);
  };

  const handleDeleteLecture = (lecture: any) => {
    console.log('Delete lecture:', lecture);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Lectures Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage online and physical lectures with attendance tracking
        </p>
      </div>

      <Tabs defaultValue="online" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="online">Online Lectures</TabsTrigger>
          <TabsTrigger value="physical">Physical Lectures</TabsTrigger>
        </TabsList>
        
        <TabsContent value="online" className="space-y-4">
          <DataTable
            title="Online Lectures"
            data={mockLectures.filter(lecture => lecture.type === 'Online')}
            columns={lectureColumns}
            onAdd={handleAddLecture}
            onEdit={handleEditLecture}
            onDelete={handleDeleteLecture}
            searchPlaceholder="Search lectures..."
          />
        </TabsContent>
        
        <TabsContent value="physical" className="space-y-4">
          <DataTable
            title="Physical Lectures"
            data={mockLectures.filter(lecture => lecture.type === 'Physical')}
            columns={lectureColumns}
            onAdd={handleAddLecture}
            onEdit={handleEditLecture}
            onDelete={handleDeleteLecture}
            searchPlaceholder="Search lectures..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Lectures;
