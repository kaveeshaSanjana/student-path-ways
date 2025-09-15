import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Play, Users, GraduationCap, UserCog, Building, ClipboardCheck, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoData {
  id: string;
  title: string;
  embedUrl: string;
}

interface GuidanceSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  videos: VideoData[];
  color: string;
}

const Guidance = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  // Sample guidance sections - can be dynamically populated
  const guidanceSections: GuidanceSection[] = [
    {
      id: "students",
      title: "Students",
      description: "Learn how to navigate your learning journey",
      icon: <GraduationCap className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      videos: [
        {
          id: "student-1",
          title: "Student Orientation",
          embedUrl: "https://www.youtube.com/embed/8_8swngfRM0?si=GQtvm9EnNkCqm7nw"
        },
        {
          id: "student-2",
          title: "Course Navigation",
          embedUrl: "https://www.youtube.com/embed/8_8swngfRM0?si=GQtvm9EnNkCqm7nw"
        },
        {
          id: "student-3",
          title: "Assignment Submission",
          embedUrl: "https://www.youtube.com/embed/8_8swngfRM0?si=GQtvm9EnNkCqm7nw"
        }
      ]
    },
    {
      id: "parents",
      title: "Parents",
      description: "Stay connected with your child's education",
      icon: <Users className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      videos: [
        {
          id: "parent-1",
          title: "Parent Dashboard",
          embedUrl: "https://www.youtube.com/embed/8_8swngfRM0?si=GQtvm9EnNkCqm7nw"
        },
        {
          id: "parent-2",
          title: "Progress Tracking",
          embedUrl: "https://www.youtube.com/embed/8_8swngfRM0?si=GQtvm9EnNkCqm7nw"
        }
      ]
    },
    {
      id: "teachers",
      title: "Teachers",
      description: "Master the tools for effective teaching",
      icon: <UserCog className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      videos: [
        {
          id: "teacher-1",
          title: "Course Creation",
          embedUrl: "https://www.youtube.com/embed/8_8swngfRM0?si=GQtvm9EnNkCqm7nw"
        },
        {
          id: "teacher-2",
          title: "Student Assessment",
          embedUrl: "https://www.youtube.com/embed/8_8swngfRM0?si=GQtvm9EnNkCqm7nw"
        }
      ]
    },
    {
      id: "institute-admins",
      title: "Institute Admins",
      description: "Manage your institution effectively",
      icon: <Building className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      videos: [
        {
          id: "admin-1",
          title: "System Administration",
          embedUrl: "https://www.youtube.com/embed/8_8swngfRM0?si=GQtvm9EnNkCqm7nw"
        },
        {
          id: "admin-2",
          title: "User Management",
          embedUrl: "https://www.youtube.com/embed/8_8swngfRM0?si=GQtvm9EnNkCqm7nw"
        }
      ]
    },
    {
      id: "attendance-markers",
      title: "Attendance Markers",
      description: "Efficient attendance tracking system",
      icon: <ClipboardCheck className="w-8 h-8" />,
      color: "from-red-500 to-red-600",
      videos: [
        {
          id: "attendance-1",
          title: "Marking Attendance",
          embedUrl: "https://www.youtube.com/embed/8_8swngfRM0?si=GQtvm9EnNkCqm7nw"
        },
        {
          id: "attendance-2",
          title: "Attendance Reports",
          embedUrl: "https://www.youtube.com/embed/8_8swngfRM0?si=GQtvm9EnNkCqm7nw"
        }
      ]
    }
  ];

  const VideoGrid = ({ videos }: { videos: VideoData[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {videos.map((video, index) => (
        <Dialog key={video.id}>
          <DialogTrigger asChild>
            <div 
              className="aspect-video bg-muted rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 relative group shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedVideo(video)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/60 rounded-lg flex items-center justify-center">
                <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg p-3">
                <p className="text-sm font-medium text-white truncate">
                  {video.title}
                </p>
              </div>
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                HD
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{video.title}</DialogTitle>
            </DialogHeader>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={video.embedUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary-light/10 relative overflow-hidden">
      {/* Sri Lankan Flag Accent */}
      <div className="absolute top-4 right-4 w-8 h-6 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-sm opacity-60 z-20 shadow-lg"></div>
      
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transform: `scale(${0.5 + Math.random() * 1.5})`
            }} 
          />
        ))}
      </div>

      {/* Geometric Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-20 left-20 w-32 h-32 border-2 border-primary rounded-full animate-spin" 
          style={{ animationDuration: '20s' }}
        ></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-primary/50 rounded-full animate-pulse"></div>
        <div 
          className="absolute bottom-32 left-40 w-20 h-20 border border-primary rotate-45 animate-bounce" 
          style={{ animationDuration: '3s' }}
        ></div>
        <div 
          className="absolute bottom-20 right-20 w-28 h-28 border-2 border-primary/30 rounded-full animate-ping" 
          style={{ animationDuration: '4s' }}
        ></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/ab90ba4e-121b-4049-b65d-dec211ad12c3.png" 
              alt="SurakshaLMS Logo" 
              className="h-8 w-8" 
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Guidance Center
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-primary hover:text-primary-dark transition-colors duration-300" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button variant="ghost" className="text-primary hover:text-primary-dark transition-colors duration-300" onClick={() => navigate('/student-id')}>
              Student ID
            </Button>
            <Button variant="ghost" className="text-primary hover:text-primary-dark transition-colors duration-300">
              Customers
            </Button>
            <Button variant="ghost" className="text-primary hover:text-primary-dark transition-colors duration-300">
              Pricing
            </Button>
            <Button variant="outline" className="gap-2 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              <MessageCircle className="w-4 h-4" />
              Login to SurakshaLMS
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="outline" size="sm" className="backdrop-blur-sm border-primary/20">
              <Building className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Learn & Master SurakshaLMS
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive video guides for every user type. Click on any video to watch in full screen.
          </p>
        </div>

        {/* Guidance Sections */}
        <div className="space-y-0">
          {guidanceSections.map((section, sectionIndex) => (
            <div key={section.id} className="relative">
              
              {/* Section Divider Line */}
              {sectionIndex > 0 && (
                <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-8"></div>
              )}
              
              <div 
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-12 animate-fade-in"
                style={{ animationDelay: `${sectionIndex * 0.2}s` }}
              >
                {/* Left Side - Character & Info */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="mb-6">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center shadow-2xl mb-4 mx-auto lg:mx-0`}>
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        {section.icon}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold text-primary">{section.title}</h3>
                      <p className="text-muted-foreground text-lg">{section.description}</p>
                    </div>
                  </div>
                  
                  {/* Speech Bubble */}
                  <div className="relative bg-white border-2 border-primary/20 rounded-xl p-4 shadow-lg max-w-xs">
                    <p className="text-sm text-primary font-medium">
                      "Learn how to master {section.title.toLowerCase()} features with our step-by-step videos!"
                    </p>
                    {/* Bubble Tail */}
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-l-2 border-t-2 border-primary/20 transform rotate-45"></div>
                  </div>
                </div>
                
                {/* Right Side - Videos */}
                <div className="lg:col-span-8">
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold text-primary mb-2">Training Videos</h4>
                    <p className="text-muted-foreground">Click any video to watch the full tutorial</p>
                  </div>
                  <VideoGrid videos={section.videos} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--lms-blue))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--lms-blue))" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="evolutionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--evolution-dark))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--evolution-dark))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Lines from top corners to center */}
        <line x1="10%" y1="20%" x2="50%" y2="50%" stroke="url(#blueGradient)" strokeWidth="2" strokeDasharray="5,5">
          <animate attributeName="stroke-dashoffset" values="0;-10" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="90%" y1="20%" x2="50%" y2="50%" stroke="url(#blueGradient)" strokeWidth="2" strokeDasharray="5,5">
          <animate attributeName="stroke-dashoffset" values="0;-10" dur="2s" repeatCount="indefinite" />
        </line>
        
        {/* Lines from center to bottom corners */}
        <line x1="50%" y1="50%" x2="10%" y2="80%" stroke="url(#evolutionGradient)" strokeWidth="2" strokeDasharray="5,5">
          <animate attributeName="stroke-dashoffset" values="0;-10" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="50%" y1="50%" x2="90%" y2="80%" stroke="url(#evolutionGradient)" strokeWidth="2" strokeDasharray="5,5">
          <animate attributeName="stroke-dashoffset" values="0;-10" dur="2s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-30 animate-bounce">
        <Button size="icon" className="w-12 h-12 rounded-full bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl transition-all duration-300">
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Guidance;