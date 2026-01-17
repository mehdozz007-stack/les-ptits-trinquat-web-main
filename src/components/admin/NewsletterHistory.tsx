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

interface NewsletterHistoryProps {
  newsletters: Newsletter[];
  onDelete: (id: string) => void;
}

export function NewsletterHistory({ newsletters, onDelete }: NewsletterHistoryProps) {
  const sentNewsletters = newsletters.filter((n) => n.status === "sent");
  const draftNewsletters = newsletters.filter((n) => n.status === "draft");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <History className="h-5 w-5 text-primary" />
            Historique des newsletters
          </CardTitle>
          <CardDescription>
            {sentNewsletters.length} newsletters envoyées, {draftNewsletters.length} brouillons
          </CardDescription>
        </CardHeader>
        <CardContent>
          {newsletters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune newsletter pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {newsletters.map((newsletter, index) => (
                <motion.div
                  key={newsletter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl border bg-card hover:shadow-soft transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium truncate">{newsletter.title}</h4>
                        <Badge
                          variant={newsletter.status === "sent" ? "default" : "secondary"}
                          className={newsletter.status === "sent" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
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
                      <p className="text-sm text-muted-foreground mb-1">
                        Objet : {newsletter.subject}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-4">
                        {newsletter.status === "sent" && newsletter.sent_at ? (
                          <>
                            <span>
                              Envoyée le {format(new Date(newsletter.sent_at), "dd MMM yyyy à HH:mm", { locale: fr })}
                            </span>
                            <span>{newsletter.recipients_count} destinataires</span>
                          </>
                        ) : (
                          <span>
                            Créée le {format(new Date(newsletter.created_at), "dd MMM yyyy à HH:mm", { locale: fr })}
                          </span>
                        )}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette newsletter ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action supprimera définitivement cette newsletter de l'historique.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(newsletter.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
