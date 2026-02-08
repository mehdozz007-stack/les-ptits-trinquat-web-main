import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Loader2, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTombolaLots } from "@/hooks/useTombolaLots";
import { TombolaParticipantPublic } from "@/hooks/useTombolaParticipants";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const LOT_ICONS = ["🎁", "🧸", "📚", "🎨", "🎮", "⚽", "🎭", "🎵", "🍫", "🎂", "🌸", "🎈", "✨", "🌟", "💝", "🎀", "🚀", "🎪", "🎯", "🎲", "🃏", "🎰", "🧩", "🎸", "🎹", "🎺", "🎷", "📷", "🎬", "📺", "🎤", "🎧", "📻", "🎥", "📡", "📞", "📱", "💻", "⌚", "📹", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "⛳", "🎣", "🎿", "🏂", "🛹", "🛼", "🏋️", "🤸", "🧘"];


const lotSchema = z.object({
  nom: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom est trop long"),
  description: z.string().max(500, "La description est trop longue").optional(),
  icone: z.string().min(1),
});

interface LotFormProps {
  currentParticipant: TombolaParticipantPublic | null;
}

export function LotForm({ currentParticipant }: LotFormProps) {
  const { addLot } = useTombolaLots();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    icone: "🎁",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentParticipant) {
      toast({
        title: "Inscription requise",
        description: "Veuillez d'abord vous inscrire pour proposer un lot.",
        variant: "destructive",
      });
      return;
    }

    setErrors({});

    const result = lotSchema.safeParse(formData);
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

    const { error } = await addLot({
      nom: formData.nom.trim(),
      description: formData.description.trim() || undefined,
      icone: formData.icone,
      parent_id: currentParticipant.id,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le lot. Veuillez réessayer.",
        variant: "destructive",
      });
      return;
    }

    setSuccess(true);
    toast({
      title: "Lot ajouté ! 🎉",
      description: "Votre lot est maintenant visible par tous les participants.",
    });

    // Rafraîchir la page pour voir les changements
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!currentParticipant) {
    return (
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-sky/5 py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Plus className="h-4 w-4" />
              Proposer un lot
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Partagez vos trésors ! 🎁
            </h2>
            <p className="mb-6 text-muted-foreground">
              Pour proposer un lot à la tombola, inscrivez-vous d'abord en tant que participant.
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-3 text-amber-800">
              <span className="text-xl">☝️</span>
              <span className="font-medium">Inscrivez-vous dans la section ci-dessus</span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-sky/5 py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Plus className="h-4 w-4" />
            Proposer un lot
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Partagez vos trésors ! 🎁
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Proposez des lots pour enrichir notre tombola. Chaque contribution compte !
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
                  <Gift className="h-5 w-5" />
                  Proposer un lot
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
                      <span className="text-2xl">🎁</span>
                      Nouveau lot
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
                          <p className="text-lg font-semibold">Lot ajouté !</p>
                          <p className="text-muted-foreground">Merci pour votre contribution 🎉</p>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="form-fields"
                          onSubmit={handleSubmit}
                          className="space-y-5"
                        >
                          {/* Icon selector */}
                          <div className="space-y-2">
                            <Label>Choisissez une icône</Label>
                            <div className="max-h-40 overflow-y-auto p-2 border rounded-lg bg-muted/30">
                              <div className="grid grid-cols-8 gap-1">
                                {LOT_ICONS.map((icon) => (
                                  <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icone: icon })}
                                    className={`flex h-9 w-9 items-center justify-center rounded text-xl transition-all ${formData.icone === icon
                                      ? "bg-primary/20 ring-2 ring-primary"
                                      : "hover:bg-muted"
                                      }`}
                                  >
                                    {icon}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Nom */}
                          <div className="space-y-2">
                            <Label htmlFor="nom">Nom du lot *</Label>
                            <Input
                              id="nom"
                              placeholder="Ex: Coffret de jeux de société"
                              value={formData.nom}
                              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                              className={errors.nom ? "border-destructive" : ""}
                            />
                            {errors.nom && (
                              <p className="text-sm text-destructive">{errors.nom}</p>
                            )}
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <Label htmlFor="description">Description (optionnel)</Label>
                            <Textarea
                              id="description"
                              placeholder="Décrivez brièvement votre lot..."
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows={3}
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
                                <Plus className="h-4 w-4" />
                              )}
                              Ajouter
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
