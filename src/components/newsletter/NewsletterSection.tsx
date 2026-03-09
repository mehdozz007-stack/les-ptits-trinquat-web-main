import React, { useState } from "react";
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
    <section id="newsletter" className="relative overflow-hidden sm:py-12 py-20 md:py-28"
      style={{
        background: 'linear-gradient(135deg, rgba(255,219,193,0.4) 0%, rgba(255,154,106,0.2) 25%, rgba(255,179,71,0.15) 50%, rgba(197,95,168,0.2) 75%, rgba(100,200,255,0.15) 100%)',
        boxShadow: 'inset 0 0 60px rgba(255,123,66,0.08)'
      }}>
      {/* Décorateurs en arrière-plan avec gradients */}
      <div className="absolute top-10 -left-20 w-72 h-72 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255,123,66,0.6) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
      <div className="absolute bottom-10 -right-32 w-96 h-96 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(197,95,168,0.5) 0%, transparent 70%)',
          filter: 'blur(50px)'
        }} />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(100,200,255,0.4) 0%, transparent 70%)',
          filter: 'blur(45px)'
        }} />

      <div className="container max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="mb-6 flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0"
            >

              <Mail className="h-10 w-10 sm:h-8 sm:w-8 text-white" />
            </motion.div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            La newsletter <span className="text-gradient">des P'tits Trinquat</span> 💌
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
          <div className="relative">
            {/* Ombre 3D douce */}
            <div className="absolute -inset-1 rounded-2xl opacity-30 blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,123,66,0.4) 0%, rgba(197,95,168,0.4) 100%)',
                zIndex: -1
              }} />
            <div className="absolute -inset-0.5 rounded-2xl opacity-20"
              style={{
                background: 'linear-gradient(135deg, rgba(100,200,255,0.3) 0%, rgba(255,179,71,0.3) 100%)',
                zIndex: -1
              }} />

            <Card variant="elevated" className="overflow-hidden backdrop-blur-sm border-0 transition-all duration-300 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,250,245,0.95) 50%, rgba(248,245,255,0.95) 100%)',
                boxShadow: '0 20px 50px -15px rgba(255,123,66,0.25), 0 10px 25px -10px rgba(197,95,168,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}>
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
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(100,220,100,0.6) 0%, rgba(100,220,100,0.4) 100%)',
                          boxShadow: '0 8px 25px rgba(100,220,100,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
                        }}
                      >
                        <Check className="h-10 w-10 text-green-600" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        Merci pour votre inscription !
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Vous faites maintenant partie de la famille des P'tits Trinquat.
                        À très bientôt dans votre boîte mail !
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleNewSubscription}
                          className="text-white hover:shadow-lg transition-shadow border-0 relative overflow-hidden group"
                          style={{
                            background: 'linear-gradient(135deg, #FF7B42 0%, #FF9A6A 30%, #FFC107 50%, #FF9A6A 70%, #C55FA8 100%)',
                            boxShadow: '0 8px 25px rgba(255,123,66,0.35), inset 0 1px 0 rgba(255,255,255,0.3)'
                          }}
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                            style={{
                              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                            }} />
                          Inscrire une autre adresse
                        </Button>
                      </motion.div>
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

                      <div className="flex items-start gap-3 p-4 rounded-xl border-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,179,71,0.08) 0%, rgba(197,95,168,0.05) 100%)',
                          boxShadow: 'inset 0 1px 3px rgba(255,123,66,0.1), 0 2px 8px rgba(255,123,66,0.08)'
                        }}>
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

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full sm:w-auto"
                        >
                          <Button
                            type="submit"
                            variant="playful"
                            size="lg"
                            disabled={isLoading || !consent}
                            className="w-full sm:w-auto min-w-[200px] relative overflow-hidden group border-0"
                            style={{
                              background: isLoading || !consent
                                ? 'linear-gradient(135deg, #FF7B42 0%, #FF9A6A 50%, #C55FA8 100%)'
                                : 'linear-gradient(135deg, #FF7B42 0%, #FF9A6A 30%, #FFC107 50%, #FF9A6A 70%, #C55FA8 100%)',
                              boxShadow: isLoading || !consent
                                ? '0 4px 15px rgba(255,123,66,0.2)'
                                : '0 8px 25px rgba(255,123,66,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
                            }}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 group-disabled:opacity-0 transition-opacity"
                              style={{
                                background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                              }} />
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
                        </motion.div>
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
