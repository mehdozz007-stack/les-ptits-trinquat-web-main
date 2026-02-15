import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { apiUrl } from "@/lib/api-config";

const forgotPasswordSchema = z.object({
    email: z.string().email("Veuillez entrer une adresse email valide"),
});

const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ModalStep = "forgot" | "reset" | "success";

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const { toast } = useToast();
    const [step, setStep] = useState<ModalStep>("forgot");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [resetToken, setResetToken] = useState("");

    const [forgotData, setForgotData] = useState({
        email: "",
    });

    const [resetData, setResetData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const validation = forgotPasswordSchema.safeParse(forgotData);
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

            const response = await fetch(apiUrl("/api/auth/forgot-password"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotData.email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ email: data.error || "Erreur lors de la demande de réinitialisation" });
                return;
            }

            toast({
                title: "Email envoyé ✅",
                description: "Vérifiez votre mail pour le lien de réinitialisation",
            });

            setStep("success");
        } catch (error) {
            console.error("Forgot password error:", error);
            setErrors({ email: "Une erreur s'est produite" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const validation = resetPasswordSchema.safeParse(resetData);
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

            const response = await fetch(apiUrl("/api/auth/reset-password"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: resetToken,
                    newPassword: resetData.newPassword,
                    confirmPassword: resetData.confirmPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ password: data.error || "Erreur lors de la réinitialisation" });
                return;
            }

            toast({
                title: "Mot de passe réinitialisé ✅",
                description: "Vous pouvez maintenant vous connecter",
            });

            setStep("success");
        } catch (error) {
            console.error("Reset password error:", error);
            setErrors({ password: "Une erreur s'est produite" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setStep("forgot");
        setErrors({});
        setResetToken("");
        setForgotData({ email: "" });
        setResetData({ newPassword: "", confirmPassword: "" });
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <Card className="w-full max-w-md border border-amber/30 shadow-2xl bg-gradient-to-br from-amber-50/40 via-orange-100/35 to-amber-50/30 backdrop-blur-xl">
                            <div className="p-8">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-center flex-1">
                                        {step === "forgot" && "Réinitialiser"}
                                        {step === "reset" && "Nouveau mot de passe"}
                                        {step === "success" && "Réussi! ✨"}
                                    </h2>
                                    <button
                                        onClick={handleClose}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Forgot Password Step */}
                                {step === "forgot" && (
                                    <motion.form
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleForgotSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Adresse email
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600/50" />
                                                <Input
                                                    type="text"
                                                    placeholder="votre@email.com"
                                                    value={forgotData.email}
                                                    onChange={(e) =>
                                                        setForgotData({ ...forgotData, email: e.target.value })
                                                    }
                                                    disabled={isLoading}
                                                    className={`pl-10 border-2 ${errors.email ? "border-destructive" : "border-amber/30"
                                                        }`}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-xs text-destructive font-medium">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Nous vous enverrons un lien de réinitialisation par email.
                                        </p>

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-primary via-secondary text-primary-foreground"
                                        >
                                            {isLoading ? "Envoi..." : "Envoyer le lien"}
                                        </Button>
                                    </motion.form>
                                )}

                                {/* Reset Password Step */}
                                {step === "reset" && (
                                    <motion.form
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleResetSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Nouveau mot de passe
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600/50" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Minimum 8 caractères"
                                                    value={resetData.newPassword}
                                                    onChange={(e) =>
                                                        setResetData({
                                                            ...resetData,
                                                            newPassword: e.target.value,
                                                        })
                                                    }
                                                    disabled={isLoading}
                                                    className={`pl-10 pr-10 border-2 ${errors.newPassword ? "border-destructive" : "border-amber/30"
                                                        }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600/50 hover:text-amber-600"
                                                >
                                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                                </button>
                                            </div>
                                            {errors.newPassword && (
                                                <p className="text-xs text-destructive font-medium">
                                                    {errors.newPassword}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Confirmer mot de passe
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600/50" />
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Répéter le mot de passe"
                                                    value={resetData.confirmPassword}
                                                    onChange={(e) =>
                                                        setResetData({
                                                            ...resetData,
                                                            confirmPassword: e.target.value,
                                                        })
                                                    }
                                                    disabled={isLoading}
                                                    className={`pl-10 pr-10 border-2 ${errors.confirmPassword
                                                            ? "border-destructive"
                                                            : "border-amber/30"
                                                        }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600/50 hover:text-amber-600"
                                                >
                                                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="text-xs text-destructive font-medium">
                                                    {errors.confirmPassword}
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-primary via-secondary text-primary-foreground"
                                        >
                                            {isLoading
                                                ? "Réinitialisation..."
                                                : "Réinitialiser le mot de passe"}
                                        </Button>

                                        <button
                                            type="button"
                                            onClick={() => setStep("forgot")}
                                            className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <ArrowLeft className="h-3 w-3" />
                                            Retour
                                        </button>
                                    </motion.form>
                                )}

                                {/* Success Step */}
                                {step === "success" && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center space-y-4"
                                    >
                                        <div className="flex justify-center mb-4">
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 0.5, repeat: Infinity }}
                                            >
                                                <CheckCircle className="h-16 w-16 text-green-500" />
                                            </motion.div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-2">
                                                {resetToken ? "Mot de passe réinitialisé!" : "Email envoyé!"}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {resetToken
                                                    ? "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
                                                    : "Vérifiez votre adresse email pour le lien de réinitialisation. Le lien expire dans 15 minutes."}
                                            </p>
                                        </div>

                                        <Button
                                            onClick={handleClose}
                                            className="w-full bg-gradient-to-r from-primary via-secondary text-primary-foreground"
                                        >
                                            Fermer
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
