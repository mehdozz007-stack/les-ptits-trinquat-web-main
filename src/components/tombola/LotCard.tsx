import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, Loader2, PartyPopper, Trash2, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TombolaLot, useTombolaLots } from "@/hooks/useTombolaLots";
import { TombolaParticipantPublic } from "@/hooks/useTombolaParticipants";
import { useToast } from "@/hooks/use-toast";

interface LotCardProps {
  lot: TombolaLot;
  currentParticipant: TombolaParticipantPublic | null;
  index: number;
}

const STATUS_CONFIG = {
  disponible: {
    label: "Disponible",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  reserve: {
    label: "Réservé",
    color: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  remis: {
    label: "Déjà remis",
    color: "bg-gray-100 text-gray-700",
    dot: "bg-gray-500",
  },
} as const;

export function LotCard({ lot, currentParticipant, index }: LotCardProps) {
  const { reserveLot, getContactLink, deleteLot, markAsRemis } = useTombolaLots();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [remisLoading, setRemisLoading] = useState(false);
  const [justReserved, setJustReserved] = useState(false);

  const statusConfig = STATUS_CONFIG[lot.statut as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.disponible;
  const isOwner = currentParticipant?.id === lot.parent_id;
  const isReserver = currentParticipant?.id === lot.reserved_by;
  const canReserve = lot.statut === "disponible" && currentParticipant && !isOwner;

  const handleReserve = async () => {
    if (!currentParticipant) return;

    setLoading(true);
    const { error } = await reserveLot(lot.id, currentParticipant.id);
    setLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réserver ce lot.",
        variant: "destructive",
      });
      return;
    }

    setJustReserved(true);
    toast({
      title: "Lot réservé ! 🎉",
      description: "Contactez le propriétaire pour organiser l'échange.",
    });

    setTimeout(() => setJustReserved(false), 3000);
  };

  const handleContact = async () => {
    if (!currentParticipant) return;

    setContactLoading(true);
    const mailtoLink = await getContactLink(lot.id, currentParticipant.prenom);
    setContactLoading(false);

    if (mailtoLink) {
      window.location.href = mailtoLink;
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations de contact.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return;

    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer le lot "${lot.nom}" ?`);
    if (!confirmed) return;

    setDeleteLoading(true);
    const { error } = await deleteLot(lot.id, lot.parent_id);
    setDeleteLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer ce lot.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Lot supprimé",
      description: "Le lot a été supprimé avec succès.",
    });
  };

  const handleMarkAsRemis = async () => {
    if (!isOwner) return;

    setRemisLoading(true);
    const { error } = await markAsRemis(lot.id);
    setRemisLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer le lot comme remis.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Lot remis ! 🎁",
      description: "Le lot a été marqué comme remis.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card

        className={`group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${lot.statut === "remis" ? "opacity-60" : ""
          }`}
      >
        <AnimatePresence>
          {justReserved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-primary/90"
            >
              <div className="text-center text-primary-foreground">
                <PartyPopper className="mx-auto mb-2 h-12 w-12" />
                <p className="text-lg font-bold">Réservé !</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <CardContent className="p-5">
          {/* Status badge */}
          <div className="mb-4 flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusConfig.color}`}>
              <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
              {statusConfig.label}
            </span>
            {lot.created_at && new Date(lot.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
              <span className="rounded-full bg-sky/20 px-2 py-0.5 text-xs font-medium text-sky">
                ✨ Nouveau
              </span>
            )}
          </div>

          {/* Icon & title */}
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-2xl">
              {lot.icone}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 truncate text-lg font-bold">{lot.nom}</h3>
              {lot.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {lot.description}
                </p>
              )}
            </div>
          </div>

          {/* Owner info */}
          {!isOwner && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted/50 p-2">
              <span className="text-lg">{lot.parent?.emoji || "😊"}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  Proposé par {lot.parent?.prenom || "Anonyme"}
                </p>
              </div>
            </div>
          )}

          {/* Reserved by info */}
          {lot.statut === "reserve" && lot.reserver && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2">
              <span className="text-lg">{lot.reserver.emoji}</span>
              <p className="text-sm">
                Réservé par <span className="font-medium">{lot.reserver.prenom}</span>
                {isReserver && <span className="text-amber-600"> (vous)</span>}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {canReserve && (
              <Button
                variant="hero"
                size="sm"
                className="flex-1 gap-2"
                onClick={handleReserve}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Réserver
              </Button>
            )}

            {lot.statut === "reserve" && currentParticipant && !isOwner && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleContact}
                disabled={contactLoading}
              >
                {contactLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                Contacter
              </Button>
            )}

            {isOwner && lot.statut === "reserve" && (
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={handleMarkAsRemis}
                disabled={remisLoading}
              >
                {remisLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Gift className="h-4 w-4" />
                )}
                Marquer remis
              </Button>
            )}

            {isOwner && (
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
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

            {isOwner && lot.statut === "disponible" && !isOwner && !canReserve && (
              <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                En attente de réservation
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
