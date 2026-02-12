import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Check, Loader2, LogIn, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTombolaParticipants } from "@/hooks/useTombolaParticipants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "./LoginForm";
import { z } from "zod";

const EMOJI_OPTIONS = ["😊", "😄", "🌟", "🎉", "💫", "🌈", "🦋", "🌸", "🍀", "🎈", "🎁", "❤️", "💜", "💙", "🧡", "😎", "🤗", "🌺", "🌻", "🦅", "🐢", "🦊", "🐰", "🦚", "🌙", "⭐", "🎭", "🎨", "🎪", "🎯", "🎮", "💖"];

const participantSchema = z.object({
  prenom: z.string().trim().min(2, "Le prénom doit contenir au moins 2 caractères").max(50, "Le prénom est trop long"),
  classes: z.string().max(100, "Le texte est trop long").optional(),
  emoji: z.string().min(1),
});

export function ParticipantForm() {
  const { user, token, isAuthenticated, login, register } = useCurrentUser();
  const { participants, addParticipant, deleteParticipant, fetchMyParticipants, loading: participantsLoading } = useTombolaParticipants(false); // false = ne charger que mes participants
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    prenom: "",
    classes: "",
    emoji: "😊",
  });

  // Charger les participants quand on est authentifié
  useEffect(() => {
    if (isAuthenticated && token && user?.id) {
      fetchMyParticipants(token, user.id);
    }
  }, [isAuthenticated, token, user?.id, fetchMyParticipants]);

  // Si non authentifié, afficher LoginForm dans la section
  if (!isAuthenticated || !token) {
    return (
      <section className="bg-muted/50 py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <LogIn className="h-4 w-4" />
              Authentification requise
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Connectez-vous pour participer 🔐
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Logez-vous ou créez un compte pour accéder à la tombola et gérer vos participants.
            </p>
          </motion.div>

          <div className="mx-auto max-w-sm">
            <LoginForm
              onLoginSuccess={() => {
                // Les participants seront chargés automatiquement
                toast({
                  title: "Connecté !",
                  description: "Vous pouvez maintenant créer des participants",
                });
              }}
              onLogin={login}
              onRegister={register}
              loading={false}
            />
          </div>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Vérifier l'authentification
    if (!isAuthenticated || !token) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter d'abord",
        variant: "destructive",
      });
      return;
    }

    const result = participantSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    console.log('📝 Submitting participant form with data:', formData);

    const payload = {
      prenom: formData.prenom.trim(),
      email: user?.email || "",
      role: "Parent participant",
      emoji: formData.emoji,
      ...(formData.classes.trim() && { classes: formData.classes.trim() }),
    };

    console.log('📤 Payload to send:', payload);

    const { error } = await addParticipant(payload as any, token);

    setLoading(false);

    if (error) {
      console.error('❌ Registration error:', error);
      toast({
        title: "Erreur d'inscription",
        description: error || "Impossible de vous inscrire. Vérifiez votre connexion.",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ Registration successful!');
    setSuccess(true);
    toast({
      title: "Bienvenue ! 🎉",
      description: "Votre inscription a bien été enregistrée.",
    });

    setTimeout(() => {
      setFormData({
        prenom: "",
        classes: "",
        emoji: "😊",
      });
      setSuccess(false);
      setIsOpen(false);
    }, 2000);
  };

  const handleDeleteParticipant = async (participantId: string) => {
    if (!token) return;

    setDeleting(true);
    const { error } = await deleteParticipant(participantId, token);
    setDeleting(false);

    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Supprimé ! 🗑️",
      description: "Votre participation a été supprimée. Redirection en cours...",
    });

    // Nettoyer complètement le localStorage avec les bonnes clés
    setTimeout(() => {
      localStorage.removeItem('tombola_auth_token');
      localStorage.removeItem('tombola_current_user');
      localStorage.removeItem('participantId');
      localStorage.removeItem('token');
      // Forcer un reload complet de la page pour réinitialiser l'état
      window.location.reload();
    }, 1000);
  };

  return (
    <section className="bg-muted/50 py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <UserPlus className="h-4 w-4" />
            {participants.length > 0 ? "Votre participation" : "Inscription"}
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {participants.length > 0 ? "Modifier votre participation ✏️" : "Rejoignez l'aventure ! ✨"}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {participants.length > 0
              ? "Vous avez une seule participation. Vous pouvez la supprimer et en créer une nouvelle si vous changez d'avis."
              : "Inscrivez-vous pour participer à la tombola, proposer des lots et faire partie de notre belle communauté de familles."}
          </p>
        </motion.div>

        <div className="mx-auto max-w-xl">
          <AnimatePresence mode="wait">
            {/* Afficher le participant existant */}
            {participants.length > 0 ? (
              <motion.div
                key="existing-participant"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 shadow-lg shadow-blue-100/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-150/40 rounded-2xl">
                  <CardHeader className="bg-gradient-to-r from-blue-100/50 via-indigo-100/30 to-slate-100/50 border-b border-blue-200/30 py-5">
                    <CardTitle className="flex items-center gap-4 text-lg font-semibold">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-3xl shadow-sm">
                        {participants[0]?.emoji || "😊"}
                      </span>
                      <div className="text-left flex-1">
                        <p className="text-slate-800 font-semibold tracking-tight">{participants[0]?.prenom}</p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{participants[0]?.classes || "Classe non spécifiée"}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 py-5">
                    <p className="mb-5 text-sm text-slate-600 leading-relaxed">
                      Vous avez une participation active. Vous ne pouvez avoir qu'une seule participation à la fois.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 gap-2 border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-200"
                        disabled={deleting}
                        onClick={() => {
                          if (confirm("Êtes-vous sûr ? Cette action supprimera votre participation et tous vos lots.")) {
                            handleDeleteParticipant(participants[0]?.id || "");
                          }
                        }}
                      >
                        {deleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : !isOpen ? (
              <motion.div
                key="button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => setIsOpen(true)}
                  className="gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  Je m'inscris
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 via-secondary/5 to-sky/5">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <span className="text-2xl">📝</span>
                      Créer ma participation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <AnimatePresence mode="wait">
                      {success ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center py-8"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
                          >
                            <Check className="h-8 w-8 text-green-600" />
                          </motion.div>
                          <p className="text-lg font-semibold">Inscription réussie !</p>
                          <p className="text-muted-foreground">Bienvenue dans la communauté 🎉</p>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="form-fields"
                          onSubmit={handleSubmit}
                          className="space-y-5"
                        >
                          {/* Emoji selector */}
                          <div className="space-y-2">
                            <Label>Choisissez votre avatar</Label>
                            <div className="flex flex-wrap gap-2">
                              {EMOJI_OPTIONS.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, emoji })}
                                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${formData.emoji === emoji
                                    ? "bg-primary/20 ring-2 ring-primary ring-offset-2"
                                    : "bg-muted hover:bg-muted/80"
                                    }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Prénom */}
                          <div className="space-y-2">
                            <Label htmlFor="prenom">Prénom *</Label>
                            <Input
                              id="prenom"
                              placeholder="Votre prénom"
                              value={formData.prenom}
                              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                              className={errors.prenom ? "border-destructive" : ""}
                            />
                            {errors.prenom && (
                              <p className="text-sm text-destructive">{errors.prenom}</p>
                            )}
                          </div>

                          {/* Classes */}
                          <div className="space-y-2">
                            <Label htmlFor="classes">Classe(s) de votre enfant (optionnel)</Label>
                            <Input
                              id="classes"
                              placeholder="Ex: CP, CE2"
                              value={formData.classes}
                              onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                            />
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-3 pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1"
                              onClick={() => setIsOpen(false)}
                            >
                              Annuler
                            </Button>
                            <Button
                              type="submit"
                              variant="hero"
                              className="flex-1 gap-2"
                              disabled={loading}
                            >
                              {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                              Valider
                            </Button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
