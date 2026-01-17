import { useEffect, useState } from "react";
import { useNewsletterAdmin } from "@/hooks/admin/useNewsletterAdmin";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Trash2, Send, Eye } from "lucide-react";

export function NewsletterHistory() {
  const { newsletters, isLoading, error, fetchNewsletters, deleteNewsletter, sendNewsletter } =
    useNewsletterAdmin();
  const [isSending, setIsSending] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsletters();
  }, [fetchNewsletters]);

  const handleSend = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir envoyer cette newsletter ?")) {
      return;
    }

    setIsSending(id);
    try {
      await sendNewsletter(id);
      alert("Newsletter envoyée avec succès !");
    } catch (err) {
      console.error("Error sending newsletter:", err);
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
      await deleteNewsletter(id);
    } catch (err) {
      console.error("Error deleting newsletter:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const selectedNewsletter = selectedPreview
    ? newsletters.find((n) => n.id === selectedPreview)
    : null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Historique des newsletters</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Total: {newsletters.length} newsletter(s)
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-8">Chargement des newsletters...</div>
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
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          newsletter.status === "sent"
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
                            <Send className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(newsletter.id)}
                          disabled={isDeleting === newsletter.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {selectedNewsletter && (
            <div className="border rounded-lg p-6 bg-white space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Aperçu: {selectedNewsletter.title}
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
                  {selectedNewsletter.subject}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Contenu:</p>
                <div
                  className="prose prose-sm max-w-none border rounded p-4 bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
