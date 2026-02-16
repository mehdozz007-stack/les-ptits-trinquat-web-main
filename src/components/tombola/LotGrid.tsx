import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2, Filter } from "lucide-react";
import { LotCard } from "./LotCard";
import { useTombolaLots } from "@/hooks/useTombolaLots";
import { TombolaParticipantPublic } from "@/hooks/useTombolaParticipants";
import { Button } from "@/components/ui/button";

interface LotGridProps {
  currentParticipant: TombolaParticipantPublic | null;
}

const FILTER_OPTIONS = [
  { value: "all", label: "Tous", emoji: "🎁" },
  { value: "disponible", label: "Disponibles", emoji: "🟢" },
  { value: "reserve", label: "Réservés", emoji: "🟡" },
  { value: "remis", label: "Remis", emoji: "🔴" },
];

export function LotGrid({ currentParticipant }: LotGridProps) {
  const { lots, loading, error, refetch } = useTombolaLots();
  const [filter, setFilter] = useState("all");
  const lastRefetchTime = useRef<number>(0);
  const MIN_REFETCH_INTERVAL = 1000; // Minimum 1 seconde entre les refreshes

  // Fonction utilitaire pour rafraîchir avec debounce
  const performRefetch = () => {
    const now = Date.now();
    if (now - lastRefetchTime.current >= MIN_REFETCH_INTERVAL) {
      console.log('🔄 Refreshing lots data');
      lastRefetchTime.current = now;
      refetch();
    }
  };

  // Rafraîchir les lots quand la fenêtre retrouve le focus
  useEffect(() => {
    const handleFocus = () => {
      console.log('📱 Window focused - refreshing lots');
      performRefetch();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  // Rafraîchir immédiatement après une action sur un lot (réservation, libération, remise)
  useEffect(() => {
    const handleLotAction = () => {
      console.log('⚡ Lot action detected - refreshing immediately');
      performRefetch();
    };

    window.addEventListener('lotActionCompleted', handleLotAction);
    return () => window.removeEventListener('lotActionCompleted', handleLotAction);
  }, [refetch]);

  // Séléectionner les "mes lots" = lots créés par moi ou avec lesquels j'ai interagi
  const myLots = lots.filter((lot) => {
    const isMyLot = lot.parent_id === currentParticipant?.id;
    const hasInteracted = lot.reserved_by === currentParticipant?.id;
    return isMyLot || hasInteracted;
  });

  // Les "lots des familles" = tous les autres
  const familyLots = lots.filter((lot) => {
    const isMyLot = lot.parent_id === currentParticipant?.id;
    const hasInteracted = lot.reserved_by === currentParticipant?.id || lot.statut === "remis";
    return !(isMyLot || hasInteracted);
  });

  // Appliquer les filtres selon la sélection
  const applyFilter = (lotsArray: typeof lots) => {
    if (filter === "all") return lotsArray;
    return lotsArray.filter((lot) => lot.statut === filter);
  };

  const filteredMyLots = applyFilter(myLots);
  const filteredFamilyLots = applyFilter(familyLots);

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky/50 px-4 py-1.5 text-sm font-semibold text-sky-foreground">
            <Gift className="h-4 w-4" />
            Les lots
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Découvrez les lots à gagner
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Parcourez les lots proposés par les familles participantes.
            Réservez ceux qui vous intéressent et organisez les échanges en toute simplicité.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8  py-4 flex flex-wrap items-center justify-center gap-2"
        >
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          {FILTER_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(option.value)}
              className="gap-1"
            >
              <span>{option.emoji}</span>
              {option.label}
              {option.value === "all" && (
                <span className="ml-1 rounded-full bg-foreground/10 px-1.5 text-xs">
                  {lots.length}
                </span>
              )}
            </Button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-destructive/10 p-6 text-center text-destructive">
            Une erreur est survenue : {error}
          </div>
        ) : (
          <div className="space-y-16">
            {/* VOS LOTS Section */}
            {myLots.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 px-4 py-2 text-sm font-semibold text-primary mb-4">
                    <span className="text-lg">⭐</span>
                    Vos lots
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Les lots que vous partagez
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Les lots que vous avez proposés et vos interactions
                  </p>
                </div>

                {filteredMyLots.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl bg-gradient-to-br from-amber/10 to-orange/10 border border-amber/20 p-8 text-center"
                  >
                    <div className="mb-4 text-4xl">🎁</div>
                    <h4 className="mb-2 text-lg font-bold text-foreground">
                      {filter === "all" ? "Aucun lot pour le moment" : "Aucun lot dans cette catégorie"}
                    </h4>
                    <p className="text-muted-foreground">
                      {filter === "all"
                        ? "Commencez à partager vos premiers lots !"
                        : "Essayez un autre filtre."}
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredMyLots.map((lot, index) => (
                      <LotCard
                        key={lot.id}
                        lot={lot}
                        currentParticipant={currentParticipant}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* LOTS DES FAMILLES Section */}
            {familyLots.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 px-4 py-2 text-sm font-semibold text-primary mb-4">
                    <span className="text-lg">👨‍👩‍👧‍👦</span>
                    Lots des familles
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Découvrez les autres lots
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Les lots proposés par les autres familles participantes
                  </p>
                </div>

                {filteredFamilyLots.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl bg-muted/50 p-8 text-center"
                  >
                    <div className="mb-4 text-4xl">🎁</div>
                    <h4 className="mb-2 text-lg font-bold text-foreground">
                      Aucun lot dans cette catégorie
                    </h4>
                    <p className="text-muted-foreground">
                      Essayez un autre filtre pour voir plus de lots.
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredFamilyLots.map((lot, index) => (
                      <LotCard
                        key={lot.id}
                        lot={lot}
                        currentParticipant={currentParticipant}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Aucun lot du tout */}
            {lots.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-md rounded-2xl bg-muted/50 p-8 text-center"
              >
                <div className="mb-4 text-5xl">🎁</div>
                <h3 className="mb-2 text-lg font-bold">Aucun lot pour le moment</h3>
                <p className="text-muted-foreground">
                  Soyez le premier à proposer un lot !
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
