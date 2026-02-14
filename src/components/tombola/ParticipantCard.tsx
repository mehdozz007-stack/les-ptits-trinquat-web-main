import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TombolaParticipantPublic } from "@/hooks/useTombolaParticipants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/use-toast";

interface ParticipantCardProps {
  participant: TombolaParticipantPublic;
  index: number;
  currentParticipant?: TombolaParticipantPublic | null;
  onDelete?: (participantId: string, token: string) => Promise<{ error: string | null }>;
  onRefresh?: () => Promise<void>;
}

export function ParticipantCard({ participant, index, currentParticipant, onDelete, onRefresh }: ParticipantCardProps) {
  const { toast } = useToast();
  const { token } = useCurrentUser();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isCurrentUser = currentParticipant?.id === participant.id;

  const handleDelete = async () => {
    if (!isCurrentUser || !onDelete || !token) return;

    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer votre participation ? Cette action est irréversible.`);
    if (!confirmed) return;

    setDeleteLoading(true);
    const { error } = await onDelete(participant.id, token);
    setDeleteLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer votre participation.",
        variant: "destructive",
      });
      return;
    }

    // Refetch to ensure UI is in sync
    if (onRefresh) {
      await onRefresh();
    }

    toast({
      title: "Participation supprimée",
      description: "Redirection en cours...",
    });

    // Nettoyer complètement le localStorage avec les bonnes clés
    setTimeout(() => {
      localStorage.removeItem('tombola_auth_token');
      localStorage.removeItem('tombola_current_user');
      localStorage.removeItem('participantId');
      localStorage.removeItem('token');
      // Forcer un reload complet de la page pour réinitialiser l'état
      window.location.reload();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
        className="group relative h-full cursor-default transition-all duration-300 hover:-translate-y-2 hover:shadow-glow"
      >
        <CardContent className="flex flex-col items-center p-6 text-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-sky/20 text-4xl shadow-soft"
          >
            {participant.emoji}
          </motion.div>

          <h3 className="mb-1 text-lg font-bold text-foreground">
            {participant.prenom}
            {isCurrentUser && <span className="ml-2 text-sm text-primary"><br />(C'est vous !)</span>}
          </h3>
          <span className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {participant.role}
          </span>

          {participant.classes && (
            <p className="mb-4 text-sm text-muted-foreground">
              {participant.classes}
            </p>
          )}

          {isCurrentUser && (
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 bg-gradient-to-r from-red-500 via-orange-500 to-rose-500 hover:from-red-600 hover:via-orange-600 hover:to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 border-0"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Supprimer
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
