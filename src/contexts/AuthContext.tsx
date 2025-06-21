
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'SystemAdmin' | 'InstituteAdmin' | 'AttendanceMarker' | 'Teacher' | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutes: Institute[];
}

export interface Institute {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  selectedInstitute: Institute | null;
  setSelectedInstitute: (institute: Institute | null) => void;
  selectedClass: any | null;
  setSelectedClass: (classData: any) => void;
  selectedSubject: any | null;
  setSelectedSubject: (subject: any) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Teacher',
  institutes: [
    {
      id: '1',
      name: 'Cambridge International School',
      code: 'CIS001',
      description: 'Premier educational institution',
      isActive: true
    },
    {
      id: '2',
      name: 'Oxford Academy',
      code: 'OXF002',
      description: 'Excellence in education',
      isActive: true
    }
  ]
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<User>(mockUser);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <AuthContext.Provider value={{
      user,
      selectedInstitute,
      setSelectedInstitute,
      selectedClass,
      setSelectedClass,
      selectedSubject,
      setSelectedSubject,
      isDarkMode,
      toggleDarkMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
