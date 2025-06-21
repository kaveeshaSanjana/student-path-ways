
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Building, Users, CheckCircle } from 'lucide-react';

const InstituteSelector = () => {
  const { user, setSelectedInstitute } = useAuth();

  const handleSelectInstitute = (institute: any) => {
    setSelectedInstitute(institute);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Select Institute
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose an institute to continue to your dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.institutes.map((institute) => (
          <Card 
            key={institute.id} 
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
            onClick={() => handleSelectInstitute(institute)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Building className="h-8 w-8 text-blue-600" />
                {institute.isActive && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{institute.name}</CardTitle>
              <CardDescription>
                Code: {institute.code}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {institute.description}
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Users className="h-4 w-4 mr-2" />
                <span>Role: {user?.role}</span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Select Institute
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstituteSelector;
