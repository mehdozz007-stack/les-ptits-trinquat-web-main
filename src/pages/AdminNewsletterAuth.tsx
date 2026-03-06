import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';

export default function AdminNewsletterAuth() {
    const navigate = useNavigate();
    const { user, isLoading: isAuthLoading, signIn } = useAdminAuth();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [debugError, setDebugError] = useState<string | null>(null);

    // Si déjà authentifié, rediriger vers l'admin newsletter
    useEffect(() => {
        if (!isAuthLoading && user) {
            navigate('/admin/newsletter', { replace: true });
        }
    }, [user, isAuthLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setDebugError(null);

        console.log('[AdminNewsletterAuth] Tentative de connexion avec email:', email);

        try {
            const { error } = await signIn(email, password);

            if (error) {
                console.error('[AdminNewsletterAuth] Erreur de connexion:', error);
                setDebugError(error.message);
            } else {
                console.log('[AdminNewsletterAuth] Connexion réussie');
                // Redirection automatique via le hook
                setTimeout(() => {
                    navigate('/admin/newsletter', { replace: true });
                }, 500);
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Erreur inconnue';
            console.error('[AdminNewsletterAuth] Exception:', msg);
            setDebugError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFBF7] via-[#F8F5FF] to-[#F5F9FF]">
                    <motion.div
                        animate={{ opacity: 0.5 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-lg text-muted-foreground"
                    >
                        Chargement...
                    </motion.div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-[#FFFBF7] via-[#F8F5FF] to-[#F5F9FF] flex items-center justify-center p-4 sm:p-6 md:p-8" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-6"
                >
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md mx-auto">
                            <Mail className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#FF7B42] to-[#C55FA8] bg-clip-text text-transparent">
                            Administration Newsletter
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Connectez-vous pour gérer les newsletters
                        </p>
                    </div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/90 backdrop-blur-sm border border-orange-100/50 rounded-xl shadow-lg p-6 sm:p-8 space-y-5"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-700 block">
                                    Adresse email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-400 pointer-events-none" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9 sm:pl-10 text-sm sm:text-base border-orange-100 focus:border-orange-400 focus:ring-orange-400/20 bg-orange-50/30"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-xs sm:text-sm font-semibold text-gray-700 block">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-400 pointer-events-none" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9 sm:pl-10 text-sm sm:text-base border-orange-100 focus:border-orange-400 focus:ring-orange-400/20 bg-orange-50/30"
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {debugError && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm"
                                >
                                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-red-700">
                                        <p className="font-semibold text-xs sm:text-sm">Erreur de connexion</p>
                                        <p className="text-xs mt-1">{debugError}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading || !email || !password}
                                className="w-full bg-gradient-to-r from-[#FF7B42] to-[#C55FA8] hover:from-[#FF6B32] hover:to-[#B54F98] disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        <span>Connexion...</span>
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </Button>
                        </form>

                        {/* Info Box */}
                        <div className="bg-orange-50/50 border border-orange-200 rounded-lg p-4 text-xs sm:text-sm text-gray-700 space-y-2">
                            <p className="font-semibold">📧 Information importante</p>
                            <p>
                                Cette page est réservée aux administrateurs newsletter. Si vous n'avez pas de compte, veuillez contacter l'administrateur du site.
                            </p>
                        </div>
                    </motion.div>

                    {/* Back Link */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-xs sm:text-sm text-muted-foreground hover:text-orange-600 font-semibold transition-colors"
                        >
                            ← Retour à l'accueil
                        </button>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
