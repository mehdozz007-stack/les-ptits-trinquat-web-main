import { useEffect, useState } from "react";
import { useNewsletterAdmin } from "@/hooks/useNewsletterAdmin";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  Loader2,
} from "lucide-react";

export function SubscribersList() {
  const { subscribers, isLoading, deleteSubscriber, toggleSubscriberStatus, fetchSubscribers } =
    useNewsletterAdmin();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.first_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet abonné ?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteSubscriber(id);
      toast({
        title: "Succès",
        description: "Abonné supprimé avec succès",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de supprimer l'abonné",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsTogglingStatus(id);
    try {
      await toggleSubscriberStatus(id, !currentStatus);
      toast({
        title: "Succès",
        description: currentStatus ? "Abonné désactivé" : "Abonné activé",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de modifier le statut",
        variant: "destructive",
      });
    } finally {
      setIsTogglingStatus(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Abonnés à la newsletter</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Total: {subscribers.length} abonné(s)
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <Search className="w-4 h-4 mt-3 text-muted-foreground" />
        <Input
          placeholder="Rechercher par email ou nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement des abonnés...
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun abonné trouvé
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-mono text-sm">{sub.email}</TableCell>
                  <TableCell>{sub.first_name || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleStatus(sub.id, sub.is_active)
                        }
                        disabled={isTogglingStatus === sub.id}
                      >
                        {isTogglingStatus === sub.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : sub.is_active ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-green-600 mr-2" />
                            Actif
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-gray-400 mr-2" />
                            Inactif
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(sub.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sub.id)}
                      disabled={isDeleting === sub.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      {isDeleting === sub.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
