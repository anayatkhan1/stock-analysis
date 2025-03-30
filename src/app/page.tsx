import ContentSection from "@/components/content-7";
import FeaturesSection from "@/components/features-9";
import HeroSection from "@/components/hero-section";
import Pricing from "@/components/pricing";
import StatsSection from "@/components/stats";
import Testimonials from "@/components/testimonials";

const LandingPage = () => {
  return (
    <div className="h-screen">
      <HeroSection />
      <FeaturesSection />
      <ContentSection />
      <StatsSection />
      <Testimonials />
      <Pricing />
    </div>
  );
};

export default LandingPage;
