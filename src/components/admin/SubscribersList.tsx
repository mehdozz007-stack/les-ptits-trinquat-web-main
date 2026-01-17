import { motion } from "framer-motion";
import { Search, Users, UserCheck, UserX, Trash2, Mail, Download } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Subscriber } from "@/hooks/useNewsletterAdmin";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SubscribersListProps {
  subscribers: Subscriber[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCount: number;
  totalCount: number;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export function SubscribersList({
  subscribers,
  searchQuery,
  onSearchChange,
  activeCount,
  totalCount,
  onToggleStatus,
  onDelete,
}: SubscribersListProps) {
  const exportToCSV = () => {
    const headers = ["Prénom", "Email", "Date d'inscription", "Statut"];
    const rows = subscribers.map((sub) => [
      sub.first_name || "",
      sub.email,
      new Date(sub.created_at).toLocaleDateString("fr-FR"),
      sub.is_active ? "Actif" : "Désinscrit",
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(";")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `abonnes-newsletter-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV téléchargé");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-primary" />
                Liste des abonnés
              </CardTitle>
              <CardDescription className="mt-1">
                {activeCount} abonnés actifs sur {totalCount} inscrits
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <UserCheck className="h-3 w-3" />
                {activeCount} actifs
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <UserX className="h-3 w-3" />
                {totalCount - activeCount} désinscrits
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={subscribers.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par email ou prénom..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {subscribers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun abonné trouvé</p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Inscrit le</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber, index) => (
                    <motion.tr
                      key={subscriber.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {subscriber.first_name || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {subscriber.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(subscriber.created_at), "dd MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={subscriber.is_active ? "default" : "secondary"}
                          className={subscriber.is_active ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                        >
                          {subscriber.is_active ? "Actif" : "Désinscrit"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleStatus(subscriber.id, subscriber.is_active)}
                          >
                            {subscriber.is_active ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cet abonné ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. L'abonné sera définitivement supprimé de la liste.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(subscriber.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
