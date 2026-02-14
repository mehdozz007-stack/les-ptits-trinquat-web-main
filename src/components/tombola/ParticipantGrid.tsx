import { motion } from "framer-motion";
import { Users, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { ParticipantCard } from "./ParticipantCard";
import { useTombolaParticipants, TombolaParticipantPublic } from "@/hooks/useTombolaParticipants";

interface ParticipantGridProps {
  currentParticipant?: TombolaParticipantPublic | null;
}

export function ParticipantGrid({ currentParticipant }: ParticipantGridProps) {
  const { participants, loading, error, deleteParticipant, refetch } = useTombolaParticipants();

  // Rafraîchir les participants quand la fenêtre retrouve le focus
  useEffect(() => {
    const handleFocus = () => {
      console.log('📱 Window focused - refreshing participants');
      refetch();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  // Rafraîchir périodiquement toutes les 10 secondes pour synchronisation multi-appareils
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏱️ Periodic refresh - syncing participants');
      refetch();
    }, 10000); // Rafraîchir toutes les 10 secondes

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-semibold text-secondary-foreground">
            <Users className="h-4 w-4" />
            Échanges Tombola
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Les familles participantes 👨‍👩‍👧‍👦
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Découvrez les familles qui participent à notre grande tombola solidaire.
            Rejoignez la communauté en vous inscrivant !
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-destructive/10 p-6 text-center text-destructive">
            Une erreur est survenue : {error}
          </div>
        ) : participants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md rounded-2xl bg-muted/50 p-8 text-center"
          >
            <div className="mb-4 text-5xl">🎈</div>
            <h3 className="mb-2 text-lg font-bold">Soyez le premier !</h3>
            <p className="text-muted-foreground">
              Aucun participant pour le moment. Inscrivez-vous pour lancer la tombola !
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {participants
              .sort((a, b) => {
                // Mettre le profil actuel en premier
                if (currentParticipant && a.id === currentParticipant.id) return -1;
                if (currentParticipant && b.id === currentParticipant.id) return 1;
                return 0;
              })
              .map((participant, index) => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                  index={index}
                  currentParticipant={currentParticipant}
                  onDelete={deleteParticipant}
                  onRefresh={refetch}
                />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
