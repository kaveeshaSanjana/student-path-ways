
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { Eye, EyeOff, GraduationCap, Wifi, WifiOff, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock user credentials for different roles
const mockUsers = [
  {
    email: 'admin@system.com',
    password: 'admin123',
    role: 'SystemAdmin' as UserRole,
    name: 'System Administrator',
    institutes: [
      { id: '1', name: 'Cambridge International School', code: 'CIS001', description: 'Premier educational institution', isActive: true },
      { id: '2', name: 'Oxford Academy', code: 'OXF002', description: 'Excellence in education', isActive: true },
      { id: '3', name: 'Harvard Institute', code: 'HAR003', description: 'Advanced learning center', isActive: true }
    ]
  },
  {
    email: 'institute@cambridge.edu',
    password: 'institute123',
    role: 'InstituteAdmin' as UserRole,
    name: 'Cambridge Admin',
    institutes: [
      { id: '1', name: 'Cambridge International School', code: 'CIS001', description: 'Premier educational institution', isActive: true }
    ]
  },
  {
    email: 'teacher@cambridge.edu',
    password: 'teacher123',
    role: 'Teacher' as UserRole,
    name: 'John Smith',
    institutes: [
      { id: '1', name: 'Cambridge International School', code: 'CIS001', description: 'Premier educational institution', isActive: true },
      { id: '2', name: 'Oxford Academy', code: 'OXF002', description: 'Excellence in education', isActive: true }
    ]
  },
  {
    email: 'marker@cambridge.edu',
    password: 'marker123',
    role: 'AttendanceMarker' as UserRole,
    name: 'Alice Johnson',
    institutes: [
      { id: '1', name: 'Cambridge International School', code: 'CIS001', description: 'Premier educational institution', isActive: true },
      { id: '2', name: 'Oxford Academy', code: 'OXF002', description: 'Excellence in education', isActive: true }
    ]
  },
  {
    email: 'student@cambridge.edu',
    password: 'student123',
    role: 'Student' as UserRole,
    name: 'Emma Wilson',
    institutes: [
      { id: '1', name: 'Cambridge International School', code: 'CIS001', description: 'Premier educational institution', isActive: true },
      { id: '2', name: 'Oxford Academy', code: 'OXF002', description: 'Excellence in education', isActive: true }
    ]
  }
];

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [baseUrl, setBaseUrl] = useState('http://localhost:3000');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');
  const [showPassword, setShowPassword] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useApiLogin, setUseApiLogin] = useState(true);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleQuickLogin = (role: UserRole) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
      setSelectedRole(role);
    }
  };

  // Updated user type mapping to handle backend enum
  const mapUserTypeToRole = (userType: string): UserRole => {
    const typeMapping: Record<string, UserRole> = {
      'STUDENT': 'Student',
      'TEACHER': 'Teacher',
      'SUPER_ADMIN': 'SystemAdmin',
      'SUPERADMIN': 'SystemAdmin',
      'INSTITUTE_ADMIN': 'InstituteAdmin',
      'ATTEDANCE_MARKER': 'AttendanceMarker',
      'ATTENDANCE_MARKER': 'AttendanceMarker',
      'PARENT': 'Student' // Map parent to student for now
    };
    return typeMapping[userType.toUpperCase()] || 'Student';
  };

  const fetchUserInstitutes = async (userId: string, accessToken: string) => {
    try {
      console.log(`Fetching institutes for user ${userId}...`);
      const response = await fetch(`${baseUrl}/users/${userId}/institutes`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const institutes = await response.json();
          console.log('Fetched institutes:', institutes);
          return Array.isArray(institutes) ? institutes : [];
        } else {
          console.error('Non-JSON response for institutes:', await response.text());
        }
      } else {
        console.error('Failed to fetch institutes:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user institutes:', error);
    }
    return [];
  };

  const handleMockLogin = async (email: string, password: string, role: UserRole) => {
    // Even for mock login, we should try to validate against the backend first
    try {
      console.log(`Attempting backend validation for mock login to ${baseUrl}/auth/login`);
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const institutes = await fetchUserInstitutes(data.user.id, data.access_token);
        
        return {
          id: data.user.id,
          name: `${data.user.firstName} ${data.user.lastName}`,
          email: data.user.email,
          role: mapUserTypeToRole(data.user.userType),
          institutes: institutes,
          accessToken: data.access_token
        };
      }
    } catch (error) {
      console.log('Backend validation failed, using mock data...');
    }

    // Fallback to mock data if backend is not available
    const user = mockUsers.find(
      u => u.email === email && u.password === password && u.role === role
    );

    if (!user) {
      throw new Error('Invalid credentials or role mismatch');
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: user.name,
      email: user.email,
      role: user.role,
      institutes: user.institutes
    };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Store base URL in localStorage for other components to use
    localStorage.setItem('baseUrl', baseUrl);

    try {
      if (useApiLogin) {
        // Use AuthContext login for API login
        await login({ email, password });
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        // Handle mock login
        const user = await handleMockLogin(email, password, selectedRole);
        toast({
          title: "Success",
          description: `Logged in successfully as ${user.role}`,
        });
        
        console.log('User logged in:', user);
        console.log('User role:', user.role);
        onLogin(user);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      toast({
        title: "Error",
        description: "Login failed. Please check your credentials and backend connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">EduManage</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Institute Learning Management System</p>
        </div>

        {/* Base URL Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Backend Configuration
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="ml-auto"
              >
                {showSettings ? 'Hide' : 'Show'}
              </Button>
            </CardTitle>
          </CardHeader>
          {showSettings && (
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="baseUrl">Backend URL</Label>
                <Input
                  id="baseUrl"
                  type="url"
                  placeholder="Enter backend URL"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Current: {baseUrl}
                </p>
                <p className="text-xs text-orange-600">
                  For ngrok: Add --host-header=localhost:3000 flag when starting tunnel
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Login Mode Toggle */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              Login Mode
              {useApiLogin ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-gray-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={useApiLogin ? "default" : "outline"}
                size="sm"
                onClick={() => setUseApiLogin(true)}
                className="flex-1"
              >
                API Login
              </Button>
              <Button
                type="button"
                variant={!useApiLogin ? "default" : "outline"}
                size="sm"
                onClick={() => setUseApiLogin(false)}
                className="flex-1"
              >
                Mock Login
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {useApiLogin ? "Login via backend API" : "Login with demo credentials (validates with backend first)"}
            </p>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              {useApiLogin ? "Enter your API credentials" : "Choose your role and enter demo credentials"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Selection - Only show for mock login */}
              {!useApiLogin && (
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SystemAdmin">System Administrator</SelectItem>
                      <SelectItem value="InstituteAdmin">Institute Administrator</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="AttendanceMarker">Attendance Marker</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Login Options - Only show for mock login */}
        {!useApiLogin && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Login (Demo)</CardTitle>
              <CardDescription className="text-xs">Click to auto-fill credentials for testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin('SystemAdmin')}
                  className="text-xs"
                >
                  System Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin('InstituteAdmin')}
                  className="text-xs"
                >
                  Institute Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin('Teacher')}
                  className="text-xs"
                >
                  Teacher
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin('AttendanceMarker')}
                  className="text-xs"
                >
                  Att. Marker
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin('Student')}
                  className="text-xs col-span-2"
                >
                  Student
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Demo Credentials */}
        {useApiLogin && (
          <Card className="text-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">API Demo Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-600 dark:text-gray-400">
              <div><strong>Example:</strong> 123@gmail.com / password123</div>
            </CardContent>
          </Card>
        )}

        {/* Demo Credentials - Only show for mock login */}
        {!useApiLogin && (
          <Card className="text-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Demo Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-600 dark:text-gray-400">
              <div><strong>System Admin:</strong> admin@system.com / admin123</div>
              <div><strong>Institute Admin:</strong> institute@cambridge.edu / institute123</div>
              <div><strong>Teacher:</strong> teacher@cambridge.edu / teacher123</div>
              <div><strong>Attendance Marker:</strong> marker@cambridge.edu / marker123</div>
              <div><strong>Student:</strong> student@cambridge.edu / student123</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Login;
