import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Eye, EyeOff, Gift, Heart, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { apiUrl } from "@/lib/api-config";
import { AuthTombolaFormOTP } from "./AuthTombolaFormOTP";

const EMOJI_OPTIONS = ["😊", "😄", "🌟", "🎉", "💫", "🌈", "🦋", "🌸", "🍀", "🎈", "🎁", "❤️", "💜", "💙", "🧡", "😎", "🤗", "🌺", "🌻", "🦅", "🐢", "🦊", "🐰", "🦚", "🌙", "⭐", "🎭", "🎨", "🎪", "🎯", "🎮", "💖"];

const loginSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(1, "Veuillez entrer votre mot de passe"),
});

const registerSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  passwordConfirm: z.string(),
  prenom: z.string().trim().min(2, "Le prénom doit faire au moins 2 caractères").max(50, "Le prénom est trop long"),
  classes: z.string().max(100, "Le texte est trop long").optional(),
  emoji: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirm"],
});

interface AuthTombolaFormProps {
  onAuthSuccess: () => void;
  onLogin?: (email: string, password: string) => Promise<{ success: boolean; error?: string; data?: { token: string; user: { id: string; email: string } } }>;
  onRegister?: (email: string, password: string, passwordConfirm: string) => Promise<{ success: boolean; error?: string; data?: { token: string; user: { id: string; email: string } } }>;
  useOTP?: boolean;
}

export function AuthTombolaForm({ onAuthSuccess, onLogin, onRegister, useOTP = false }: AuthTombolaFormProps) {
  const { toast } = useToast();
  const [useOTPMode, setUseOTPMode] = useState(useOTP);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    prenom: "",
    classes: "",
    emoji: "😊",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        // Validation register
        const validation = registerSchema.safeParse(formData);
        if (!validation.success) {
          const fieldErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          return;
        }

        // Vérifier l'acceptation des conditions
        if (!acceptedTerms) {
          setErrors({ terms: "Vous devez accepter la charte et les mentions légales" });
          return;
        }

        // 1. Créer le compte utilisateur
        let authToken: string;
        let userId: string;

        if (onRegister) {
          const authResult = await onRegister(formData.email, formData.password, formData.passwordConfirm);
          if (!authResult.success) {
            setErrors({ email: authResult.error || "Erreur lors de la création du compte" });
            return;
          }
          authToken = authResult.data?.token || "";
          userId = authResult.data?.user.id || "";
        } else {
          // Fallback to direct API call
          const authResponse = await fetch(apiUrl("/api/auth/register"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              password_confirm: formData.passwordConfirm,
            }),
          });

          const authData = await authResponse.json();
          if (!authData.success) {
            const errorMsg = authData.error || authData.message || "Erreur lors de la création du compte";
            console.error('Register error:', errorMsg);
            setErrors({ email: errorMsg });
            return;
          }

          authToken = authData.data.token;
          userId = authData.data.user.id;
        }

        // 2. Créer le participant tombola automatiquement
        const participantResponse = await fetch(apiUrl("/api/tombola/participants"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            prenom: formData.prenom.trim(),
            email: formData.email,
            role: "Parent participant",
            emoji: formData.emoji,
            ...(formData.classes.trim() && { classes: formData.classes.trim() }),
            user_id: userId,
          }),
        });

        const participantData = await participantResponse.json();
        if (!participantData.success) {
          // Participant creation failed but account was created
          // This is not fatal - user can create participant later
          console.warn("Participant creation failed:", participantData.error);
        }

        // Sauvegarder le token et l'utilisateur
        localStorage.setItem('tombola_auth_token', authToken);
        const currentUser = {
          id: userId,
          email: formData.email,
          token: authToken
        };
        localStorage.setItem('tombola_current_user', JSON.stringify(currentUser));

        // Dispatcher un event pour synchroniser les autres composants
        window.dispatchEvent(new Event('authStateChanged'));

        toast({
          title: "Bienvenue ! 🎉",
          description: "Votre compte a été créé et vous êtes inscrit à la tombola",
        });

        setFormData({
          email: "",
          password: "",
          passwordConfirm: "",
          prenom: "",
          classes: "",
          emoji: "😊",
        });
        onAuthSuccess();
      } else {
        // Validation login
        const validation = loginSchema.safeParse({
          email: formData.email,
          password: formData.password,
        });

        if (!validation.success) {
          const fieldErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          return;
        }

        // Login
        let authToken: string;
        let userId: string;

        if (onLogin) {
          const loginResult = await onLogin(formData.email, formData.password);
          if (!loginResult.success) {
            setErrors({ email: loginResult.error || "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants." });
            return;
          }
          authToken = loginResult.data?.token || "";
          userId = loginResult.data?.user.id || "";
        } else {
          const loginResponse = await fetch(apiUrl("/api/auth/login"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          const loginData = await loginResponse.json();
          if (!loginData.success) {
            const errorMsg = loginData.error || loginData.message || "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.";
            console.error('Login error:', errorMsg);
            setErrors({ email: errorMsg });
            return;
          }

          authToken = loginData.data.token;
          userId = loginData.data.user.id;
        }

        // Check if participant exists, if not create one
        const participantCheckResponse = await fetch(apiUrl("/api/tombola/participants/my"), {
          headers: {
            "Authorization": `Bearer ${authToken}`,
          },
        });

        const participantCheckData = await participantCheckResponse.json();
        if (participantCheckData.data && participantCheckData.data.length === 0) {
          // No participant found, create a default one
          await fetch(apiUrl("/api/tombola/participants"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              prenom: formData.email.split("@")[0],
              email: formData.email,
              role: "Parent participant",
              emoji: "😊",
              user_id: userId,
            }),
          });
        }

        // Sauvegarder le token et l'utilisateur
        localStorage.setItem('tombola_auth_token', authToken);
        const currentUser = {
          id: userId,
          email: formData.email,
          token: authToken
        };
        localStorage.setItem('tombola_current_user', JSON.stringify(currentUser));

        // Dispatcher un event pour synchroniser les autres composants
        window.dispatchEvent(new Event('authStateChanged'));

        toast({
          title: "Connecté ! ✅",
          description: "Bienvenue dans la tombola",
        });

        setFormData({
          email: "",
          password: "",
          passwordConfirm: "",
          prenom: "",
          classes: "",
          emoji: "😊",
        });
        onAuthSuccess();
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({ email: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {useOTPMode && !isRegisterMode ? (
        <AuthTombolaFormOTP onAuthSuccess={onAuthSuccess} />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md mx-auto"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group"
          >
            <Card className="border border-amber/30 shadow-2xl bg-gradient-to-br from-amber-50/40 via-orange-100/35 via-primary-50/40 to-amber-50/30 backdrop-blur-xl relative overflow-hidden">
              {/* Decorative gradient orbs */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber/20 to-transparent rounded-full blur-3xl"
                  animate={{
                    x: [0, 30, 0],
                    y: [-30, 0, -30],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-3xl"
                  animate={{
                    x: [0, -20, 0],
                    y: [20, 0, 20],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Content with relative positioning */}
              <div className="relative z-10 p-8 md:p-8">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="flex flex-col items-center justify-center w-full mb-6"
                >
                  <div className="mb-6 flex justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
                    >
                      <UserPlus className="h-8 w-8 text-primary" />
                    </motion.div>
                  </div>

                  <CardTitle className="mb-4 text-3xl md:text-xl font-bold text-center w-full">
                    {isRegisterMode ? "Inscrivez-vous" : "Connectez-vous"}
                  </CardTitle>
                  <motion.p
                    className="hidden text-center text-xs md:block md:text-sm w-full font-medium"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {isRegisterMode
                      ? "Créez votre compte et devenez participant"
                      : "Accédez à votre espace tombola"}
                  </motion.p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm md:text-base font-semibold text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isLoading}
                      className={`border-2 bg-card/80 placeholder-muted-foreground text-foreground focus:border-amber-500 focus:ring-amber-400/20 transition-all duration-300 shadow-sm ${errors.email ? "border-destructive" : "border-amber/30"
                        }`}
                    />
                    {errors.email && <p className="text-xs md:text-sm text-destructive font-medium">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm md:text-base font-semibold text-foreground">
                      Mot de passe
                    </Label>
                    <div className="relative mb-10">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={isRegisterMode ? "Minimum 8 caractères" : "••••••••"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        disabled={isLoading}
                        className={`border-2 bg-card/80 placeholder-muted-foreground text-foreground focus:border-amber-500 focus:ring-amber-400/20 transition-all duration-300 pr-10 shadow-sm ${errors.password ? "border-destructive" : "border-amber/30"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600/70 hover:text-amber-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs md:text-sm text-destructive font-medium">{errors.password}</p>}
                  </div>

                  {/* Confirm Password (Register only) */}
                  <AnimatePresence>
                    {isRegisterMode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="passwordConfirm" className="text-sm md:text-base font-semibold text-foreground">
                          Confirmer mot de passe
                        </Label>
                        <div className="relative">
                          <Input
                            id="passwordConfirm"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Répéter le mot de passe"
                            value={formData.passwordConfirm}
                            onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                            disabled={isLoading}
                            className={`border-2 bg-card/80 placeholder-muted-foreground text-foreground focus:border-amber-500 focus:ring-amber-400/20 transition-all duration-300 pr-10 shadow-sm ${errors.passwordConfirm ? "border-destructive" : "border-amber/30"
                              }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600/70 hover:text-amber-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.passwordConfirm && (
                          <p className="text-xs md:text-sm text-destructive font-medium">{errors.passwordConfirm}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Participant Info (Register only) */}
                  <AnimatePresence>
                    {isRegisterMode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-2 border-t border-primary/10"
                      >
                        {/* Prenom */}
                        <div className="space-y-2">
                          <Label htmlFor="prenom" className="text-sm md:text-base font-semibold text-foreground">
                            Prénom *
                          </Label>
                          <Input
                            id="prenom"
                            type="text"
                            placeholder="Jean"
                            value={formData.prenom}
                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                            disabled={isLoading}
                            className={`border-2 bg-card/80 placeholder-muted-foreground text-foreground focus:border-amber-500 focus:ring-amber-400/20 transition-all duration-300 shadow-sm ${errors.prenom ? "border-destructive" : "border-amber/30"
                              }`}
                          />
                          {errors.prenom && <p className="text-xs md:text-sm text-destructive font-medium">{errors.prenom}</p>}
                        </div>

                        {/* Classes */}
                        <div className="space-y-2">
                          <Label htmlFor="classes" className="text-sm md:text-base font-semibold text-foreground">
                            Classe(s) enfant(s)
                          </Label>
                          <Input
                            id="classes"
                            type="text"
                            placeholder="ex: CP, CE1"
                            value={formData.classes}
                            onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                            disabled={isLoading}
                            className="border-2 bg-card/80 placeholder-muted-foreground text-foreground focus:border-amber-500 focus:ring-amber-400/20 transition-all duration-300 border-amber/30 shadow-sm"
                          />
                          {errors.classes && <p className="text-xs md:text-sm text-destructive font-medium">{errors.classes}</p>}
                        </div>

                        {/* Emoji Selector */}
                        <div className="space-y-2">
                          <Label className="text-sm md:text-base font-semibold text-foreground">Choisissez votre avatar</Label>
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

                        {/* Terms & Conditions Checkbox */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              id="terms"
                              checked={acceptedTerms}
                              onChange={(e) => {
                                setAcceptedTerms(e.target.checked);
                                if (e.target.checked) {
                                  setErrors({ ...errors, terms: "" });
                                }
                              }}
                              className="mt-1 h-4 w-4 rounded border-2 border-amber/30 accent-primary cursor-pointer transition-all focus:border-amber-500"
                            />
                            <label htmlFor="terms" className="text-xs md:text-sm text-muted-foreground cursor-pointer font-medium">
                              J'accepte{" "}
                              <a
                                href="/documents/confidentialite.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                la charte du site
                              </a>
                              {" "}et{" "}
                              <a
                                href="/documents/mentions-legales.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                les mentions légales
                              </a>
                              .
                            </label>
                          </div>
                          {errors.terms && <p className="text-xs md:text-sm text-destructive font-medium">{errors.terms}</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 flex justify-center"
                  >
                    <Button
                      type="submit"
                      disabled={isLoading || (isRegisterMode && !acceptedTerms)}
                      className="text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-primary via-secondary text-primary-foreground hover:shadow-glow transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                        animate={{ x: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                          {isRegisterMode ? "Inscription..." : "Connexion..."}
                        </>
                      ) : isRegisterMode ? (
                        <>
                          <UserPlus className="h-4 w-4" />
                          S'inscrire
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4" />
                          Se connecter
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* Toggle Mode */}
                  <div className="text-center pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(!isRegisterMode);
                        setErrors({});
                        setAcceptedTerms(false);
                        setFormData({
                          email: formData.email,
                          password: "",
                          passwordConfirm: "",
                          prenom: "",
                          classes: "",
                          emoji: "😊",
                        });
                      }}
                      className="text-xs md:text-sm text-muted-foreground hover:text-primary font-semibold transition-colors duration-200 underline underline-offset-2"
                    >
                      {isRegisterMode ? "Déjà client ? Se connecter" : "Nouveau ? S'inscrire"}
                    </button>
                    <div className="text-xs md:text-sm text-muted-foreground font-medium">
                      ou{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setUseOTPMode(true);
                          setErrors({});
                          setFormData({
                            email: "",
                            password: "",
                            passwordConfirm: "",
                            prenom: "",
                            classes: "",
                            emoji: "😊",
                          });
                        }}
                        className="text-primary hover:underline font-semibold transition-colors duration-200 flex items-center gap-1 justify-center"
                      >
                        <Mail className="h-3 w-3" />
                        utiliser un code par email
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
