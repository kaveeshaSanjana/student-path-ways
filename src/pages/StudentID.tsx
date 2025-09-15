import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Eye, Edit, Share2, IdCard, Calendar, User, MapPin, Phone, Mail, GraduationCap, Shield, Zap, Globe, Building, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const StudentID = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    
    // Trigger animations on load
    setTimeout(() => setIsVisible(true), 300);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle page navigation with touch support
  const nextPage = () => {
    if (currentPage < studentPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Touch handlers for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextPage();
    if (isRightSwipe) prevPage();
  };

  // Anchors for precise card alignment
  const heroAnchorRef = useRef<HTMLDivElement | null>(null);
  const feesAnchorRef = useRef<HTMLDivElement | null>(null);
  const phoneAnchorRef = useRef<HTMLDivElement | null>(null);
  const fastAnchorRef = useRef<HTMLDivElement | null>(null);
  const ctaAnchorRef = useRef<HTMLDivElement | null>(null);

  // Student pages data for pagination
  const studentPages = [
    {
      id: "123-456-879",
      name: "Martha Petersen", 
      dateOfBirth: "11/02/1987",
      gender: "Female",
      dateOfIssue: "01/02/2020",
      signature: "Martha",
      photo: "/lovable-uploads/4dd5ef0e-aca6-4da1-b2b8-a00536175721.png",
      email: "martha.petersen@surakshalms.edu.lk",
      phone: "+94 77 123 4567",
      address: "123 Galle Road, Colombo 03",
      course: "Software Engineering",
      year: "3rd Year",
      faculty: "Computing & Technology"
    },
    {
      id: "987-654-321",
      name: "John Silva", 
      dateOfBirth: "05/15/1998",
      gender: "Male",
      dateOfIssue: "01/02/2020",
      signature: "John Silva",
      photo: "/lovable-uploads/6678135b-8997-4d89-82a1-badde05b90d8.png",
      email: "john.silva@surakshalms.edu.lk",
      phone: "+94 71 987 6543",
      address: "456 Kandy Road, Colombo 07",
      course: "Computer Science",
      year: "2nd Year",
      faculty: "Computing & Technology"
    },
    {
      id: "555-777-999",
      name: "Priya Fernando", 
      dateOfBirth: "22/08/1999",
      gender: "Female",
      dateOfIssue: "01/02/2020",
      signature: "Priya Fernando",
      photo: "/lovable-uploads/be56f96f-f152-4139-a2d1-ee8183f95216.png",
      email: "priya.fernando@surakshalms.edu.lk",
      phone: "+94 76 555 7777",
      address: "789 Gampaha Road, Colombo 11",
      course: "Information Systems",
      year: "1st Year",
      faculty: "Computing & Technology"
    }
  ];

  const currentStudent = studentPages[currentPage];

  // Math helpers and anchor geometry
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const getDelta = (ref: React.RefObject<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return { x: cx - window.innerWidth / 2, y: cy - window.innerHeight / 2 };
  };

  // Premium card positioning system with perfect centering
  const getCardTransform = () => {
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const mobile = vw < 1024;

    // Consistent vertical offset so start and end positions are lowered equally
    const baseOffsetY = mobile ? 36 : 64; // push card down by same amount across all sections

    // animated values
    let translateX = 0;
    let translateY = 0;
    let rotateX = 0;
    let rotateY = 0;
    let rotateZ = 0;
    let scale = 1;
    let opacity = 1;

    // helpers
    const clampPx = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    // Keep fully visible horizontally based on card width
    const cardHalf = mobile ? 160 : 192; // matches w-80/md:w-96
    const maxX = vw / 2 - cardHalf - 16; // 16px safety margin
    const minX = -maxX;

    // Section 1: Hero (0-100vh) - perfectly centered (then shifted down by baseOffsetY)
    if (scrollY < vh) {
      translateX = 0;
      translateY = Math.sin(scrollY * 0.02) * 10;
      rotateX = Math.sin(scrollY * 0.008) * 3;
      rotateY = Math.cos(scrollY * 0.006) * 5;
      rotateZ = Math.sin(scrollY * 0.004) * 2;
      scale = 1 + Math.sin(scrollY * 0.008) * 0.05;
    }
    // Section 2: No Fees (100vh-200vh) - card to RIGHT, copy on LEFT
    else if (scrollY >= vh && scrollY < vh * 2) {
      const progress = easeInOutCubic((scrollY - vh) / vh);
      const targetRight = mobile ? maxX : Math.min(maxX, 420);
      translateX = targetRight * progress; // smooth approach to edge
      translateY = -progress * 36;
      rotateY = progress * 10;
      rotateZ = progress * 3.5;
      scale = 1 + progress * 0.06;
    }
    // Section 3: Instant Verification (200vh-300vh) - into phone
    else if (scrollY >= vh * 2 && scrollY < vh * 3) {
      const progress = easeInOutCubic((scrollY - vh * 2) / vh);
      const startX = mobile ? maxX : Math.min(maxX, 420);
      const endX = mobile ? 0 : -Math.min(maxX, 380);
      translateX = startX + (endX - startX) * progress; // right -> center/left
      translateY = -20 - progress * 40;
      rotateY = 10 - progress * 18;
      rotateZ = 4 + progress * 8;
      scale = (mobile ? 1.0 : 1.04) - progress * (mobile ? 0.18 : 0.22);
    }
    // Section 4: Blazing Fast (300vh-400vh) - back to CENTER cleanly
    else if (scrollY >= vh * 3 && scrollY < vh * 4) {
      const progress = easeInOutCubic((scrollY - vh * 3) / vh);
      const startX = -Math.min(maxX, 380);
      const startY = mobile ? -110 : -80;
      const startScale = mobile ? 0.82 : 0.85;
      translateX = startX * (1 - progress);
      translateY = startY * (1 - progress);
      rotateX = progress * 180; // toned-down spin
      rotateY = -6 + progress * 10;
      rotateZ = 10 - progress * 10;
      scale = startScale + progress * (1 - startScale);
    }
    // Section 5: CTA (400vh+) - slight LEFT and fade BEFORE footer
    else if (scrollY >= vh * 4) {
      const progress = Math.min(easeInOutCubic((scrollY - vh * 4) / vh), 1);
      const targetLeft = -Math.min(maxX, 240);
      translateX = targetLeft * progress;
      translateY = progress * 20;
      rotateY = progress * -8;
      rotateZ = progress * 5;
      scale = 1 + progress * 0.08;

      // fade out earlier so it never sits on footer
      const fadeStart = vh * 4.45;
      const fadeEnd = vh * 4.75;
      const fade = clampPx((scrollY - fadeStart) / (fadeEnd - fadeStart), 0, 1);
      opacity = 1 - fade;
    }

    // Final safety clamp and global vertical shift
    translateX = clampPx(translateX, minX, maxX);
    translateY += baseOffsetY; // apply same downward offset for start and end positions

    return {
      transform: `translate(-50%, -50%) translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
      transition: 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity,
    } as React.CSSProperties;
  };

  return (
    <div className="bg-black text-white overflow-x-hidden relative">
      {/* Pagination Controls - Fixed at top */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevPage}
          disabled={currentPage === 0}
          className="text-white/70 hover:text-white disabled:opacity-30 h-8 w-8 p-0 rounded-full"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex gap-2">
          {studentPages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentPage ? 'bg-blue-500 w-4' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextPage}
          disabled={currentPage === studentPages.length - 1}
          className="text-white/70 hover:text-white disabled:opacity-30 h-8 w-8 p-0 rounded-full"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Premium Floating Student ID Card with perfect centering */}
      <div 
        className="fixed top-1/2 left-1/2 z-30 will-change-transform"
        style={{
          ...getCardTransform(),
          transformOrigin: 'center center',
          perspective: '1000px'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Card className={`w-80 h-52 md:w-96 md:h-60 bg-gradient-to-br from-slate-50 to-slate-200 text-black shadow-2xl border-0 overflow-hidden relative transition-all duration-500 ${
          isMobile ? 'active:scale-95' : 'hover:shadow-3xl'
        }`}>
          {/* Logo */}
          <div className="absolute top-3 right-3 md:top-4 md:right-4">
            <img src="/lovable-uploads/ab90ba4e-121b-4049-b65d-dec211ad12c3.png" alt="Logo" className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          
          {/* Lightning bolt */}
          <div className="absolute top-3 right-12 md:top-4 md:right-16">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-black text-white flex items-center justify-center rounded transform rotate-12">
              <Zap className="w-3 h-3 md:w-4 md:h-4" />
            </div>
          </div>
          
          <CardContent className="p-4 md:p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <img 
                  src={currentStudent.photo} 
                  alt="Student" 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-gray-300"
                />
                <div className="text-left">
                  <p className="font-bold text-sm md:text-lg">{currentStudent.name.toUpperCase()}</p>
                  <p className="text-xs md:text-sm text-gray-600">Student ID Card</p>
                </div>
              </div>
              
              <div className="text-lg md:text-2xl font-mono tracking-[0.2em] md:tracking-[0.3em] mb-2 text-center">
                {currentStudent.id.replace(/-/g, ' ')}
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500 uppercase">Valid Thru</p>
                <p className="font-mono text-xs md:text-sm">09/30</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase">Suraksha</p>
                <p className="font-bold text-sm md:text-lg">LMS</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center perspective-1000">
        {/* Animated Background */}
        <div className="absolute inset-0 background-pulse" />
        
        {/* Falling Meteors */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-20 bg-gradient-to-t from-primary to-transparent meteor"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `translateY(${scrollY * (0.1 + Math.random() * 0.2)}px)`
              }}
            />
          ))}
        </div>

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/ab90ba4e-121b-4049-b65d-dec211ad12c3.png" alt="SurakshaLMS Logo" className="h-8 w-8" />
          </div>
          
          <nav className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-white/80 hover:text-white transition-colors duration-300" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button variant="ghost" className="text-white/80 hover:text-white transition-colors duration-300">
              Customers
            </Button>
            <Button variant="ghost" className="text-white/80 hover:text-white transition-colors duration-300">
              Pricing
            </Button>
            <Button variant="ghost" className="text-white/80 hover:text-white transition-colors duration-300" onClick={() => navigate('/guidance')}>
              <GraduationCap className="w-4 h-4 mr-2" />
              Guidance
            </Button>
            <Button variant="outline" className="gap-2 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              <IdCard className="w-4 h-4" />
              Login to SurakshaLMS
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="outline" size="sm" className="backdrop-blur-sm border-primary/20 text-white/80">
              <Building className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Main Hero Content */}
        <div className="text-left md:text-center z-10 px-4 pt-32">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            The Only Student ID
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-12">
            Probably the best digital student ID for educational institutions
          </p>

          {/* Space for floating card - it will appear here via fixed positioning */}
          <div className="h-52 md:h-60 mb-12"></div>
          
          {/* Student info display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 max-w-md mx-auto mb-8">
            <div className="text-center space-y-2">
              <p className="text-white/90 font-semibold">{currentStudent.name}</p>
              <p className="text-white/70 text-sm">{currentStudent.course} - {currentStudent.year}</p>
              <p className="text-white/60 text-xs">{currentStudent.faculty}</p>
            </div>
          </div>

          <Button 
            className="bg-primary hover:bg-primary/80 text-white px-8 py-3 text-lg"
          >
            Get Student ID
          </Button>
        </div>
      </section>

      {/* Second Section - No Fees */}
      <section className="min-h-screen relative flex items-center bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              No Joining Fees.<br />
              No Annual Fees.
            </h2>
            <p className="text-xl text-white/70 leading-relaxed">
              While many digital ID systems come with hidden costs, SurakshaLMS provides a comprehensive 
              student identification platform without charging any setup or annual maintenance fees.
            </p>
          </div>
          
          {/* Empty space for card to move into */}
          <div className="flex justify-center">
            <div className="w-80 h-52 opacity-0">
              {/* Placeholder space for the moving card */}
            </div>
          </div>
        </div>
      </section>

      {/* Third Section - Instant Features */}
      <section className="min-h-screen relative flex items-center bg-black">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-2 lg:order-1">
            {/* Phone mockup */}
            <div className="w-64 h-[500px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-4 shadow-2xl z-20">
              <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden">
                {/* Phone content - card will move into here */}
                <div className="p-6 h-full flex flex-col justify-center">
                  {/* Space for the moving card */}
                  <div className="w-full h-40 mb-4 opacity-0">
                    {/* Placeholder for card */}
                  </div>
                  
                  {/* App features */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Grocery Shop - $34</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Patrol - $49</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Experience - $258</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 z-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Instant<br />
              Verification
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Link your digital student ID to your mobile device for instant verification 
              and seamless access to campus facilities.
            </p>
            <div className="w-16 h-1 bg-primary mb-8"></div>
            
            {/* Feature icons */}
            <div className="flex gap-6">
              <Shield className="w-8 h-8 text-white/60" />
              <Zap className="w-8 h-8 text-white/60" />
              <Globe className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Fourth Section - Fast Transactions */}
      <section className="min-h-screen relative flex items-center justify-center bg-black overflow-hidden">
        {/* Animated background rays */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-full bg-gradient-to-t from-purple-500/20 via-pink-500/20 to-transparent"
              style={{
                left: `${i * 5}%`,
                transform: `rotate(${15 + i * 2}deg) translateY(${Math.sin(scrollY * 0.01 + i) * 20}px)`,
                transformOrigin: 'bottom center'
              }}
            />
          ))}
        </div>

        <div className="text-center z-20 px-4">
          {/* Space for the rotating card */}
          <div className="mb-8 h-52"></div>

          <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Blazing Fast Verification
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center text-white/70">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <span>Verify in 10 seconds</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <span>99.9% Success rate</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <span>Auto Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section - Get Your ID */}
      <section className="min-h-screen relative flex items-center justify-center bg-gradient-to-t from-black via-gray-900 to-black">
        <div className="text-center z-20 px-4 max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            Get your Student ID in<br />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              just 5min
            </span>
          </h2>
          
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Simple 3 step verification with online identity verification 
            and instant digital student ID unlock
          </p>

          <Button 
            className="bg-primary hover:bg-primary/80 text-white px-12 py-4 text-lg rounded-full"
          >
            Get Student ID
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 z-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img src="/lovable-uploads/ab90ba4e-121b-4049-b65d-dec211ad12c3.png" alt="Logo" className="w-6 h-6" />
              <span className="font-bold">SurakshaLMS</span>
            </div>
            
            <div className="text-center mb-4 md:mb-0">
              <p className="text-white/60">Design by SurakshaLMS Team</p>
            </div>
            
            <div className="flex gap-6">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">LinkedIn</Button>
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">Know More</Button>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-white/40 text-sm">All copyright reserved to @surakshalms</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentID;