import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  dateOfBirth: string;
  gender: string;
  nic: string;
  birthCertificateNo: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  role: string;
}

interface Institute {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

interface Class {
  id: string;
  name: string;
  code: string;
  description: string;
  grade: number;
  specialty: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
}

interface LoginCredentials {
  email: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  selectedInstitute: Institute | null;
  selectedClass: Class | null;
  selectedSubject: Subject | null;
  currentInstituteId: string | null;
  currentClassId: string | null;
  currentSubjectId: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setSelectedInstitute: (institute: Institute | null) => void;
  setSelectedClass: (classData: Class | null) => void;
  setSelectedSubject: (subject: Subject | null) => void;
  isLoading: boolean;
}

interface ApiResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedInstitute, setSelectedInstituteState] = useState<Institute | null>(null);
  const [selectedClass, setSelectedClassState] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubjectState] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Public variables for current IDs
  const [currentInstituteId, setCurrentInstituteId] = useState<string | null>(null);
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);
  const [currentSubjectId, setCurrentSubjectId] = useState<string | null>(null);

  const getBaseUrl = () => {
    return localStorage.getItem('baseUrl') || 'http://localhost:3000';
  };

  const getApiHeaders = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return {};
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    };
  };

  const mapUserData = (apiUser: any): User => ({
    id: apiUser.id,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    phone: apiUser.phone,
    userType: apiUser.userType,
    dateOfBirth: apiUser.dateOfBirth,
    gender: apiUser.gender,
    nic: apiUser.nic,
    birthCertificateNo: apiUser.birthCertificateNo,
    addressLine1: apiUser.addressLine1,
    addressLine2: apiUser.addressLine2,
    city: apiUser.city,
    district: apiUser.district,
    province: apiUser.province,
    postalCode: apiUser.postalCode,
    country: apiUser.country,
    isActive: apiUser.isActive,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
    imageUrl: apiUser.imageUrl,
    role: apiUser.role
  });

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        console.error('Login failed:', response.status, response.statusText);
        throw new Error(`Login failed with status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.log('Login successful:', data);

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      const mappedUser = mapUserData(data.user);
      setUser(mappedUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setSelectedInstituteState(null);
    setSelectedClassState(null);
    setSelectedSubjectState(null);
    setCurrentInstituteId(null);
    setCurrentClassId(null);
    setCurrentSubjectId(null);
  };

  const setSelectedInstitute = (institute: Institute | null) => {
    setSelectedInstituteState(institute);
    setCurrentInstituteId(institute?.id || null);
    
    // Clear class and subject when institute changes
    setSelectedClassState(null);
    setSelectedSubjectState(null);
    setCurrentClassId(null);
    setCurrentSubjectId(null);
  };

  const setSelectedClass = (classData: Class | null) => {
    setSelectedClassState(classData);
    setCurrentClassId(classData?.id || null);
    
    // Clear subject when class changes
    setSelectedSubjectState(null);
    setCurrentSubjectId(null);
  };

  const setSelectedSubject = (subject: Subject | null) => {
    setSelectedSubjectState(subject);
    setCurrentSubjectId(subject?.id || null);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const baseUrl = getBaseUrl();
          const response = await fetch(`${baseUrl}/auth/me`, {
            method: 'GET',
            headers: getApiHeaders(),
          });

          if (response.ok) {
            const data = await response.json();
            const mappedUser = mapUserData(data);
            setUser(mappedUser);
          } else {
            console.error('Failed to validate token:', response.status);
            // Optionally clear the invalid token
            logout();
          }
        } catch (error) {
          console.error('Error validating token:', error);
          // Handle error appropriately
        }
      }
    };

    checkToken();
  }, []);

  const value = {
    user,
    selectedInstitute,
    selectedClass,
    selectedSubject,
    currentInstituteId,
    currentClassId,
    currentSubjectId,
    login,
    logout,
    setSelectedInstitute,
    setSelectedClass,
    setSelectedSubject,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
