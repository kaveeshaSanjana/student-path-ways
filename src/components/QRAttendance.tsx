
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Camera, QrCode, UserCheck, CheckCircle } from 'lucide-react';

const QRAttendance = () => {
  const { selectedClass, setSelectedClass } = useAuth();
  const [studentId, setStudentId] = useState('');
  const [markedCount, setMarkedCount] = useState(0);
  const [selectedClassForSession, setSelectedClassForSession] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock classes data
  const mockClasses = [
    { id: '1', name: 'Grade 10-A', studentsCount: 35 },
    { id: '2', name: 'Grade 11-B', studentsCount: 28 },
    { id: '3', name: 'Grade 12-C', studentsCount: 22 }
  ];

  const handleBack = () => {
    window.history.back();
  };

  const handleClassSelect = (classId: string) => {
    const selected = mockClasses.find(c => c.id === classId);
    setSelectedClassForSession(selected);
  };

  const handleStudentIdChange = (value: string) => {
    setStudentId(value);
    // Auto-submit when student ID is entered
    if (value.trim()) {
      setTimeout(() => {
        handleMarkAttendance();
      }, 500);
    }
  };

  const handleMarkAttendance = () => {
    if (studentId.trim() && selectedClassForSession) {
      setMarkedCount(prev => prev + 1);
      console.log(`Marked attendance for student ID: ${studentId}`);
      setStudentId('');
      // Focus back to input for continuous scanning
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleStartScanning = () => {
    setIsScanning(true);
    // Focus on input for QR code scanning
    inputRef.current?.focus();
  };

  const handleStopScanning = () => {
    setIsScanning(false);
  };

  // Simulate QR code scanning
  const simulateQRScan = () => {
    const randomId = `STU${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    setStudentId(randomId);
    handleStudentIdChange(randomId);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            QR Code Attendance
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Scan QR codes to mark student attendance
          </p>
        </div>
      </div>

      {/* Class Selection */}
      {!selectedClassForSession && (
        <Card>
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
            <CardDescription>Choose a class to start marking attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleClassSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {mockClasses.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name} ({classItem.studentsCount} students)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Attendance Marking Interface */}
      {selectedClassForSession && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-600" />
                QR Code Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera View Placeholder */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                {isScanning ? (
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Camera Active</p>
                    <p className="text-sm text-gray-500">Point camera at QR code</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Camera Off</p>
                  </div>
                )}
              </div>

              {/* Scanner Controls */}
              <div className="flex gap-2">
                {!isScanning ? (
                  <Button onClick={handleStartScanning} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Scanning
                  </Button>
                ) : (
                  <Button onClick={handleStopScanning} variant="outline" className="flex-1">
                    Stop Scanning
                  </Button>
                )}
                <Button onClick={simulateQRScan} variant="outline">
                  Simulate Scan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                Manual Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Student ID Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student ID
                </label>
                <Input
                  ref={inputRef}
                  value={studentId}
                  onChange={(e) => handleStudentIdChange(e.target.value)}
                  placeholder="Enter or scan student ID"
                  className="text-lg"
                  autoFocus
                />
              </div>

              {/* Mark Button */}
              <Button 
                onClick={handleMarkAttendance} 
                disabled={!studentId.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>

              {/* Class Info */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">Current Class</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {selectedClassForSession.name}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Total Students: {selectedClassForSession.studentsCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Message */}
      {selectedClassForSession && markedCount > 0 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">
                {markedCount} student{markedCount > 1 ? 's' : ''} attendance has been marked
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {selectedClassForSession && (
        <Card>
          <CardHeader>
            <CardTitle>Session Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{markedCount}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Marked Present</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">
                  {selectedClassForSession.studentsCount - markedCount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((markedCount / selectedClassForSession.studentsCount) * 100)}%
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">Attendance Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRAttendance;
