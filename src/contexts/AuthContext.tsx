
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
  login: (user: User) => void;
  logout: () => void;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setSelectedInstitute(null);
    setSelectedClass(null);
    setSelectedSubject(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
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
