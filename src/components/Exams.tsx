import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink, Play } from 'lucide-react';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const mockExams = [
  {
    id: '1',
    title: 'Mid Term Mathematics',
    subject: 'Mathematics',
    class: 'Grade 10 - A',
    date: '2024-02-15',
    duration: '2 hours',
    totalMarks: 100,
    status: 'Scheduled',
    type: 'Online',
    formUrl: 'https://forms.google.com/exam-math-midterm'
  },
  {
    id: '2',
    title: 'Physics Unit Test',
    subject: 'Physics',
    class: 'Grade 11 - Science',
    date: '2024-02-18',
    duration: '1.5 hours',
    totalMarks: 75,
    status: 'Active',
    type: 'Online',
    formUrl: 'https://forms.google.com/exam-physics-unit'
  },
  {
    id: '3',
    title: 'Chemistry Practical',
    subject: 'Chemistry',
    class: 'Grade 11 - Science',
    date: '2024-02-20',
    duration: '3 hours',
    totalMarks: 50,
    status: 'Completed',
    type: 'Physical',
    formUrl: null
  }
];

const Exams = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [examsData, setExamsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [examFormUrl, setExamFormUrl] = useState('');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  const handleLoadData = async () => {
    setIsLoading(true);
    console.log('Loading exams data...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setExamsData(mockExams);
      setDataLoaded(true);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${mockExams.length} exams.`
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load exams data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExam = (exam: any) => {
    if (exam.type === 'Online' && exam.formUrl) {
      setExamFormUrl(exam.formUrl);
      setIsFormDialogOpen(true);
      console.log('Starting online exam:', exam.title);
    } else {
      toast({
        title: "Physical Exam",
        description: "This is a physical exam. Please attend the scheduled session.",
      });
    }
  };

  const examsColumns = [
    { key: 'title', header: 'Exam Title' },
    { key: 'subject', header: 'Subject' },
    { key: 'class', header: 'Class' },
    { key: 'date', header: 'Date' },
    { key: 'duration', header: 'Duration' },
    { key: 'totalMarks', header: 'Total Marks' },
    { 
      key: 'type', 
      header: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'Online' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Scheduled': 'bg-blue-100 text-blue-800',
          'Active': 'bg-green-100 text-green-800',
          'Completed': 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    }
  ];

  const customActions = [
    {
      label: 'Start Exam',
      action: handleStartExam,
      icon: <Play className="h-3 w-3" />,
      variant: 'default' as const,
      condition: (exam: any) => exam.status === 'Active'
    }
  ];

  const userRole = (user?.role || 'Student') as UserRole;
  const canAdd = AccessControl.hasPermission(userRole, 'create-exam');
  const canEdit = AccessControl.hasPermission(userRole, 'edit-exam');
  const canDelete = AccessControl.hasPermission(userRole, 'delete-exam');

  return (
    <div className="space-y-6">
      {!dataLoaded ? (
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Exams Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load exams data
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
              Exams Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage online and physical exams
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
            title="Exams"
            data={examsData}
            columns={examsColumns}
            onAdd={canAdd ? () => console.log('Add exam') : undefined}
            onEdit={canEdit ? (exam) => console.log('Edit exam:', exam) : undefined}
            onDelete={canDelete ? (exam) => console.log('Delete exam:', exam) : undefined}
            customActions={customActions}
            searchPlaceholder="Search exams..."
          />
        </>
      )}

      {/* Google Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Online Exam
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(examFormUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="h-[70vh]">
            <iframe
              src={examFormUrl}
              className="w-full h-full border-0 rounded-lg"
              title="Online Exam"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exams;
