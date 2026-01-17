import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";
import { z } from "zod";

const emailSchema = z.string().email("Adresse email invalide").max(255);

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { subscribe, isLoading, isSuccess, reset } = useNewsletterSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      setEmailError(emailValidation.error.errors[0].message);
      return;
    }

    const success = await subscribe({ email, firstName, consent });
    if (success) {
      setEmail("");
      setFirstName("");
      setConsent(false);
    }
  };

  const handleNewSubscription = () => {
    reset();
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Mail className="h-4 w-4" />
            <span className="text-sm font-medium">Newsletter</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            💌 La newsletter des P'tits Trinquât
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recevez les actualités de l'école, les événements et les belles initiatives 
            de l'association, directement dans votre boîte mail.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card variant="elevated" className="overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                    >
                      <Check className="h-10 w-10 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      Merci pour votre inscription ! 🎉
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Vous faites maintenant partie de la famille des P'tits Trinquât. 
                      À très bientôt dans votre boîte mail !
                    </p>
                    <Button variant="outline" onClick={handleNewSubscription}>
                      Inscrire une autre adresse
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-base">
                          Prénom <span className="text-muted-foreground">(optionnel)</span>
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Votre prénom"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          maxLength={100}
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                          }}
                          required
                          maxLength={255}
                          className={`h-12 text-base ${emailError ? "border-destructive" : ""}`}
                        />
                        {emailError && (
                          <p className="text-sm text-destructive">{emailError}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                      <Checkbox
                        id="consent"
                        checked={consent}
                        onCheckedChange={(checked) => setConsent(checked === true)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        J'accepte de recevoir la newsletter des P'tits Trinquât et je consens au traitement 
                        de mes données personnelles conformément à notre politique de confidentialité. 
                        Je peux me désinscrire à tout moment. <span className="text-destructive">*</span>
                      </Label>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                      <Button
                        type="submit"
                        variant="playful"
                        size="lg"
                        disabled={isLoading || !consent}
                        className="w-full sm:w-auto min-w-[200px]"
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="h-5 w-5" />
                            </motion.div>
                            Inscription...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            Je m'inscris
                          </>
                        )}
                      </Button>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Heart className="h-4 w-4 text-primary" />
                        Rejoignez notre communauté bienveillante
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
