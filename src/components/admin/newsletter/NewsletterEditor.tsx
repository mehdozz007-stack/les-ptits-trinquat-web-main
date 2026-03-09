import { useState } from "react";
import { useNewsletterAdmin } from "@/hooks/useNewsletterAdmin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Send, Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { renderNewsletterEmail } from "@/lib/emailTemplate";

export function NewsletterEditor() {
  const { saveNewsletter, activeSubscribersCount, refreshData } = useNewsletterAdmin();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    content: "",
    previewText: "",
  });
  const [showPreview, setShowPreview] = useState(false);

  const isValid = formData.title.trim() && formData.subject.trim() && formData.content.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setSuccess(false);

    try {
      const result = await saveNewsletter(
        formData.title,
        formData.subject,
        formData.content,
        formData.previewText
      );

      if (result) {
        setSuccess(true);
        setFormData({ title: "", subject: "", content: "", previewText: "" });

        toast({
          title: "Succès",
          description: "Brouillon enregistré avec succès",
        });

        // Masquer le message de succès après 3 secondes
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error creating newsletter:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le brouillon",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleTestEmail = async () => {
    if (!isValid) return;

    setIsTesting(true);
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification non trouvé. Veuillez vous reconnecter.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/newsletter/admin/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          subject: formData.subject,
          content: formData.content,
          preview_text: formData.previewText || formData.content.substring(0, 100),
          recipient_email: formData.testEmail || 'mehdozz007@gmail.com',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi du test');
      }

      toast({
        title: "Email de test envoyé",
        description: `Le test a été envoyé à ${result.data?.testEmail || formData.testEmail}`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email de test.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!isValid || activeSubscribersCount === 0) return;

    setIsSending(true);
    try {
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
          title: formData.title,
          subject: formData.subject,
          content: formData.content,
          preview_text: formData.previewText || formData.content.substring(0, 100),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur inconnue');
      }

      toast({
        title: "Newsletter envoyée",
        description: `Votre newsletter a été envoyée à ${result.data?.sent || activeSubscribersCount} abonnés.`,
      });

      // Reset form
      setFormData({ title: "", subject: "", content: "", previewText: "" });
      refreshData();
    } catch (error: any) {
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer la newsletter.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Créer une newsletter</h2>
        <p className="text-sm text-gray-600">Abonnés actifs: {activeSubscribersCount}</p>
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
            Texte de prévisualisation (optionnel)
          </label>
          <Input
            value={formData.previewText}
            onChange={(e) =>
              setFormData({ ...formData, previewText: e.target.value })
            }
            placeholder="Texte qui apparaît dans la prévisualisation (100 premiers caractères par défaut)"
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

        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Brouillon enregistré avec succès !</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            disabled={!isValid}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Masquer" : "Afficher"} l'aperçu
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleTestEmail}
            disabled={!isValid || isTesting}
          >
            {isTesting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Envoyer un test
          </Button>

          <Button
            type="submit"
            disabled={isCreating}
            variant="outline"
          >
            {isCreating ? "Création..." : "Enregistrer le brouillon"}
          </Button>

          <Button
            type="button"
            onClick={handleSendNewsletter}
            disabled={!isValid || activeSubscribersCount === 0 || isSending}
            variant="default"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Envoyer à {activeSubscribersCount} abonnés
          </Button>
        </div>
      </form>

      {showPreview && formData.content && (
        <div className="border rounded-lg bg-white space-y-4">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-lg font-semibold">Aperçu du rendu email</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(false)}
            >
              Fermer
            </Button>
          </div>

          <iframe
            srcDoc={renderNewsletterEmail({
              title: formData.title,
              previewText: formData.previewText || formData.content.substring(0, 100),
              content: formData.content,
              firstName: "Cher parent",
            })}
            className="w-full h-[600px] border border-gray-200"
            title="Email preview"
            style={{ backgroundColor: "#f5f5f5", margin: "0" }}
          />
        </div>
      )}
    </div>
  );
}
