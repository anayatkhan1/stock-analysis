import ContentSection from "@/components/content-7";
import FeaturesSection from "@/components/features-9";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats";

const LandingPage = () => {
  return (
    <div className="h-screen">
      <HeroSection />
      <FeaturesSection />
      <ContentSection />
      <StatsSection />
    </div>
  );
};

export default LandingPage;
