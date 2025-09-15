import { useState } from "react";
const ServicesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("Crypto");
  const categories = ["Crypto", "Makeup Artist", "Yoga", "Sports", "Real Estate", "Photography", "Charity", "Courses"];
  const servicesByCategory = {
    "Crypto": [{
      title: "BLOCKCHAIN DEVELOPMENT",
      description: "Learn more",
      videoUrl: "https://www.youtube.com/embed/OTy5UUFCS-I?si=VrVnQVwupYz76fVd"
    }, {
      title: "CRYPTO TRADING BOTS",
      description: "Learn more"
    }, {
      title: "NFT MARKETPLACE",
      description: "Learn more"
    }, {
      title: "DEFI PROTOCOLS",
      description: "Learn more"
    }, {
      title: "SMART CONTRACTS",
      description: "Learn more"
    }, {
      title: "CRYPTO WALLETS",
      description: "Learn more"
    }],
    "Makeup Artist": [{
      title: "BRIDAL MAKEUP",
      description: "Learn more",
      videoUrl: "https://www.youtube.com/embed/sdXII5RKMTY?si=bCmaVIbfhhsHWj6P"
    }, {
      title: "SPECIAL EFFECTS MAKEUP",
      description: "Learn more"
    }, {
      title: "FASHION MAKEUP",
      description: "Learn more"
    }, {
      title: "EDITORIAL MAKEUP",
      description: "Learn more"
    }, {
      title: "CELEBRITY MAKEUP",
      description: "Learn more"
    }, {
      title: "MAKEUP TUTORIALS",
      description: "Learn more"
    }],
    "Yoga": [{
      title: "HATHA YOGA",
      description: "Learn more"
    }, {
      title: "VINYASA FLOW",
      description: "Learn more"
    }, {
      title: "MEDITATION CLASSES",
      description: "Learn more"
    }, {
      title: "PRENATAL YOGA",
      description: "Learn more"
    }, {
      title: "HOT YOGA",
      description: "Learn more"
    }, {
      title: "YIN YOGA",
      description: "Learn more"
    }],
    "Sports": [{
      title: "PERSONAL TRAINING",
      description: "Learn more"
    }, {
      title: "TEAM COACHING",
      description: "Learn more"
    }, {
      title: "FITNESS PROGRAMS",
      description: "Learn more"
    }, {
      title: "SPORTS NUTRITION",
      description: "Learn more"
    }, {
      title: "INJURY PREVENTION",
      description: "Learn more"
    }, {
      title: "PERFORMANCE ANALYSIS",
      description: "Learn more"
    }],
    "Real Estate": [{
      title: "PROPERTY LISTING",
      description: "Learn more"
    }, {
      title: "HOME STAGING",
      description: "Learn more"
    }, {
      title: "MARKET ANALYSIS",
      description: "Learn more"
    }, {
      title: "INVESTMENT ADVICE",
      description: "Learn more"
    }, {
      title: "PROPERTY MANAGEMENT",
      description: "Learn more"
    }, {
      title: "VIRTUAL TOURS",
      description: "Learn more"
    }],
    "Photography": [{
      title: "WEDDING PHOTOGRAPHY",
      description: "Learn more"
    }, {
      title: "PORTRAIT SESSIONS",
      description: "Learn more"
    }, {
      title: "COMMERCIAL SHOOTS",
      description: "Learn more"
    }, {
      title: "EVENT PHOTOGRAPHY",
      description: "Learn more"
    }, {
      title: "PRODUCT PHOTOGRAPHY",
      description: "Learn more"
    }, {
      title: "PHOTO EDITING",
      description: "Learn more"
    }],
    "Charity": [{
      title: "FUNDRAISING CAMPAIGNS",
      description: "Learn more"
    }, {
      title: "VOLUNTEER COORDINATION",
      description: "Learn more"
    }, {
      title: "COMMUNITY OUTREACH",
      description: "Learn more"
    }, {
      title: "DONATION MANAGEMENT",
      description: "Learn more"
    }, {
      title: "AWARENESS PROGRAMS",
      description: "Learn more"
    }, {
      title: "IMPACT REPORTING",
      description: "Learn more"
    }],
    "Courses": [{
      title: "ONLINE LEARNING",
      description: "Learn more"
    }, {
      title: "SKILL DEVELOPMENT",
      description: "Learn more"
    }, {
      title: "CERTIFICATION PROGRAMS",
      description: "Learn more"
    }, {
      title: "TUTORING SERVICES",
      description: "Learn more"
    }, {
      title: "WORKSHOP CREATION",
      description: "Learn more"
    }, {
      title: "COURSE MARKETING",
      description: "Learn more"
    }]
  };

  // Determine visible services count per category
  const items = servicesByCategory[selectedCategory] ?? [];
  const visibleServices = selectedCategory === "Crypto" ? items.slice(0, 3) : items;
  
  return (
    <section className="py-16 bg-gradient-to-br from-background via-primary-light/10 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our comprehensive range of services designed to meet your needs
          </p>
        </div>
        
        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleServices.map((service, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50"
            >
              <h3 className="text-xl font-bold mb-3 text-primary">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              {service.videoUrl && (
                <div className="aspect-video bg-muted rounded-lg mb-4">
                  <iframe
                    src={service.videoUrl}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ServicesSection;