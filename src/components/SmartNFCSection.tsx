import { useState } from "react";
import { Button } from "@/components/ui/button";
import smartNFCCard from "@/assets/smart-nfc-card.jpg";

const SmartNFCSection = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRotating) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateY = ((e.clientX - centerX) / rect.width) * 30;
    const rotateX = ((centerY - e.clientY) / rect.height) * 30;
    
    setRotationY(rotateY);
    setRotationX(rotateX);
  };

  const handleMouseEnter = () => {
    setIsRotating(true);
  };

  const handleMouseLeave = () => {
    setIsRotating(false);
    setRotationY(0);
    setRotationX(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateY = ((touch.clientX - centerX) / rect.width) * 30;
    const rotateX = ((centerY - touch.clientY) / rect.height) * 30;
    
    setRotationY(rotateY);
    setRotationX(rotateX);
  };

  const handleTouchEnd = () => {
    setRotationY(0);
    setRotationX(0);
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* 3D Card Section */}
          <div className="flex justify-center lg:justify-start">
            <div 
              className="perspective-1000 cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ perspective: '1000px' }}
            >
              <div 
                className="w-80 h-48 md:w-96 md:h-60 shadow-2xl transition-transform duration-300 ease-out rounded-lg overflow-hidden"
                style={{
                  transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <img 
                  src={smartNFCCard}
                  alt="Smart NFC Student ID Card"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Smart NFC ID
                <span className="block text-blue-600 dark:text-blue-400">
                  First Time in Sri Lanka
                </span>
              </h2>
              
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p className="leading-relaxed">
                  Revolutionizing student identification with cutting-edge NFC technology. 
                  Our Smart NFC ID cards provide seamless access to campus facilities, 
                  digital payments, and instant information sharing.
                </p>
                
                <p>
                  Each student receives a personalized digital identity that goes beyond 
                  traditional ID cards. With just a tap, students can access their custom 
                  webpage, share contact information, and connect with the digital campus ecosystem.
                </p>
                
                <div className="grid md:grid-cols-2 gap-3 my-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">Custom Student Webpage</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">Contactless Access</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">Digital Payments</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">Instant Information</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Free Custom Webpages:</strong> Every student gets their own personalized 
                  webpage linked to their NFC card, showcasing their academic journey, projects, 
                  and achievements - completely free of charge.
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Read More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartNFCSection;