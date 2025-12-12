import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { EventsPreview } from "@/components/home/EventsPreview";
import { ReportsPreview } from "@/components/home/ReportsPreview";
import { PartnersPreview } from "@/components/home/PartnersPreview";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <EventsPreview />
      <ReportsPreview />
      <PartnersPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
