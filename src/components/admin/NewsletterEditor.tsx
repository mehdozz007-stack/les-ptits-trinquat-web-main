import { useState, useEffect } from "react";
import React from 'react';
import { motion } from "framer-motion";
import { Send, Eye, Save, FileText, Loader2, Send as SendIcon, Trash2, Edit2 } from "lucide-react";
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

interface DraftNewsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  preview_text?: string;
  created_at: string;
  status: string;
}

export function NewsletterEditor({ activeSubscribersCount = 0, onSave, onRefresh }: NewsletterEditorProps = {}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [testEmail, setTestEmail] = useState("mehdozz007@gmail.com");
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTestSending, setIsTestSending] = useState(false);
  const [drafts, setDrafts] = useState<DraftNewsletter[]>([]);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  const { toast } = useToast();

  const isValid = title.trim() && subject.trim() && content.trim();

  // Charger les brouillons au montage
  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    setIsLoadingDrafts(true);
    try {
      const result = await newsletterApi.getNewsletters();
      if (result.success && result.data) {
        const draftsList = Array.isArray(result.data) ? result.data : result.data.newsletters || [];
        setDrafts(draftsList.filter((n: any) => n.status === 'draft') as DraftNewsletter[]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des brouillons:', error);
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  const handleSave = async () => {
    if (!isValid) return;
    setIsSaving(true);
    try {
      const result = await newsletterApi.createNewsletter(
        title,
        subject,
        content,
        previewText || content.substring(0, 100)
      );

      if (result.success) {
        toast({
          title: "Succès",
          description: "Brouillon enregistré",
        });

        // Réinitialiser le formulaire
        setTitle("");
        setSubject("");
        setContent("");
        setPreviewText("");
        setEditingDraftId(null);

        // Recharger les brouillons
        await loadDrafts();
      } else {
        throw new Error(result.error || "Erreur lors de la sauvegarde");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer le brouillon",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadDraft = (draft: DraftNewsletter) => {
    setTitle(draft.title);
    setSubject(draft.subject);
    setContent(draft.content);
    setPreviewText(draft.preview_text || "");
    setEditingDraftId(draft.id);
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      const result = await newsletterApi.deleteNewsletter(draftId);
      if (result.success) {
        toast({
          title: "Succès",
          description: "Brouillon supprimé",
        });
        await loadDrafts();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le brouillon",
        variant: "destructive",
      });
    }
  };

  const handleSendDraft = async (draftId: string) => {
    setIsSending(true);
    try {
      // Récupérer le brouillon depuis le state
      const draft = drafts.find(d => d.id === draftId);
      if (!draft) {
        throw new Error('Brouillon non trouvé');
      }

      // Envoyer la newsletter avec tous les détails du brouillon
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
      const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

      const response = await fetch(`${apiBaseUrl}/newsletter/admin/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: draft.title,
          subject: draft.subject,
          content: draft.content,
          preview_text: draft.preview_text || draft.content.substring(0, 100),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      toast({
        title: "Newsletter envoyée",
        description: `Votre newsletter a été envoyée à ${result.data?.sent || activeSubscribersCount} abonnés.`,
      });
      await loadDrafts();
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

  const handleTestEmail = async () => {
    if (!isValid) return;

    setIsTestSending(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification non trouvé. Veuillez vous reconnecter.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/newsletter/admin/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          subject,
          content,
          preview_text: previewText || content.substring(0, 100),
          recipient_email: testEmail || 'mehdozz007@gmail.com',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi du test');
      }

      toast({
        title: "Email de test envoyé",
        description: `Le test a été envoyé à ${result.data?.testEmail || testEmail}`,
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

  const handleSendNewsletter = async () => {
    if (!isValid || activeSubscribersCount === 0) return;

    setIsSending(true);
    try {
      const result = await newsletterApi.createNewsletter(
        title,
        subject,
        content,
        previewText || content.substring(0, 100)
      );

      if (result.success && result.data?.id) {
        const sendResult = await newsletterApi.sendNewsletter(result.data.id);
        if (sendResult.success) {
          toast({
            title: "Newsletter envoyée",
            description: `Votre newsletter a été envoyée à ${activeSubscribersCount} abonnés.`,
          });

          // Reset form
          setTitle("");
          setSubject("");
          setContent("");
          setPreviewText("");
          setEditingDraftId(null);
          await loadDrafts();
          onRefresh?.();
        } else {
          throw new Error(sendResult.error);
        }
      } else {
        throw new Error(result.error || 'Erreur lors de la création');
      }
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
      <Card className="shadow-sm border-orange-100/50 bg-white/60 backdrop-blur-sm hover:shadow-md transition-shadow" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] bg-clip-text text-transparent" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
            <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <span className="truncate">Rédiger une newsletter</span>
          </CardTitle>
          <CardDescription style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm mt-2 truncate">
            Créez et envoyez à <strong className="text-[#FF7B42]">{activeSubscribersCount} abonnés</strong> actifs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="title" style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm font-semibold text-gray-700">Titre interne (usage admin)</Label>
            <Input
              id="title"
              placeholder="Ex: Newsletter de janvier 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm font-semibold text-gray-700">Objet de l'email</Label>
            <Input
              id="subject"
              placeholder="Ex: Les actualités de l'école ce mois-ci"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preview" style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm font-semibold text-gray-700">Texte de prévisualisation (optionnel)</Label>
            <Textarea
              id="preview"
              placeholder="Texte qui apparaît dans la prévisualisation de l'email"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="h-[50px] sm:h-[60px] resize-none text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testEmail" style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm font-semibold text-gray-700">Email de test</Label>
            <Input
              id="testEmail"
              type="email"
              placeholder="Email pour recevoir le test"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm font-semibold text-gray-700">Contenu de la newsletter</Label>
            <Textarea
              id="content"
              placeholder="Écrivez le contenu de votre newsletter ici..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] sm:min-h-[200px] resize-y text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={!isValid || isSaving}
              size="sm"
              className="text-xs sm:text-sm border-orange-200 text-[#FF7B42] h-9 sm:h-10 font-medium relative overflow-hidden group transition-all"
              style={{
                background: "linear-gradient(135deg, transparent 0%, transparent 100%)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #FF7B42 0%, #FF9A6A 50%, #C55FA8 100%)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "#FF7B42";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#FF7B42";
                e.currentTarget.style.borderColor = "rgb(254, 209, 180)";
              }}
            >
              {isSaving ? (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
              ) : (
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              )}
              <span>Brouillon</span>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!isValid}
                  size="sm"
                  className="text-xs sm:text-sm border-rose-200 text-[#FF9A6A] h-9 sm:h-10 font-medium relative overflow-hidden group transition-all"
                  style={{
                    background: "linear-gradient(135deg, transparent 0%, transparent 100%)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #FFB347 0%, #FF9A6A 50%, #FF7B42 100%)";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "#FF9A6A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#FF9A6A";
                    e.currentTarget.style.borderColor = "rgb(254, 205, 198)";
                  }}
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span>Aperçu</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto p-3 sm:p-6">
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: "'Nunito', sans-serif" }} className="text-base sm:text-lg">Prévisualisation de la newsletter</DialogTitle>
                  <DialogDescription style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm">
                    Voici comment apparaîtra votre newsletter dans les clients email
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-3 sm:mt-4 w-full">
                  <iframe
                    srcDoc={renderNewsletterEmail({
                      title,
                      previewText: previewText || content.substring(0, 100),
                      content,
                      firstName: "Cher parent",
                    })}
                    className="w-full h-[550px] sm:h-[680px] border border-orange-200 rounded-lg"
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
              className="text-xs sm:text-sm bg-gradient-to-r from-[#FF9A6A] to-[#C55FA8] text-white hover:shadow-md h-9 sm:h-10"
            >
              {isTestSending ? (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
              ) : (
                <SendIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              )}
              <span>Test</span>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="playful"
                  disabled={!isValid || activeSubscribersCount === 0 || isSending}
                  size="sm"
                  className="text-xs sm:text-sm bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] text-white hover:shadow-lg h-9 sm:h-10"
                >
                  {isSending ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  )}
                  <span>Envoyer</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[95vw] sm:w-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle style={{ fontFamily: "'Nunito', sans-serif" }} className="text-base sm:text-lg">Confirmer l'envoi</AlertDialogTitle>
                  <AlertDialogDescription style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm">
                    Vous êtes sur le point d'envoyer cette newsletter à{" "}
                    <strong>{activeSubscribersCount} abonnés</strong>. Cette action ne peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                  <AlertDialogCancel className="text-xs sm:text-sm">Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSendNewsletter} className="text-xs sm:text-sm">
                    Confirmer l'envoi
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Section des brouillons */}
          {drafts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-6 border-t border-orange-100/30"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-[#FF7B42] to-[#C55FA8] bg-clip-text text-transparent flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#FF7B42]" />
                  Brouillons ({drafts.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drafts.map((draft) => (
                  <motion.div
                    key={draft.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-xl border border-orange-100/50 bg-gradient-to-br from-orange-50/50 to-rose-50/50 hover:shadow-md transition-all flex flex-col"
                  >
                    <p className="font-semibold text-xs sm:text-sm text-gray-900 truncate mb-1">{draft.title}</p>
                    <p className="text-xs text-muted-foreground truncate mb-2 flex-1">{draft.subject}</p>
                    <div className="flex flex-row gap-1 w-full">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLoadDraft(draft)}
                        className="text-xs h-7 text-[#FF7B42] flex-1 px-2 min-w-0"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Éditer
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSendDraft(draft.id)}
                        disabled={isSending}
                        className="text-xs h-7 text-green-600 flex-1 px-2 min-w-0"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Envoyer
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 text-red-600 flex-1 px-2 min-w-0"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le brouillon?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteDraft(draft.id)} className="bg-red-600">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
