import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  QrCode, 
  Users, 
  CheckCircle, 
  Calendar,
  Clock,
  UserCheck,
  Camera,
  Edit3
} from 'lucide-react';

interface AttendanceMarkingProps {
  onNavigate?: (page: string) => void;
}

const AttendanceMarking = ({ onNavigate }: AttendanceMarkingProps) => {
  const { selectedClass, selectedSubject } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const attendanceMethods = [
    {
      id: 'qr',
      title: 'QR Code Attendance',
      description: 'Generate QR code for students to scan and mark attendance',
      icon: QrCode,
      color: 'blue',
      availability: 'Available for all classes',
      features: ['Quick scanning', 'Automatic recording', 'Real-time updates'],
      page: 'qr-attendance'
    },
    {
      id: 'manual',
      title: 'Manual Attendance',
      description: 'Manually mark attendance for each student',
      icon: Edit3,
      color: 'green',
      availability: 'Available for all classes',
      features: ['Individual control', 'Detailed notes', 'Flexible marking']
    },
    {
      id: 'tick',
      title: 'Tick Mark Attendance',
      description: 'Simple tick-based attendance marking system',
      icon: CheckCircle,
      color: 'purple',
      availability: selectedClass ? 'Available' : 'Select class first',
      features: ['Simple interface', 'Quick marking', 'Class-level only'],
      disabled: !selectedClass
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    const method = attendanceMethods.find(m => m.id === methodId);
    
    if (method?.page && onNavigate) {
      onNavigate(method.page);
    } else {
      console.log('Selected attendance method:', methodId);
    }
  };

  const recentSessions = [
    {
      id: '1',
      subject: 'Mathematics',
      class: 'Grade 10-A',
      date: '2024-01-15',
      time: '09:00 AM',
      present: 25,
      total: 28,
      status: 'Completed'
    },
    {
      id: '2',
      subject: 'Physics',
      class: 'Grade 11-S',
      date: '2024-01-15',
      time: '11:00 AM',
      present: 20,
      total: 23,
      status: 'In Progress'
    }
  ];

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

      {/* Current Session Info */}
      {selectedClass && selectedSubject && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Calendar className="h-5 w-5" />
              Current Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Class</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">{selectedClass.name}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Subject</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">{selectedSubject.name}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Time</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {attendanceMethods.map((method) => (
          <Card 
            key={method.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              method.disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : selectedMethod === method.id 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:border-blue-300'
            }`}
            onClick={() => !method.disabled && handleMethodSelect(method.id)}
          >
            <CardHeader className="text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                method.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                method.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                'bg-purple-100 dark:bg-purple-900/30'
              }`}>
                <method.icon className={`h-8 w-8 ${
                  method.color === 'blue' ? 'text-blue-600' :
                  method.color === 'green' ? 'text-green-600' :
                  'text-purple-600'
                }`} />
              </div>
              <CardTitle className="text-xl">{method.title}</CardTitle>
              <CardDescription className="text-center">
                {method.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge 
                  variant={method.disabled ? 'secondary' : 'outline'}
                  className={method.disabled ? '' : `border-${method.color}-200 text-${method.color}-700`}
                >
                  {method.availability}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Features:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {method.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className={`w-full ${
                  method.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                  method.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-purple-600 hover:bg-purple-700'
                }`}
                disabled={method.disabled}
              >
                {method.disabled ? 'Not Available' : 'Start Marking'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Recent Attendance Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.subject} - {session.class}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {session.date} at {session.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.present}/{session.total}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round((session.present / session.total) * 100)}% Present
                    </p>
                  </div>
                  <Badge variant={session.status === 'Completed' ? 'default' : 'secondary'}>
                    {session.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceMarking;
