import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Eye, EyeOff, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { apiUrl } from "@/lib/api-config";

const EMOJI_OPTIONS = ["😊", "😄", "🌟", "🎉", "💫", "🌈", "🦋", "🌸", "🍀", "🎈", "🎁", "❤️", "💜", "💙", "🧡", "😎", "🤗", "🌺", "🌻", "🦅", "🐢", "🦊", "🐰", "🦚", "🌙", "⭐", "🎭", "🎨", "🎪", "🎯", "🎮", "💖"];

const emailSchema = z.object({
    email: z.string().email("Veuillez entrer une adresse email valide"),
});

const otpSchema = z.object({
    code: z.string().length(6, "Le code doit contenir 6 chiffres").regex(/^\d+$/, "Le code doit contenir uniquement des chiffres"),
});

const participantSchema = z.object({
    prenom: z.string().trim().min(2, "Le prénom doit faire au moins 2 caractères").max(50, "Le prénom est trop long"),
    classes: z.string().max(100, "Le texte est trop long").optional(),
    emoji: z.string(),
});

type AuthStep = "email" | "otp" | "participant" | "success";

interface AuthTombolaFormOTPProps {
    onAuthSuccess: () => void;
}

export function AuthTombolaFormOTP({ onAuthSuccess }: AuthTombolaFormOTPProps) {
    const { toast } = useToast();
    const [step, setStep] = useState<AuthStep>("email");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");

    const [participantData, setParticipantData] = useState({
        prenom: "",
        classes: "",
        emoji: "😊",
    });

    // Countdown timer pour renvoyer le code
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Étape 1: Demander l'email et envoyer le code
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const validation = emailSchema.safeParse({ email });
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

            const response = await fetch(apiUrl("/api/auth/send-code"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.toLowerCase() }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ email: data.error || "Erreur lors de l'envoi du code" });
                return;
            }

            toast({
                title: "Code envoyé ✅",
                description: `Un code a été envoyé à ${email}`,
            });

            setStep("otp");
            setCountdown(60);
        } catch (error) {
            console.error("Send code error:", error);
            setErrors({ email: "Une erreur est survenue" });
        } finally {
            setIsLoading(false);
        }
    };

    // Étape 2: Vérifier le code OTP
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const validation = otpSchema.safeParse({ code: otpCode });
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

            const response = await fetch(apiUrl("/api/auth/verify-code"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.toLowerCase(), code: otpCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ code: data.error || "Code invalide" });
                return;
            }

            // Stocker le token et l'utilisateur
            localStorage.setItem('tombola_auth_token', data.data.token);
            const currentUser = {
                id: data.data.user.id,
                email: data.data.user.email,
                token: data.data.token
            };
            localStorage.setItem('tombola_current_user', JSON.stringify(currentUser));

            // Vérifier si un participant existe déjà
            const participantResponse = await fetch(apiUrl("/api/tombola/participants/my"), {
                headers: {
                    "Authorization": `Bearer ${data.data.token}`,
                },
            });

            const participantData = await participantResponse.json();

            if (participantData.data && participantData.data.length > 0) {
                // Participant existe déjà, connexion réussie
                window.dispatchEvent(new Event('authStateChanged'));

                toast({
                    title: "Connecté ! ✅",
                    description: "Bienvenue dans la tombola",
                });

                onAuthSuccess();
            } else {
                // Aller à l'étape participant
                setStep("participant");
            }
        } catch (error) {
            console.error("Verify code error:", error);
            setErrors({ code: "Une erreur est survenue" });
        } finally {
            setIsLoading(false);
        }
    };

    // Étape 3: Créer le profil participant
    const handleCreateParticipant = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            if (!acceptedTerms) {
                setErrors({ terms: "Vous devez accepter la charte et les mentions légales" });
                return;
            }

            const validation = participantSchema.safeParse(participantData);
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

            const token = localStorage.getItem('tombola_auth_token');
            const currentUser = JSON.parse(localStorage.getItem('tombola_current_user') || '{}');

            const response = await fetch(apiUrl("/api/tombola/participants"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    prenom: participantData.prenom.trim(),
                    email: currentUser.email,
                    role: "Parent participant",
                    emoji: participantData.emoji,
                    ...(participantData.classes.trim() && { classes: participantData.classes.trim() }),
                    user_id: currentUser.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ prenom: data.error || "Erreur lors de la création du profil" });
                return;
            }

            window.dispatchEvent(new Event('authStateChanged'));

            toast({
                title: "Bienvenue ! 🎉",
                description: "Votre profil a été créé et vous êtes inscrit à la tombola",
            });

            setStep("success");
            setTimeout(() => {
                onAuthSuccess();
            }, 1500);
        } catch (error) {
            console.error("Create participant error:", error);
            setErrors({ prenom: "Une erreur est survenue" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (countdown > 0) return;
        await handleSendCode({ preventDefault: () => { } } as React.FormEvent);
    };

    return (
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
                        <AnimatePresence mode="wait">
                            {/* ÉTAPE EMAIL */}
                            {step === "email" && (
                                <motion.div
                                    key="email-step"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
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
                                                <Mail className="h-8 w-8 text-primary" />
                                            </motion.div>
                                        </div>

                                        <CardTitle className="mb-4 text-3xl md:text-xl font-bold text-center w-full">
                                            Inscrivez-vous à la tombola
                                        </CardTitle>
                                        <motion.p
                                            className="hidden text-center text-xs md:block md:text-sm w-full font-medium"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        >
                                            Entrez votre email pour recevoir un code de vérification
                                        </motion.p>
                                    </motion.div>

                                    <form onSubmit={handleSendCode} className="space-y-3 md:space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm md:text-base font-semibold text-foreground">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="votre@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={isLoading}
                                                className={`border-2 bg-card/80 placeholder-muted-foreground text-foreground focus:border-amber-500 focus:ring-amber-400/20 transition-all duration-300 shadow-sm ${errors.email ? "border-destructive" : "border-amber/30"
                                                    }`}
                                                autoFocus
                                            />
                                            {errors.email && <p className="text-xs md:text-sm text-destructive font-medium">{errors.email}</p>}
                                        </div>

                                        <motion.div
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="mt-6 flex justify-center"
                                        >
                                            <Button
                                                type="submit"
                                                disabled={isLoading}
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
                                                        Envoi...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Mail className="h-4 w-4" />
                                                        Recevoir le code
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>

                                        <div className="text-center pt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStep("success");
                                                    setTimeout(() => onAuthSuccess(), 500);
                                                }}
                                                className="text-xs md:text-sm text-muted-foreground hover:text-primary font-semibold transition-colors duration-200 underline underline-offset-2"
                                            >
                                                Retour à l'accueil
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* ÉTAPE OTP */}
                            {step === "otp" && (
                                <motion.div
                                    key="otp-step"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.15 }}
                                        className="flex flex-col items-center justify-center w-full mb-6"
                                    >
                                        <div className="mb-6 flex justify-center">
                                            <motion.div
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
                                            >
                                                <RefreshCw className="h-8 w-8 text-primary" />
                                            </motion.div>
                                        </div>

                                        <CardTitle className="mb-4 text-3xl md:text-xl font-bold text-center w-full">
                                            Vérifiez votre email
                                        </CardTitle>
                                        <motion.p
                                            className="hidden text-center text-xs md:block md:text-sm w-full font-medium"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        >
                                            Entrez le code reçu à <strong>{email}</strong>
                                        </motion.p>
                                    </motion.div>

                                    <form onSubmit={handleVerifyCode} className="space-y-3 md:space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="otp" className="text-sm md:text-base font-semibold text-foreground">
                                                Code de vérification (6 chiffres)
                                            </Label>
                                            <Input
                                                id="otp"
                                                type="text"
                                                placeholder="000000"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                disabled={isLoading}
                                                maxLength={6}
                                                className={`border-2 bg-card/80 placeholder-muted-foreground text-foreground focus:border-amber-500 focus:ring-amber-400/20 transition-all duration-300 shadow-sm text-center text-2xl font-mono tracking-widest ${errors.code ? "border-destructive" : "border-amber/30"
                                                    }`}
                                                autoFocus
                                            />
                                            {errors.code && <p className="text-xs md:text-sm text-destructive font-medium">{errors.code}</p>}
                                        </div>

                                        <motion.div
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="mt-6 flex justify-center"
                                        >
                                            <Button
                                                type="submit"
                                                disabled={isLoading || otpCode.length !== 6}
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
                                                        Vérification...
                                                    </>
                                                ) : (
                                                    <>
                                                        <LogIn className="h-4 w-4" />
                                                        Vérifier
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>

                                        <div className="text-center space-y-2">
                                            <button
                                                type="button"
                                                onClick={handleResendCode}
                                                disabled={countdown > 0 || isLoading}
                                                className="text-xs md:text-sm text-muted-foreground hover:text-primary font-semibold transition-colors duration-200 underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {countdown > 0 ? `Renvoyer le code (${countdown}s)` : "Renvoyer le code"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStep("email");
                                                    setOtpCode("");
                                                    setErrors({});
                                                }}
                                                className="block mx-auto text-xs md:text-sm text-muted-foreground hover:text-primary font-semibold transition-colors duration-200 underline underline-offset-2"
                                            >
                                                Changer d'email
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* ÉTAPE PARTICIPANT */}
                            {step === "participant" && (
                                <motion.div
                                    key="participant-step"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
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
                                            Créez votre profil
                                        </CardTitle>
                                        <motion.p
                                            className="hidden text-center text-xs md:block md:text-sm w-full font-medium"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        >
                                            Complétez vos informations de participant
                                        </motion.p>
                                    </motion.div>

                                    <form onSubmit={handleCreateParticipant} className="space-y-3 md:space-y-4">
                                        {/* Prénom */}
                                        <div className="space-y-2">
                                            <Label htmlFor="prenom" className="text-sm md:text-base font-semibold text-foreground">
                                                Prénom *
                                            </Label>
                                            <Input
                                                id="prenom"
                                                type="text"
                                                placeholder="Jean"
                                                value={participantData.prenom}
                                                onChange={(e) =>
                                                    setParticipantData({ ...participantData, prenom: e.target.value })
                                                }
                                                disabled={isLoading}
                                                className={`border-2 bg-card/80 placeholder-muted-foreground text-foreground focus:border-amber-500 focus:ring-amber-400/20 transition-all duration-300 shadow-sm ${errors.prenom ? "border-destructive" : "border-amber/30"
                                                    }`}
                                                autoFocus
                                            />
                                            {errors.prenom && (
                                                <p className="text-xs md:text-sm text-destructive font-medium">{errors.prenom}</p>
                                            )}
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
                                                value={participantData.classes}
                                                onChange={(e) =>
                                                    setParticipantData({ ...participantData, classes: e.target.value })
                                                }
                                                disabled={isLoading}
                                                className="border-2 bg-card/80 placeholder-muted-foreground text-foreground focus:border-amber-500 focus:ring-amber-400/20 transition-all duration-300 border-amber/30 shadow-sm"
                                            />
                                        </div>

                                        {/* Emoji Selector */}
                                        <div className="space-y-2">
                                            <Label className="text-sm md:text-base font-semibold text-foreground">
                                                Choisissez votre avatar
                                            </Label>
                                            <div className="flex flex-wrap gap-2">
                                                {EMOJI_OPTIONS.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() =>
                                                            setParticipantData({
                                                                ...participantData,
                                                                emoji
                                                            })
                                                        }
                                                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${participantData.emoji === emoji
                                                            ? "bg-primary/20 ring-2 ring-primary ring-offset-2"
                                                            : "bg-muted hover:bg-muted/80"
                                                            }`}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Terms & Conditions */}
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
                                            {errors.terms && (
                                                <p className="text-xs md:text-sm text-destructive font-medium">{errors.terms}</p>
                                            )}
                                        </div>

                                        <motion.div
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="mt-6 flex justify-center"
                                        >
                                            <Button
                                                type="submit"
                                                disabled={isLoading || !acceptedTerms}
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
                                                        Création...
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus className="h-4 w-4" />
                                                        Créer mon profil
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>
                                    </form>
                                </motion.div>
                            )}

                            {/* ÉTAPE SUCCESS */}
                            {step === "success" && (
                                <motion.div
                                    key="success-step"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col items-center justify-center text-center"
                                >
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                        }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500"
                                    >
                                        <span className="text-4xl">🎉</span>
                                    </motion.div>

                                    <h2 className="text-2xl font-bold mb-2">Bienvenue ! </h2>
                                    <p className="text-muted-foreground mb-6">
                                        Vous êtes maintenant inscrit à la tombola
                                    </p>

                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <p className="text-sm font-medium">Redirection en cours...</p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
