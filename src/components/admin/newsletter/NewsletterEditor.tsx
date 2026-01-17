import { useState } from "react";
import { useNewsletterAdmin } from "@/hooks/admin/useNewsletterAdmin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";

interface NewsletterEditorProps {
  onNewsletterCreated?: () => void;
}

export function NewsletterEditor({ onNewsletterCreated }: NewsletterEditorProps) {
  const { createNewsletter, sendNewsletter, error } = useNewsletterAdmin();
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    content: "",
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setSuccess(false);

    try {
      await createNewsletter(
        formData.title,
        formData.subject,
        formData.content
      );
      setSuccess(true);
      setFormData({ title: "", subject: "", content: "" });
      onNewsletterCreated?.();

      // Masquer le message de succès après 3 secondes
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating newsletter:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Créer une newsletter</h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Newsletter créée avec succès !</AlertDescription>
          </Alert>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Titre</label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Ex: Janvier 2026 - Actualités de l'école"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Sujet (pour l'email)
          </label>
          <Input
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            placeholder="Ex: Actualités de janvier 2026"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Contenu (HTML autorisé)
          </label>
          <Textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Écrivez votre contenu ici. Vous pouvez utiliser du HTML."
            required
            rows={12}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Masquer" : "Afficher"} l'aperçu
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Création..." : "Créer le brouillon"}
          </Button>
        </div>
      </form>

      {showPreview && formData.content && (
        <div className="border rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">Aperçu</h3>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formData.content }}
          />
        </div>
      )}
    </div>
  );
}
