import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import whatsappLogo from "@/assets/whatsapp-logo.png";
import telegramLogo from "@/assets/telegram-logo.png";
import messagingApps1 from "@/assets/messaging-apps-1.png";
import messagingApps2 from "@/assets/messaging-apps-2.png";
const MessagingAppsSection = () => {
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const handleButtonClick = (platform: string) => {
    setClickedButton(platform);
    setTimeout(() => setClickedButton(null), 800);
  };
  const images = [{
    src: whatsappLogo,
    alt: "WhatsApp Logo"
  }, {
    src: telegramLogo,
    alt: "Telegram Logo"
  }, {
    src: messagingApps1,
    alt: "Messaging Apps Integration"
  }, {
    src: messagingApps2,
    alt: "Combined Platform Features"
  }];
  return <section className="py-20 bg-gradient-to-br from-background via-muted/5 to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border border-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-primary/40 rounded-full animate-spin" style={{
        animationDuration: '25s'
      }}></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            AI-Powered LMS in Messaging Apps
          </h2>
          
          {/* 4 Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            {images.map((image, index) => <div key={index} className="relative group">
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-primary-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
              </div>)}
          </div>

          <p className="text-muted-foreground text-lg max-w-4xl mx-auto leading-relaxed">
            For the first time in Sri Lanka, empower students, parents, and educational teams with instant LMS access via WhatsApp and Telegram bots. Receive real-time notifications, updates on causes, and AI-powered assistance directly on your favorite messaging platform. Perfect for academic communities looking to stay connected and engaged without needing to access a separate portal.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg font-medium text-primary mb-8">
            Choose your favorite platform and experience
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* WhatsApp Button */}
            <Button onClick={() => handleButtonClick('whatsapp')} className={`
                group relative px-8 py-4 text-lg font-semibold rounded-xl
                bg-green-500 hover:bg-green-600 text-white
                shadow-lg hover:shadow-xl
                transform transition-all duration-300
                ${clickedButton === 'whatsapp' ? 'scale-95 animate-pulse' : 'hover:scale-105'}
                overflow-hidden
              `}>
              {/* Button background animation */}
              <div className={`
                absolute inset-0 bg-gradient-to-r from-green-400 to-green-600
                transition-opacity duration-300
                ${clickedButton === 'whatsapp' ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover:opacity-100'}
              `}></div>
              
              <div className="relative flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <span>Join with WhatsApp</span>
              </div>
              
              {/* Click animation ripple */}
              {clickedButton === 'whatsapp' && <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping"></div>}
            </Button>

            {/* Telegram Button */}
            <Button onClick={() => handleButtonClick('telegram')} className={`
                group relative px-8 py-4 text-lg font-semibold rounded-xl
                bg-blue-500 hover:bg-blue-600 text-white
                shadow-lg hover:shadow-xl
                transform transition-all duration-300
                ${clickedButton === 'telegram' ? 'scale-95 animate-pulse' : 'hover:scale-105'}
                overflow-hidden
              `}>
              {/* Button background animation */}
              <div className={`
                absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600
                transition-opacity duration-300
                ${clickedButton === 'telegram' ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover:opacity-100'}
              `}></div>
              
              <div className="relative flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <span>Join with Telegram</span>
              </div>
              
              {/* Click animation ripple */}
              {clickedButton === 'telegram' && <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping"></div>}
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default MessagingAppsSection;