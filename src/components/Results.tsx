
import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock results data
const mockResults = [
  {
    id: '1',
    examName: 'Mid Term Mathematics',
    examDate: '2024-01-20',
    totalMarks: 100,
    obtainedMarks: 85,
    percentage: 85,
    grade: 'A',
    status: 'Published'
  },
  {
    id: '2',
    examName: 'Physics Unit Test',
    examDate: '2024-01-22',
    totalMarks: 50,
    obtainedMarks: 42,
    percentage: 84,
    grade: 'A',
    status: 'Published'
  },
  {
    id: '3',
    examName: 'Chemistry Practical',
    examDate: '2024-01-25',
    totalMarks: 30,
    obtainedMarks: 0,
    percentage: 0,
    grade: 'Pending',
    status: 'Pending'
  }
];

const resultsColumns = [
  { key: 'examName', header: 'Exam Name' },
  { key: 'examDate', header: 'Date' },
  { key: 'totalMarks', header: 'Total Marks' },
  { key: 'obtainedMarks', header: 'Obtained Marks' },
  { 
    key: 'percentage', 
    header: 'Percentage',
    render: (value: number) => `${value}%`
  },
  { 
    key: 'grade', 
    header: 'Grade',
    render: (value: string) => {
      const gradeColors = {
        'A': 'bg-green-100 text-green-800',
        'B': 'bg-blue-100 text-blue-800',
        'C': 'bg-yellow-100 text-yellow-800',
        'D': 'bg-orange-100 text-orange-800',
        'F': 'bg-red-100 text-red-800',
        'Pending': 'bg-gray-100 text-gray-800'
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors[value as keyof typeof gradeColors]}`}>
          {value}
        </span>
      );
    }
  },
  { 
    key: 'status', 
    header: 'Status',
    render: (value: string) => (
      <Badge variant={value === 'Published' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    )
  }
];

const Results = () => {
  const { toast } = useToast();
  const [resultsData, setResultsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log('Loading results data...');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResultsData(mockResults);
      setDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${mockResults.length} results.`
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load results data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResult = () => {
    console.log('Add new result');
  };

  const handleEditResult = (result: any) => {
    console.log('Edit result:', result);
  };

  const handleDeleteResult = (result: any) => {
    console.log('Delete result:', result);
  };

  return (
    <div className="space-y-6">
      {!dataLoaded ? (
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Exam Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load exam results data
          </p>
          <Button 
            onClick={handleLoadData} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading Data...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Load Data
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Exam Results
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage exam results and grades
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div></div>
            <Button 
              onClick={handleLoadData} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </>
              )}
            </Button>
          </div>

          <DataTable
            title="Exam Results"
            data={resultsData}
            columns={resultsColumns}
            onAdd={handleAddResult}
            onEdit={handleEditResult}
            onDelete={handleDeleteResult}
            searchPlaceholder="Search results..."
          />
        </>
      )}
    </div>
  );
};

export default Results;
