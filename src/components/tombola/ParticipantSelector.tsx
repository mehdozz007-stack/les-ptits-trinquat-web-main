import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TombolaParticipantPublic, useTombolaParticipants } from "@/hooks/useTombolaParticipants";

interface ParticipantSelectorProps {
  currentParticipant: TombolaParticipantPublic | null;
  onSelect: (participant: TombolaParticipantPublic | null) => void;
}

const STORAGE_KEY = "tombola_current_participant";

export function ParticipantSelector({ currentParticipant, onSelect }: ParticipantSelectorProps) {
  const { participants, deleteParticipant } = useTombolaParticipants();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (savedId && participants.length > 0) {
      const found = participants.find((p) => p.id === savedId);
      if (found) {
        onSelect(found);
      }
    }
  }, [participants, onSelect]);

  const handleSelect = (participant: TombolaParticipantPublic) => {
    onSelect(participant);
    localStorage.setItem(STORAGE_KEY, participant.id);
    setIsOpen(false);
  };

  const handleDeleteClick = (participantId: string) => {
    setDeleteConfirm(participantId);
  };

  const handleConfirmDelete = async (participantId: string) => {
    setDeleting(true);
    const result = await deleteParticipant(participantId);

    setDeleting(false);

    if (result.success) {
      if (currentParticipant?.id === participantId) {
        onSelect(null);
        localStorage.removeItem(STORAGE_KEY);
      }
      setDeleteConfirm(null);

      // Rafraîchir la page pour voir les changements
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      alert(`Erreur: ${result.error}`);
    }
  };

  const handleClear = () => {
    onSelect(null);
    localStorage.removeItem(STORAGE_KEY);
    setIsOpen(false);
  };

  if (participants.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 md:bottom-6 md:left-6">
      <div className="relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-2 w-72"
            >
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="max-h-64 overflow-y-auto p-2">
                  <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                    Qui êtes-vous ?
                  </p>
                  {participants.map((participant) => (
                    <div key={participant.id}>
                      {deleteConfirm === participant.id ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-2">
                          <p className="text-sm font-medium text-red-900">
                            Êtes-vous sûr de vouloir supprimer ce compte? Tous ses lots seront aussi supprimés.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleConfirmDelete(participant.id)}
                              disabled={deleting}
                              className="flex-1 rounded px-2 py-1 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              {deleting ? "Suppression..." : "Confirmer"}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              disabled={deleting}
                              className="flex-1 rounded px-2 py-1 text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelect(participant)}
                          className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${currentParticipant?.id === participant.id
                            ? "bg-primary/10"
                            : "hover:bg-muted"
                            }`}
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl">
                            {participant.emoji}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{participant.prenom}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {participant.role}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {currentParticipant?.id === participant.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(participant.id);
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Supprimer le compte"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                  {currentParticipant && (
                    <button
                      onClick={handleClear}
                      className="mt-2 w-full rounded-lg border border-dashed border-muted-foreground/30 p-2 text-center text-sm text-muted-foreground hover:bg-muted"
                    >
                      Se déconnecter
                    </button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={currentParticipant ? "default" : "outline"}
            size="lg"
            onClick={() => setIsOpen(!isOpen)}
            className="gap-2 rounded-full shadow-lg"
          >
            {currentParticipant ? (
              <>
                <span className="text-lg">{currentParticipant.emoji}</span>
                <span className="hidden md:inline">{currentParticipant.prenom}</span>
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Qui êtes-vous ?</span>
              </>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
