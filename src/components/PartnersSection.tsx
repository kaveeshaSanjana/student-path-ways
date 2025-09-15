import partner1 from "@/assets/partners/partner-1.png";
import awsLogo from "@/assets/partners/aws-logo.png";
import sinhalaLogo from "@/assets/partners/sinhala-logo.png";
import googleLogo from "@/assets/partners/google-logo.png";

const PartnersSection = () => {
  // Base partner logos
  const basePartners = [
    { name: "Partner 1", logo: partner1 },
    { name: "AWS", logo: awsLogo },
    { name: "Sinhala Partner", logo: sinhalaLogo },
    { name: "Google", logo: googleLogo },
  ];

  // Create multiple copies for seamless loop
  const partners = [...basePartners, ...basePartners, ...basePartners];

  return (
    <section className="py-8 bg-gradient-to-r from-background via-muted/20 to-background border-y border-border/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-2">
            Our Trusted Partners
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Working together with leading organizations to transform education
          </p>
        </div>
        
        {/* Partners Marquee */}
        <div className="relative overflow-hidden">
          <div className="flex items-center justify-center">
            <div className="flex animate-scroll-right space-x-6 md:space-x-8">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-lg border border-border/10 hover:border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-md group"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;