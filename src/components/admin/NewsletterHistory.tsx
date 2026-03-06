import { motion } from "framer-motion";
import { History, Send, FileText, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Newsletter } from "@/hooks/useNewsletterAdmin";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";

interface NewsletterHistoryProps {
  newsletters?: Newsletter[];
  onDelete?: (id: string) => void;
}

// Détecte si on est sur mobile pour optimiser les animations
const isMobileDevice = () => typeof window !== "undefined" && window.innerWidth < 640;

export function NewsletterHistory({ newsletters = [], onDelete }: NewsletterHistoryProps = {}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const sentNewsletters = newsletters.filter((n) => n.status === "sent");
  const draftNewsletters = newsletters.filter((n) => n.status === "draft");

  // Désactiver les animations sur mobile pour éviter le scroll anchoring
  const animationVariants = isMobile ? {} : {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="shadow-sm border-orange-100/50 bg-white/60 backdrop-blur-sm hover:shadow-md transition-shadow" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] bg-clip-text text-transparent" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
            <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0">
              <History className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <span className="truncate">Historique des newsletters</span>
          </CardTitle>
          <CardDescription style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm mt-2">
            <strong className="text-[#FF7B42]">{sentNewsletters.length}</strong> newsletters envoyées, <strong>{draftNewsletters.length}</strong> brouillons
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {newsletters.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-30" />
              <p style={{ fontFamily: "'Nunito', sans-serif" }} className="text-sm sm:text-base">Aucune newsletter pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {newsletters.map((newsletter, index) => (
                <motion.div
                  key={newsletter.id}
                  {...animationVariants}
                  className="p-3 sm:p-4 rounded-xl border border-orange-100/50 bg-white/60 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base truncate text-gray-800" style={{ fontFamily: "'Nunito', sans-serif" }}>{newsletter.title}</h4>
                        <Badge
                          variant={newsletter.status === "sent" ? "default" : "secondary"}
                          className={newsletter.status === "sent" ? "bg-gradient-to-r from-[#FF7B42] to-[#FF9A6A] text-white hover:opacity-90 text-xs mt-1" : "bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs mt-1"}
                        >
                          {newsletter.status === "sent" ? (
                            <>
                              <Send className="h-3 w-3 mr-1" />
                              Envoyée
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Brouillon
                            </>
                          )}
                        </Badge>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-[#C55FA8] hover:bg-rose-50/50 h-8 w-8 p-0 mt-1 flex-shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[95vw] sm:w-auto">
                          <AlertDialogHeader>
                            <AlertDialogTitle style={{ fontFamily: "'Nunito', sans-serif" }} className="text-base sm:text-lg">Supprimer cette newsletter ?</AlertDialogTitle>
                            <AlertDialogDescription style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm">
                              Cette action supprimera définitivement cette newsletter de l'historique.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                            <AlertDialogCancel className="text-xs sm:text-sm">Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete?.(newsletter.id)}
                              className="text-xs sm:text-sm bg-gradient-to-r from-[#C55FA8] to-[#FF9A6A] text-white hover:opacity-90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        <strong>Objet :</strong> {newsletter.subject}
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        {newsletter.status === "sent" && newsletter.sent_at ? (
                          <>
                            Envoyée le {format(new Date(newsletter.sent_at), "dd MMM yyyy à HH:mm", { locale: fr })}
                            {newsletter.recipients_count && (
                              <> • {newsletter.recipients_count} destinataires</>
                            )}
                          </>
                        ) : (
                          <>
                            Créée le {format(new Date(newsletter.created_at), "dd MMM yyyy à HH:mm", { locale: fr })}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
