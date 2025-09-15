import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogIn, GraduationCap, Menu, X, Users, DollarSign, FileText } from "lucide-react";
import { useState } from "react";
const ModernNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [{
    name: "About",
    href: "#",
    icon: FileText
  }, {
    name: "Features",
    href: "#",
    icon: Users
  }, {
    name: "Pricing",
    href: "#",
    icon: DollarSign
  }, {
    name: "Blog",
    href: "#",
    icon: FileText
  }, {
    name: "Student ID",
    href: "/student-id",
    icon: Users
  }, {
    name: "Guidance",
    href: "/guidance",
    icon: GraduationCap
  }];
  return <>
      {/* Modern Glass Navigation */}
      <nav className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 w-[98%] max-w-7xl">
        <div className="relative">
          {/* Glass Background with Curved Design */}
          <div className="absolute inset-0 bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl ring-1 ring-white/10"></div>
          
          {/* Curved Accent Lines */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"></div>
          <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"></div>
          
          {/* Navigation Content */}
          <div className="relative flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="/lovable-uploads/ab90ba4e-121b-4049-b65d-dec211ad12c3.png" alt="SurakshaLMS Logo" className="h-10 w-10 rounded-xl shadow-lg" />
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-xl blur opacity-75"></div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                SurakshaLMS
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => <Button key={item.name} variant="ghost" className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/15 rounded-2xl transition-all duration-300 backdrop-blur-sm relative group" onClick={() => item.href.startsWith('/') ? window.location.href = item.href : null}>
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-dark/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>)}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              
              <Button className="px-4 sm:px-6 py-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group text-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <LogIn className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">Log</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="sm:hidden p-2 hover:bg-white/10 rounded-2xl transition-all duration-300">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-xl border-l border-white/20">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <img src="/lovable-uploads/ab90ba4e-121b-4049-b65d-dec211ad12c3.png" alt="SurakshaLMS Logo" className="h-8 w-8 rounded-lg" />
                      <span className="font-bold text-lg">SurakshaLMS</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-xl">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex-1 px-6 py-8">
                    <div className="space-y-4">
                      {navItems.map(item => <Button key={item.name} variant="ghost" className="w-full justify-start gap-3 px-4 py-3 text-left hover:bg-white/5 rounded-2xl transition-all duration-300" onClick={() => {
                      if (item.href.startsWith('/')) {
                        window.location.href = item.href;
                      }
                      setIsOpen(false);
                    }}>
                          <item.icon className="w-5 h-5" />
                          {item.name}
                        </Button>)}
                    </div>
                  </div>

                  {/* Mobile CTA Buttons */}
                  <div className="p-6 border-t border-white/10 space-y-3">
                    <Button variant="outline" className="w-full border-white/30 bg-white/5 hover:bg-white/15 rounded-2xl">
                      Dark Mode
                    </Button>
                    <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-2xl">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login to SurakshaLMS
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

    </>;
};
export default ModernNavigation;