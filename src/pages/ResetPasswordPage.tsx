import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { apiUrl } from "@/lib/api-config";

const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const token = searchParams.get("token");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (!token) {
            setErrors({ form: "Le lien de réinitialisation est invalide" });
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            if (!token) {
                setErrors({ form: "Le lien de réinitialisation est invalide" });
                return;
            }

            const validation = resetPasswordSchema.safeParse(formData);
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
                    token,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ form: data.error || "Erreur lors de la réinitialisation" });
                return;
            }

            toast({
                title: "Mot de passe réinitialisé ✅",
                description: "Vous pouvez maintenant vous connecter",
            });

            setSuccess(true);

            // Rediriger après 3 secondes
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (error) {
            console.error("Reset password error:", error);
            setErrors({ form: "Une erreur s'est produite" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50/40 via-orange-100/35 to-amber-50/30"
        >
            <Card className="w-full max-w-md border border-amber/30 shadow-2xl bg-white/80 backdrop-blur-xl">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
                        >
                            <Lock className="h-8 w-8 text-primary" />
                        </motion.div>
                    </div>

                    <h1 className="text-3xl font-bold text-center mb-2">
                        Réinitialiser votre mot de passe
                    </h1>
                    <p className="text-center text-muted-foreground text-sm mb-6">
                        Entrez votre nouveau mot de passe
                    </p>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
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
                            <h2 className="font-semibold text-lg">Réussi!</h2>
                            <p className="text-sm text-muted-foreground">
                                Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Redirection vers la page de connexion...
                            </p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Error Message */}
                            {errors.form && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive px-3 py-2 rounded-md text-sm"
                                >
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    {errors.form}
                                </motion.div>
                            )}

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">
                                    Nouveau mot de passe
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600/50" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Minimum 8 caractères"
                                        value={formData.newPassword}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
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

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">
                                    Confirmer mot de passe
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600/50" />
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Répéter le mot de passe"
                                        value={formData.confirmPassword}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
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
                                {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                            </Button>

                            <Button
                                type="button"
                                onClick={() => navigate("/")}
                                variant="outline"
                                className="w-full"
                            >
                                Annuler
                            </Button>
                        </form>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
