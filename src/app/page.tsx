import CallToAction from "@/components/call-to-action";
import ContentSection from "@/components/content-7";
import FAQs from "@/components/faqs";
import FeaturesSection from "@/components/features-9";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import Pricing from "@/components/pricing";
import StatsSection from "@/components/stats";
import Testimonials from "@/components/testimonials";

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="content">
        <ContentSection />
      </div>
      <StatsSection />
      <Testimonials />
      <div id="pricing">
        <Pricing />
      </div>
      <div id="about">
        <FAQs />
      </div>
      <CallToAction />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
