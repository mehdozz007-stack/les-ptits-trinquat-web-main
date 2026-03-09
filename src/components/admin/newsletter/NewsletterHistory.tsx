import { useEffect, useState } from "react";
import { useNewsletterAdmin } from "@/hooks/useNewsletterAdmin";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Send, Eye, Loader2 } from "lucide-react";

export function NewsletterHistory() {
  const { newsletters, isLoading, refreshData } = useNewsletterAdmin();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const handleSend = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir envoyer cette newsletter ?")) {
      return;
    }

    setIsSending(id);
    try {
      const newsletter = newsletters.find(n => n.id === id);
      if (!newsletter) {
        throw new Error('Newsletter not found');
      }

      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification non trouvé. Veuillez vous reconnecter.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/newsletter/admin/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newsletter.title || 'Newsletter',
          subject: newsletter.subject || '',
          content: newsletter.content || '',
          preview_text: newsletter.preview_text || newsletter.content.substring(0, 100),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }

      toast({
        title: "Succès",
        description: "Newsletter envoyée avec succès !",
      });
      refreshData();
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible d'envoyer la newsletter",
        variant: "destructive",
      });
    } finally {
      setIsSending(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette newsletter ?")) {
      return;
    }

    setIsDeleting(id);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/newsletter/admin/newsletters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast({
        title: "Succès",
        description: "Newsletter supprimée avec succès",
      });
      refreshData();
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de supprimer la newsletter",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Historique des newsletters</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Total: {newsletters.length} newsletter(s)
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement des newsletters...
        </div>
      ) : newsletters.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucune newsletter créée
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsletters.map((newsletter) => (
                  <TableRow key={newsletter.id}>
                    <TableCell className="font-semibold">
                      {newsletter.title}
                    </TableCell>
                    <TableCell className="text-sm">{newsletter.subject}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${newsletter.status === "sent"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {newsletter.status === "sent" ? "Envoyée" : "Brouillon"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {newsletter.recipients_count || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(newsletter.created_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedPreview(
                              selectedPreview === newsletter.id
                                ? null
                                : newsletter.id
                            )
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {newsletter.status === "draft" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSend(newsletter.id)}
                            disabled={isSending === newsletter.id}
                            className="text-green-600 hover:text-green-700"
                          >
                            {isSending === newsletter.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(newsletter.id)}
                          disabled={isDeleting === newsletter.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          {isDeleting === newsletter.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {selectedPreview && newsletters.find((n) => n.id === selectedPreview) && (
            <div className="border rounded-lg p-6 bg-white space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Aperçu: {newsletters.find((n) => n.id === selectedPreview)?.title}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPreview(null)}
                >
                  Fermer
                </Button>
              </div>

              <div>
                <p className="text-sm font-semibold">Sujet:</p>
                <p className="text-sm text-muted-foreground">
                  {newsletters.find((n) => n.id === selectedPreview)?.subject}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Contenu:</p>
                <div
                  className="prose prose-sm max-w-none border rounded p-4 bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: newsletters.find((n) => n.id === selectedPreview)?.content || '' }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
