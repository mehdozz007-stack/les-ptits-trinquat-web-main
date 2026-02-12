import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
    onLoginSuccess: () => void;
    onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    onRegister: (email: string, password: string, passwordConfirm: string) => Promise<{ success: boolean; error?: string }>;
    loading?: boolean;
}

export function LoginForm({ onLoginSuccess, onLogin, onRegister, loading = false }: LoginFormProps) {
    const { toast } = useToast();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            if (isRegisterMode) {
                // Validation register
                if (!formData.email || !formData.password || !formData.passwordConfirm) {
                    setErrors({
                        email: !formData.email ? "Email requis" : "",
                        password: !formData.password ? "Mot de passe requis" : "",
                        passwordConfirm: !formData.passwordConfirm ? "Confirmation requise" : "",
                    });
                    return;
                }

                if (formData.password !== formData.passwordConfirm) {
                    setErrors({ passwordConfirm: "Les mots de passe ne correspondent pas" });
                    return;
                }

                if (formData.password.length < 8) {
                    setErrors({ password: "Le mot de passe doit faire au moins 8 caractères" });
                    return;
                }

                const result = await onRegister(formData.email, formData.password, formData.passwordConfirm);
                if (result.success) {
                    toast({
                        title: "Compte créé et authentifié ! 🎉",
                        description: "Bienvenue dans la tombola",
                    });
                    // Authentification automatique réussie
                    onLoginSuccess();
                    setFormData({ email: "", password: "", passwordConfirm: "" });
                } else {
                    setErrors({ email: result.error || "Erreur lors de l'enregistrement" });
                }
            } else {
                // Validation login
                if (!formData.email || !formData.password) {
                    setErrors({
                        email: !formData.email ? "Email requis" : "",
                        password: !formData.password ? "Mot de passe requis" : "",
                    });
                    return;
                }

                const result = await onLogin(formData.email, formData.password);
                if (result.success) {
                    toast({
                        title: "Connecté !",
                        description: "Bienvenue dans votre espace",
                    });
                    onLoginSuccess();
                    setFormData({ email: "", password: "", passwordConfirm: "" });
                } else {
                    setErrors({ email: result.error || "Email ou mot de passe incorrect" });
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xs md:max-w-md mx-auto"
        >
            <Card className="shadow-lg">
                <CardHeader className="space-y-0 py-2 md:space-y-1 md:py-4">
                    <CardTitle className="text-center text-base md:text-2xl">
                        {isRegisterMode ? "Créer mon compte" : "Me connecter"}
                    </CardTitle>
                    <p className="hidden text-center text-xs md:block md:text-sm text-muted-foreground">
                        {isRegisterMode
                            ? "Créez un compte pour accéder à la tombola"
                            : "Connectez-vous avec vos identifiants"}
                    </p>
                </CardHeader>

                <CardContent className="p-3 md:p-6">
                    <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-4">
                        {/* Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="votre@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={isLoading || loading}
                                className={errors.email ? "border-destructive" : ""}
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-sm md:text-base">Mot de passe</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={isRegisterMode ? "Minimum 8 caractères" : "••••••••"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={isLoading || loading}
                                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        {/* Confirm Password (Register only) */}
                        <AnimatePresence>
                            {isRegisterMode && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1">
                                    <Label htmlFor="passwordConfirm" className="text-sm md:text-base">Confirmer mot de passe</Label>
                                    <div className="relative">
                                        <Input
                                            id="passwordConfirm"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Répéter le mot de passe"
                                            value={formData.passwordConfirm}
                                            onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                                            disabled={isLoading || loading}
                                            className={errors.passwordConfirm ? "border-destructive pr-10" : "pr-10"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.passwordConfirm && <p className="text-sm text-destructive">{errors.passwordConfirm}</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading || loading}
                            className="w-full gap-2"
                        >
                            {isLoading || loading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                                    {isRegisterMode ? "Création..." : "Connexion..."}
                                </>
                            ) : isRegisterMode ? (
                                <>
                                    <UserPlus className="h-4 w-4" />
                                    Créer mon compte
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4" />
                                    Me connecter
                                </>
                            )}
                        </Button>

                        {/* Toggle Mode */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegisterMode(!isRegisterMode);
                                    setErrors({});
                                    setFormData({ email: formData.email, password: "", passwordConfirm: "" });
                                }}
                                className="text-sm text-muted-foreground hover:text-foreground underline"
                            >
                                {isRegisterMode ? "Déjà enregistré ? Se connecter" : "Créer un nouveau compte"}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}
