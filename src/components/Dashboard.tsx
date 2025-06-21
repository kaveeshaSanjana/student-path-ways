
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  TrendingUp,
  BookOpen,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { user, selectedInstitute } = useAuth();

  const statsCards = [
    {
      title: "Total Students",
      value: "1,248",
      description: "Active students",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Classes",
      value: "32",
      description: "Active classes",
      icon: GraduationCap,
      color: "text-green-600"
    },
    {
      title: "Attendance",
      value: "94.5%",
      description: "This month",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Performance",
      value: "87.2%",
      description: "Average score",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  const recentActivities = [
    {
      title: "Mathematics Class",
      description: "Attendance marked for Grade 10A",
      time: "2 hours ago",
      icon: BookOpen
    },
    {
      title: "Physics Exam",
      description: "Results published for Grade 11B",
      time: "4 hours ago",
      icon: GraduationCap
    },
    {
      title: "English Literature",
      description: "New assignment posted",
      time: "6 hours ago",
      icon: BookOpen
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          {selectedInstitute ? `${selectedInstitute.name} Dashboard` : 'System Dashboard'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest updates from your institute
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <activity.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for {user?.role}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                <p className="text-sm font-medium">Mark Attendance</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <BookOpen className="h-6 w-6 text-green-600 mb-2" />
                <p className="text-sm font-medium">View Classes</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <Users className="h-6 w-6 text-purple-600 mb-2" />
                <p className="text-sm font-medium">Student List</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <TrendingUp className="h-6 w-6 text-orange-600 mb-2" />
                <p className="text-sm font-medium">View Results</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
