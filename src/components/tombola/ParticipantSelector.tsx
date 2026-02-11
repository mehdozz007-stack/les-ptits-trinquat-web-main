import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TombolaParticipantPublic, useTombolaParticipants } from "@/hooks/useTombolaParticipants";

interface ParticipantSelectorProps {
  currentParticipant: TombolaParticipantPublic | null;
  onSelect: (participant: TombolaParticipantPublic | null) => void;
}

const STORAGE_KEY = "tombola_current_participant";

export function ParticipantSelector({ currentParticipant, onSelect }: ParticipantSelectorProps) {
  const { participants } = useTombolaParticipants();
  const [isOpen, setIsOpen] = useState(false);

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
                    <button
                      key={participant.id}
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
                      {currentParticipant?.id === participant.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
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
            className={`gap-2 rounded-full shadow-lg ${!currentParticipant ? 'bg-muted' : ''}`}
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
