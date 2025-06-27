
import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock results data
const mockOnlineResults = [
  {
    id: '1',
    examName: 'Mid Term Mathematics (Online)',
    examDate: '2024-01-20',
    totalMarks: 100,
    obtainedMarks: 85,
    percentage: 85,
    grade: 'A',
    status: 'Published',
    type: 'Online'
  },
  {
    id: '2',
    examName: 'Physics Unit Test (Online)',
    examDate: '2024-01-22',
    totalMarks: 50,
    obtainedMarks: 42,
    percentage: 84,
    grade: 'A',
    status: 'Published',
    type: 'Online'
  }
];

const mockPhysicalResults = [
  {
    id: '3',
    examName: 'Chemistry Practical (Physical)',
    examDate: '2024-01-25',
    totalMarks: 30,
    obtainedMarks: 25,
    percentage: 83,
    grade: 'A',
    status: 'Published',
    type: 'Physical'
  },
  {
    id: '4',
    examName: 'Biology Lab Test (Physical)',
    examDate: '2024-01-28',
    totalMarks: 40,
    obtainedMarks: 0,
    percentage: 0,
    grade: 'Pending',
    status: 'Pending',
    type: 'Physical'
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
  const [onlineResultsData, setOnlineResultsData] = useState<any[]>([]);
  const [physicalResultsData, setPhysicalResultsData] = useState<any[]>([]);
  const [isOnlineLoading, setIsOnlineLoading] = useState(false);
  const [isPhysicalLoading, setIsPhysicalLoading] = useState(false);
  const [onlineDataLoaded, setOnlineDataLoaded] = useState(false);
  const [physicalDataLoaded, setPhysicalDataLoaded] = useState(false);

  const handleLoadOnlineData = async () => {
    setIsOnlineLoading(true);
    console.log('Loading online results data...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOnlineResultsData(mockOnlineResults);
      setOnlineDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${mockOnlineResults.length} online results.`
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load online results data.",
        variant: "destructive"
      });
    } finally {
      setIsOnlineLoading(false);
    }
  };

  const handleLoadPhysicalData = async () => {
    setIsPhysicalLoading(true);
    console.log('Loading physical results data...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPhysicalResultsData(mockPhysicalResults);
      setPhysicalDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${mockPhysicalResults.length} physical results.`
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load physical results data.",
        variant: "destructive"
      });
    } finally {
      setIsPhysicalLoading(false);
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

  const ResultsTab = ({ 
    dataLoaded, 
    isLoading, 
    onLoadData, 
    data, 
    title, 
    loadingText 
  }: {
    dataLoaded: boolean;
    isLoading: boolean;
    onLoadData: () => void;
    data: any[];
    title: string;
    loadingText: string;
  }) => {
    if (!dataLoaded) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title} Results
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load {title.toLowerCase()} results data
          </p>
          <Button 
            onClick={onLoadData} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {loadingText}
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Load Data
              </>
            )}
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <Button 
            onClick={onLoadData} 
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
          title={`${title} Results`}
          data={data}
          columns={resultsColumns}
          onAdd={handleAddResult}
          onEdit={handleEditResult}
          onDelete={handleDeleteResult}
          searchPlaceholder={`Search ${title.toLowerCase()} results...`}
        />
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Exam Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage online and physical exam results
        </p>
      </div>

      <Tabs defaultValue="online" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="online">Online Results</TabsTrigger>
          <TabsTrigger value="physical">Physical Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="online" className="space-y-4">
          <ResultsTab
            dataLoaded={onlineDataLoaded}
            isLoading={isOnlineLoading}
            onLoadData={handleLoadOnlineData}
            data={onlineResultsData}
            title="Online"
            loadingText="Loading Online Data..."
          />
        </TabsContent>
        
        <TabsContent value="physical" className="space-y-4">
          <ResultsTab
            dataLoaded={physicalDataLoaded}
            isLoading={isPhysicalLoading}
            onLoadData={handleLoadPhysicalData}
            data={physicalResultsData}
            title="Physical"
            loadingText="Loading Physical Data..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results;
