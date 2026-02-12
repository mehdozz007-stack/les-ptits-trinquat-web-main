import { useState, useEffect } from "react";
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

  // Rafraîchir les lots quand la fenêtre retrouve le focus
  useEffect(() => {
    const handleFocus = () => {
      console.log('📱 Window focused - refreshing lots');
      refetch();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  // Rafraîchir périodiquement toutes les 10 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏱️ Periodic refresh - syncing lots');
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  const filteredLots = lots.filter((lot) => {
    if (filter === "all") return true;
    return lot.statut === filter;
  });

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky/20 px-4 py-1.5 text-sm font-semibold text-sky-foreground">
            <Gift className="h-4 w-4" />
            Les lots
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Découvrez les lots à gagner 🎁
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
          className="mb-8 flex flex-wrap items-center justify-center gap-2"
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
        ) : filteredLots.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md rounded-2xl bg-muted/50 p-8 text-center"
          >
            <div className="mb-4 text-5xl">🎁</div>
            <h3 className="mb-2 text-lg font-bold">
              {filter === "all" ? "Aucun lot pour le moment" : "Aucun lot dans cette catégorie"}
            </h3>
            <p className="text-muted-foreground">
              {filter === "all" 
                ? "Soyez le premier à proposer un lot !"
                : "Essayez un autre filtre pour voir plus de lots."}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLots.map((lot, index) => (
              <LotCard
                key={lot.id}
                lot={lot}
                currentParticipant={currentParticipant}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
