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
  return;
};
export default ServicesSection;