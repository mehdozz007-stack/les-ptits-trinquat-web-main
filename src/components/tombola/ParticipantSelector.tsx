import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TombolaParticipantPublic, useTombolaParticipants } from "@/hooks/useTombolaParticipants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGlobalRefresh } from "@/context/TombolaRefreshContext";

interface ParticipantSelectorProps {
  currentParticipant: TombolaParticipantPublic | null;
  onSelect: (participant: TombolaParticipantPublic | null) => void;
}

const STORAGE_KEY = "tombola_current_participant";

export function ParticipantSelector({ currentParticipant, onSelect }: ParticipantSelectorProps) {
  const { user, token, logout } = useCurrentUser();
  const { participants, fetchMyParticipants, loading } = useTombolaParticipants(false); // false = ne charger que mes participants
  const { refreshKey } = useGlobalRefresh();
  const [isOpen, setIsOpen] = useState(false);

  // Charger les participants personnels quand on a un token
  useEffect(() => {
    if (token) {
      // Vider localStorage à chaque changement de token (nouvel utilisateur)
      localStorage.removeItem(STORAGE_KEY);
      onSelect(null);
      // Puis charger les participants du nouvel utilisateur
      fetchMyParticipants(token);
    } else {
      // Nettoyer si pas de token (déconnexion)
      localStorage.removeItem(STORAGE_KEY);
      onSelect(null);
    }
  }, [token, fetchMyParticipants, onSelect]);

  // Recharger les participants quand un refresh global est déclenché
  useEffect(() => {
    if (token && refreshKey) {
      fetchMyParticipants(token);
    }
  }, [refreshKey, token, fetchMyParticipants]);

  // Load from localStorage on mount and validate it belongs to current user
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (savedId && participants.length > 0) {
      const found = participants.find((p) => p.id === savedId);
      if (found) {
        onSelect(found);
      } else {
        // Participant sauvegardé n'existe plus pour cet utilisateur - nettoyer
        localStorage.removeItem(STORAGE_KEY);
        onSelect(null);
      }
    }
  }, [participants, onSelect]);

  const handleSelect = (participant: TombolaParticipantPublic) => {
    onSelect(participant);
    localStorage.setItem(STORAGE_KEY, participant.id);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem(STORAGE_KEY);
    onSelect(null);
  };

  // Non authentifié
  if (!user || !token) {
    return null;
  }

  // Authentifié mais pas de participants
  if (participants.length === 0) {
    return (
      <div className="fixed bottom-4 left-4 z-50 md:bottom-6 md:left-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-full shadow-lg text-xs md:gap-2 md:text-base"
            disabled
          >
            <span>Inscrivez-vous</span>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 md:bottom-6 md:left-6">
      <div className="relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-2 w-56 md:w-72"
            >
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="max-h-48 overflow-y-auto p-1.5 md:max-h-64 md:p-2">
                  <p className="mb-1.5 px-1 text-xs font-medium text-muted-foreground md:mb-2 md:px-2">
                    Mes participants
                  </p>
                  {loading ? (
                    <p className="p-2 text-center text-sm text-muted-foreground">Chargement...</p>
                  ) : participants.length === 0 ? (
                    <p className="p-2 text-center text-sm text-muted-foreground">
                      Aucun participant créé
                    </p>
                  ) : (
                    participants.map((participant) => (
                      <button
                        key={participant.id}
                        onClick={() => handleSelect(participant)}
                        className={`flex w-full items-center gap-2 rounded-lg p-1.5 text-left transition-colors md:gap-3 md:p-2 ${currentParticipant?.id === participant.id
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                          }`}
                      >
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-lg md:h-10 md:w-10 md:text-xl">
                          {participant.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium md:text-base">
                            {participant.prenom}
                          </p>
                        </div>
                        {currentParticipant?.id === participant.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))
                  )}
                  <div className="mt-1.5 border-t pt-1.5 md:mt-2 md:pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-destructive/30 p-1.5 text-center text-xs text-destructive hover:bg-destructive/5 md:gap-2 md:p-2 md:text-sm"
                    >
                      <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      Se déconnecter
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={currentParticipant ? "default" : "outline"}
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="gap-1.5 rounded-full shadow-lg text-xs md:gap-2 md:text-base"
          >
            {currentParticipant ? (
              <>
                <span className="text-base md:text-lg">{currentParticipant.emoji}</span>
                <span className="hidden sm:inline">{currentParticipant.prenom}</span>
              </>
            ) : (
              <span>Se connecter</span>
            )}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform md:h-4 md:w-4 ${isOpen ? "rotate-180" : ""
                }`}
            />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
