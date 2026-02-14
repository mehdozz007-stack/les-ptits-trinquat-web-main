import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, Loader2, PartyPopper, Trash2, Gift, RotateCcw, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  const { reserveLot, getContactLink, getReserverContactLink, deleteLot, markAsRemis, markAsAvailable, lots } = useTombolaLots();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [remisLoading, setRemisLoading] = useState(false);
  const [availableLoading, setAvailableLoading] = useState(false);
  const [justReserved, setJustReserved] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<{
    email: string;
    prenom: string;
    message: string;
  } | null>(null);

  const statusConfig = STATUS_CONFIG[lot.statut as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.disponible;
  const isOwner = currentParticipant?.id === lot.parent_id;
  const isReserver = currentParticipant?.id === lot.reserved_by;

  // Compter les lots déjà réservés par l'utilisateur actuel
  const userReservationCount = lots.filter(l => l.reserved_by === currentParticipant?.id).length;
  const hasReachedReservationLimit = userReservationCount >= 2;
  const canReserve = lot.statut === "disponible" && currentParticipant && !isOwner && !hasReachedReservationLimit;

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

    // Dispatch event pour rafraîchir la liste des lots
    window.dispatchEvent(new Event('lotActionCompleted'));

    setTimeout(() => setJustReserved(false), 3000);
  };

  const handleContact = async () => {
    if (!currentParticipant) return;

    setContactLoading(true);
    const mailtoLink = await getContactLink(lot.id, currentParticipant.prenom);
    setContactLoading(false);

    if (!mailtoLink) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations de contact.",
        variant: "destructive",
      });
      return;
    }

    // Extract email and name from mailto link
    // Format: mailto:email@example.com?subject=...&body=...
    const urlParams = new URLSearchParams(mailtoLink.replace('mailto:', '').split('?')[1]);
    const email = mailtoLink.split('?')[0].replace('mailto:', '');
    const subject = urlParams.get('subject') || '';
    const body = urlParams.get('body') || '';

    // Try to open mailto first (for users with email clients configured)
    const mailWindow = window.open(mailtoLink, '_blank');

    // If email client didn't open, show fallback modal
    // We detect this with a small delay - if the window is blocked/nothing happens
    setTimeout(() => {
      // Always show the modal as a backup option for Apple/Safari users
      setContactInfo({
        email,
        prenom: lot.parent?.prenom || 'au propriétaire',
        message: body,
      });
      setContactModalOpen(true);
    }, 100);
  };

  const handleContactReserver = async () => {
    if (!currentParticipant || !lot.reserver) return;

    setContactLoading(true);
    const mailtoLink = await getReserverContactLink(lot.id, currentParticipant.prenom);
    setContactLoading(false);

    if (!mailtoLink) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations de contact.",
        variant: "destructive",
      });
      return;
    }

    // Extract email and name from mailto link
    const urlParams = new URLSearchParams(mailtoLink.replace('mailto:', '').split('?')[1]);
    const email = mailtoLink.split('?')[0].replace('mailto:', '');
    const subject = urlParams.get('subject') || '';
    const body = urlParams.get('body') || '';

    // Try to open mailto first
    const mailWindow = window.open(mailtoLink, '_blank');

    // Show fallback modal as backup option
    setTimeout(() => {
      setContactInfo({
        email,
        prenom: lot.reserver?.prenom || 'au reserver',
        message: body,
      });
      setContactModalOpen(true);
    }, 100);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié ! ✅",
        description: `${label} copié dans le presse-papiers.`,
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      toast({
        title: "Copié ! ✅",
        description: `${label} copié dans le presse-papiers.`,
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

    // Dispatch event pour rafraîchir la liste des lots
    window.dispatchEvent(new Event('lotActionCompleted'));
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

    // Dispatch event pour rafraîchir la liste des lots
    window.dispatchEvent(new Event('lotActionCompleted'));
  };

  const handleMarkAsAvailable = async () => {
    if (!isOwner) return;

    setAvailableLoading(true);
    const { error } = await markAsAvailable(lot.id);
    setAvailableLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de remettre le lot disponible.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Lot remis disponible ! ✨",
      description: "Le lot est à nouveau disponible à la réservation.",
    });

    // Dispatch event pour rafraîchir la liste des lots
    window.dispatchEvent(new Event('lotActionCompleted'));
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

        <CardContent className="p-5 flex flex-col h-full">
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
                  Proposé par {lot.parent?.prenom}
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
            {/* LOT DISPONIBLE - Everyone (except owner) can reserve */}
            {lot.statut === "disponible" && currentParticipant && !isOwner && (
              hasReachedReservationLimit ? (
                <p className="flex flex-1 items-center justify-center text-sm text-amber-700 bg-amber-50 p-3 rounded-lg font-medium">
                  ⚠️ Limite atteinte (2 max)
                </p>
              ) : (
                <motion.div className="flex-1">
                  <Button
                    size="sm"
                    className="w-full gap-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 border-0"
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
                </motion.div>
              )
            )}

            {/* LOT AVAILABLE - Show message if no participant selected */}
            {lot.statut === "disponible" && !currentParticipant && (
              <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Sélectionnez votre profil pour réserver
              </p>
            )}

            {/* LOT RESERVED - Reserver can contact owner */}
            {lot.statut === "reserve" && isReserver && (
              <div className="flex justify-center flex-1">
                <Button
                  size="sm"
                  className="w-full gap-2 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-pink-500/50 transition-all duration-300 border-0"
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
              </div>
            )}

            {/* LOT RESERVED - Owner can mark as delivered, make available again, or delete */}
            {lot.statut === "reserve" && isOwner && (
              <div className="flex justify-center gap-2 flex-1 flex-wrap">
                <Button
                  size="sm"
                  className="flex-1 min-w-[120px] gap-2 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-pink-500/50 transition-all duration-300 border-0"
                  onClick={handleContactReserver}
                  disabled={contactLoading}
                  title="Contacter celui qui a réservé"
                >
                  {contactLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  Contacter
                </Button>
                <Button
                  size="sm"
                  className="flex-1 min-w-[120px] gap-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 border-0"
                  onClick={handleMarkAsAvailable}
                  disabled={availableLoading}
                  title="Rendre ce lot disponible à la réservation"
                >
                  {availableLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4" />
                  )}
                  Remettre dispo
                </Button>
                <Button
                  size="sm"
                  className="flex-1 min-w-[120px] gap-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 border-0"
                  onClick={handleMarkAsRemis}
                  disabled={remisLoading}
                >
                  {remisLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Gift className="h-4 w-4" />
                  )}
                  Remis
                </Button>
                <Button
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
              </div>
            )}

            {/* LOT RESERVED - Other participants see nothing */}
            {lot.statut === "reserve" && !isReserver && !isOwner && (
              <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Lot réservé
              </p>
            )}

            {/* LOT AVAILABLE - Owner can only delete */}
            {lot.statut === "disponible" && isOwner && (
              <div className="flex w-full items-center justify-center md:mt-auto md:pt-4">
                <Button
                  size="sm"
                  className="w-full gap-2 bg-gradient-to-r from-red-500 via-orange-500 to-rose-500 hover:from-red-600 hover:via-orange-600 hover:to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 border-0"
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
              </div>
            )}

            {/* LOT DELIVERED - No actions, visible only for owner and reserver */}
            {lot.statut === "remis" && !isOwner && !isReserver && (
              <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Lot remis
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Modal - Alternative to mailto for Apple/Safari users */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>📧 Contacter {contactInfo?.prenom}</DialogTitle>
            <DialogDescription>
              Copiez l&apos;email ou le message pour contacter le propriétaire du lot.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Email Section */}
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Email du propriétaire</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all rounded bg-background px-2 py-1 text-sm font-mono">
                  {contactInfo?.email}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0 gap-1"
                  onClick={() => contactInfo?.email && copyToClipboard(contactInfo.email, "Email")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Message Section */}
            {contactInfo?.message && (
              <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
                <p className="mb-2 text-sm font-medium text-muted-foreground">Message pré-rédigé</p>
                <div className="max-h-32 space-y-2 overflow-y-auto rounded bg-background p-2">
                  <p className="whitespace-pre-wrap break-words text-sm">{contactInfo.message}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 gap-1 w-full"
                  onClick={() => contactInfo.message && copyToClipboard(contactInfo.message, "Message")}
                >
                  <Copy className="h-4 w-4" />
                  Copier le message
                </Button>
              </div>
            )}

            {/* Instructions */}
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs text-amber-900">
                💡 <strong>Conseil :</strong> Si vous avez un client email configuré, vous pouvez aussi utiliser le bouton &quot;Contacter&quot; directement pour ouvrir votre application de messagerie.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
