import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ActualitesPreview } from "@/components/home/ActualitesPreview";
import { EventsPreview } from "@/components/home/EventsPreview";
import { PartnersPreview } from "@/components/home/PartnersPreview";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <EventsPreview />
      <ActualitesPreview />
      <PartnersPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
