import { useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { TombolaHero } from "@/components/tombola/TombolaHero";
import { ParticipantGrid } from "@/components/tombola/ParticipantGrid";
import { ParticipantForm } from "@/components/tombola/ParticipantForm";
import { LotGrid } from "@/components/tombola/LotGrid";
import { LotForm } from "@/components/tombola/LotForm";
import { ParticipantSelector } from "@/components/tombola/ParticipantSelector";
import { SolidaritySection } from "@/components/tombola/SolidaritySection";
import { TombolaParticipantPublic } from "@/hooks/useTombolaParticipants";

export default function Tombola() {
  const [currentParticipant, setCurrentParticipant] = useState<TombolaParticipantPublic | null>(null);

  const handleSelectParticipant = useCallback((participant: TombolaParticipantPublic | null) => {
    setCurrentParticipant(participant);
  }, []);

  return (
    <Layout>
      {/* SEO Meta */}
      <title>La Tombola des P'tits Trinquât | Association de Parents d'Élèves</title>
      <meta
        name="description"
        content="Participez à la tombola solidaire des P'tits Trinquât. Inscrivez-vous, proposez des lots et échangez entre familles dans un esprit convivial et bienveillant."
      />

      <TombolaHero />
      <ParticipantGrid />
      <ParticipantForm />
      <LotForm currentParticipant={currentParticipant} />
      <LotGrid currentParticipant={currentParticipant} />
      <SolidaritySection />
      
      <ParticipantSelector
        currentParticipant={currentParticipant}
        onSelect={handleSelectParticipant}
      />
    </Layout>
  );
}
