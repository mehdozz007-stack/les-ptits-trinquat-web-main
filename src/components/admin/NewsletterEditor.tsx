import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Eye, Save, FileText, Loader2, Send as SendIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { newsletterApi } from "@/lib/api";
import { renderNewsletterEmail } from "@/lib/emailTemplate";

interface NewsletterEditorProps {
  activeSubscribersCount?: number;
  onSave?: (newsletter: { title: string; subject: string; content: string }) => Promise<any>;
  onRefresh?: () => void;
}

export function NewsletterEditor({ activeSubscribersCount = 0, onSave, onRefresh }: NewsletterEditorProps = {}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTestSending, setIsTestSending] = useState(false);
  const { toast } = useToast();

  const isValid = title.trim() && subject.trim() && content.trim();

  const handleSave = async () => {
    if (!isValid) return;
    setIsSaving(true);
    await onSave?.({ title, subject, content });
    setIsSaving(false);
  };

  const handleTestEmail = async () => {
    if (!isValid) return;

    setIsTestSending(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/newsletter/admin/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          subject,
          content,
          preview_text: previewText || content.substring(0, 100),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi du test');
      }

      toast({
        title: "Email de test envoyé",
        description: `Le test a été envoyé à ${result.data?.testEmail || 'votre adresse email'}`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email de test.",
        variant: "destructive",
      });
    } finally {
      setIsTestSending(false);
    }
  };

  const handleSend = async () => {
    if (!isValid || activeSubscribersCount === 0) return;

    setIsSending(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/newsletter/admin/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          subject,
          content,
          preview_text: previewText || content.substring(0, 100),
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
      setTitle("");
      setSubject("");
      setContent("");
      setPreviewText("");
      onRefresh?.();
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Rédiger une newsletter
          </CardTitle>
          <CardDescription>
            Créez et envoyez une newsletter à {activeSubscribersCount} abonnés actifs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre interne (usage admin)</Label>
            <Input
              id="title"
              placeholder="Ex: Newsletter de janvier 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Objet de l'email</Label>
            <Input
              id="subject"
              placeholder="Ex: Les actualités de l'école ce mois-ci"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preview">Texte de prévisualisation (optionnel)</Label>
            <Textarea
              id="preview"
              placeholder="Texte qui apparaît dans la prévisualisation de l'email (si vide, les 100 premiers caractères du contenu seront utilisés)"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="h-[60px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu de la newsletter</Label>
            <Textarea
              id="content"
              placeholder="Écrivez le contenu de votre newsletter ici..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-y"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={!isValid || isSaving}
              size="sm"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">Brouillon</span>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!isValid} size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Aperçu</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Prévisualisation de la newsletter</DialogTitle>
                  <DialogDescription>
                    Voici comment apparaîtra votre newsletter dans les clients email
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <iframe
                    srcDoc={renderNewsletterEmail({
                      title,
                      previewText: previewText || content.substring(0, 100),
                      content,
                      firstName: "Cher parent",
                    })}
                    className="w-full h-[600px] border border-gray-200 rounded-lg"
                    title="Email preview"
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="secondary"
              onClick={handleTestEmail}
              disabled={!isValid || isTestSending}
              size="sm"
            >
              {isTestSending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">Test</span>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="playful"
                  disabled={!isValid || activeSubscribersCount === 0 || isSending}
                  size="sm"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  <span className="hidden sm:inline">Envoyer</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer l'envoi</AlertDialogTitle>
                  <AlertDialogDescription>
                    Vous êtes sur le point d'envoyer cette newsletter à{" "}
                    <strong>{activeSubscribersCount} abonnés</strong>. Cette action ne peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSend}>
                    Confirmer l'envoi
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
