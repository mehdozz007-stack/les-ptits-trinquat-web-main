import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Eye, Save, FileText, Loader2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

interface NewsletterEditorProps {
  activeSubscribersCount: number;
  onSave: (newsletter: { title: string; subject: string; content: string }) => Promise<any>;
  onRefresh: () => void;
}

export function NewsletterEditor({ activeSubscribersCount, onSave, onRefresh }: NewsletterEditorProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const isValid = title.trim() && subject.trim() && content.trim();

  const handleSave = async () => {
    if (!isValid) return;
    setIsSaving(true);
    await onSave({ title, subject, content });
    setIsSaving(false);
  };

  const handleSend = async () => {
    if (!isValid || activeSubscribersCount === 0) return;

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-newsletter", {
        body: { subject, content },
      });

      if (error) throw error;

      toast({
        title: "Newsletter envoyée",
        description: `Votre newsletter a été envoyée à ${data.sentCount} abonnés.`,
      });

      // Save newsletter with sent status
      await supabase.from("newsletters").insert({
        title,
        subject,
        content,
        status: "sent",
        sent_at: new Date().toISOString(),
        recipients_count: data.sentCount,
      });

      // Reset form
      setTitle("");
      setSubject("");
      setContent("");
      onRefresh();
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
            <Label htmlFor="content">Contenu de la newsletter</Label>
            <Textarea
              id="content"
              placeholder="Écrivez le contenu de votre newsletter ici..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={!isValid || isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Enregistrer le brouillon
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!isValid} className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Prévisualiser
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Prévisualisation de la newsletter</DialogTitle>
                  <DialogDescription>
                    Voici comment apparaîtra votre newsletter
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 p-6 bg-muted/30 rounded-xl border">
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-muted-foreground">Objet :</p>
                    <p className="font-medium">{subject || "(Aucun objet)"}</p>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap">{content || "(Aucun contenu)"}</div>
                  </div>
                  <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
                    <p>Les P'tits Trinquât - Association de parents d'élèves</p>
                    <p className="mt-1">Pour vous désinscrire, cliquez ici</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="playful"
                  disabled={!isValid || activeSubscribersCount === 0 || isSending}
                  className="flex-1"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Envoyer la newsletter
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
