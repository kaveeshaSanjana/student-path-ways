
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Edit, CheckSquare, Calendar, Users } from 'lucide-react';
import DataTable from '@/components/ui/data-table';

// Mock attendance data
const mockStudents = [
  { id: '1', name: 'John Doe', rollNumber: 'S001', status: 'Present' },
  { id: '2', name: 'Jane Smith', rollNumber: 'S002', status: 'Absent' },
  { id: '3', name: 'Mike Johnson', rollNumber: 'S003', status: 'Present' },
  { id: '4', name: 'Sarah Wilson', rollNumber: 'S004', status: 'Present' },
];

const attendanceColumns = [
  { key: 'rollNumber', header: 'Roll Number' },
  { key: 'name', header: 'Student Name' },
  { 
    key: 'status', 
    header: 'Status',
    render: (value: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    )
  }
];

const AttendanceMarking = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    console.log(`Selected attendance method: ${method}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mark Attendance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose your preferred method to mark student attendance
        </p>
      </div>

      {/* Attendance Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card 
          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
          onClick={() => handleMethodSelect('qr')}
        >
          <CardHeader className="text-center">
            <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <CardTitle>QR Code</CardTitle>
            <CardDescription>Students scan QR code to mark attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
          onClick={() => handleMethodSelect('manual')}
        >
          <CardHeader className="text-center">
            <Edit className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <CardTitle>Manual Entry</CardTitle>
            <CardDescription>Manually enter attendance for each student</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Start Manual Entry
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
          onClick={() => handleMethodSelect('tick')}
        >
          <CardHeader className="text-center">
            <CheckSquare className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <CardTitle>Quick Mark</CardTitle>
            <CardDescription>Tick boxes for present students (class level only)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Quick Mark
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Tabs defaultValue="online" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="online">Online Attendance</TabsTrigger>
          <TabsTrigger value="physical">Physical Attendance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="online" className="space-y-4">
          <DataTable
            title="Online Attendance Records"
            data={mockStudents}
            columns={attendanceColumns}
            searchPlaceholder="Search students..."
            allowAdd={false}
            allowEdit={true}
            allowDelete={false}
          />
        </TabsContent>
        
        <TabsContent value="physical" className="space-y-4">
          <DataTable
            title="Physical Attendance Records"
            data={mockStudents}
            columns={attendanceColumns}
            searchPlaceholder="Search students..."
            allowAdd={false}
            allowEdit={true}
            allowDelete={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceMarking;
