import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTombolaParticipants } from "@/hooks/useTombolaParticipants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const EMOJI_OPTIONS = ["😊", "😄", "🌟", "🎉", "💫", "🌈", "🦋", "🌸", "🍀", "🎈", "🎁", "❤️", "💜", "💙", "🧡", "😎", "🤗", "🌺", "🌻", "🦅", "🐢", "🦊", "🐰", "🦚", "🌙", "⭐", "🎭", "🎨", "🎪", "🎯", "🎮", "💖"];

const ROLE_OPTIONS = [
  "Parent participant",
  "Membre du bureau",
  "Parent bénévole",
  "Enseignant",
];

const participantSchema = z.object({
  prenom: z.string().trim().min(2, "Le prénom doit contenir au moins 2 caractères").max(50, "Le prénom est trop long"),
  email: z.string().trim().email("Adresse email invalide").max(100, "L'email est trop long"),
  role: z.string().min(1, "Veuillez sélectionner un rôle"),
  classes: z.string().max(100, "Le texte est trop long").optional(),
  emoji: z.string().min(1),
});

export function ParticipantForm() {
  const { userId, token } = useCurrentUser();
  const { addParticipant } = useTombolaParticipants();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    prenom: "",
    email: "",
    role: "Parent participant",
    classes: "",
    emoji: "😊",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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
      email: formData.email.trim(),
      role: formData.role,
      emoji: formData.emoji,
      ...(userId && { user_id: userId }), // Associer au user_id actuel
      ...(formData.classes.trim() && { classes: formData.classes.trim() }),
    };

    console.log('📤 Payload to send:', payload);

    const { error } = await addParticipant(payload as any, token || '');

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
        email: "",
        role: "Parent participant",
        classes: "",
        emoji: "😊",
      });
      setSuccess(false);
      setIsOpen(false);
    }, 2000);
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
            Inscription
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Rejoignez l'aventure ! ✨
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Inscrivez-vous pour participer à la tombola, proposer des lots et faire partie
            de notre belle communauté de familles.
          </p>
        </motion.div>

        <div className="mx-auto max-w-xl">
          <AnimatePresence mode="wait">
            {!isOpen ? (
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
                      Formulaire d'inscription
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

                          {/* Email */}
                          <div className="space-y-2">
                            <Label htmlFor="email">Email * (privé, non affiché)</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="votre.email@exemple.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className={errors.email ? "border-destructive" : ""}
                            />
                            {errors.email && (
                              <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              🔒 Votre email reste confidentiel et ne sera jamais affiché.
                            </p>
                          </div>

                          {/* Rôle */}
                          <div className="space-y-2">
                            <Label>Votre rôle</Label>
                            <div className="flex flex-wrap gap-2">
                              {ROLE_OPTIONS.map((role) => (
                                <button
                                  key={role}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, role })}
                                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${formData.role === role
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted hover:bg-muted/80"
                                    }`}
                                >
                                  {role}
                                </button>
                              ))}
                            </div>
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
