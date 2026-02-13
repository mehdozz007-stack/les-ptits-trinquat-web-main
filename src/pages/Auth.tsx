import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, Heart, Users, Sparkles, FileText } from "lucide-react";
import { Layout } from '@/components/layout/Layout';
import { AuthTombolaForm } from '@/components/tombola/AuthTombolaForm';
import { TombolaHero } from '@/components/tombola/TombolaHero';
import { SolidaritySection } from '@/components/tombola/SolidaritySection';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function Auth() {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useCurrentUser();

    // Si déjà authentifié, rediriger vers /tombola
    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate('/tombola', { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
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
            <title>Authentification - La Tombola des P'tits Trinquat</title>
            <meta
                name="description"
                content="Connectez-vous ou créez un compte pour participer à la tombola solidaire des P'tits Trinquat."
            />

            <TombolaHero />

            <section className="py-20 md:py-28">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                            <Heart className="h-4 w-4" />
                            Échanges Tombola
                        </span>

                        <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
                            Bienvenue dans <br /><span className="text-gradient">la Tombola des P'tits Trinquat !</span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Créez votre compte unique pour vous inscrire à la tombola, proposer des lots et participer à l'aventure.
                        </p>
                    </motion.div>

                    <div className="mx-auto max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <AuthTombolaForm
                                onAuthSuccess={() => {
                                    // Redirection automatique après succès
                                    setTimeout(() => {
                                        navigate('/tombola', { replace: true });
                                    }, 500);
                                }}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-b from-muted/30 via-background to-muted/20 py-16 md:py-20">
                <div className="container">
                    <div className="flex justify-center mb-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                            <FileText className="h-4 w-4" />
                            Démarches
                        </span>
                    </div>
                    <h2 className="mb-10 text-3xl font-extrabold md:text-4xl text-center">
                        Votre <span className="text-gradient">Guide</span>
                    </h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-sky/10 p-8 md:p-12 max-w-2xl mx-auto via-amber/8 border border-amber/20 shadow-lg shadow-amber/10 backdrop-blur-sm hover:shadow-amber/15 transition-all duration-500"
                    >
                        <div className="mb-6 flex justify-center">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
                            >
                                <HelpCircle className="h-8 w-8 text-primary" />
                            </motion.div>
                        </div>

                        {/* Sous-titre */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-center mb-8"
                        >
                            <h3 className="mb-4 text-center text-2xl font-bold md:text-3xl">
                                Comment ça marche ?
                            </h3>
                        </motion.div>

                        {/* Liste des étapes avec animation en cascade */}
                        <motion.ul
                            className="space-y-4"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.12,
                                        delayChildren: 0.4,
                                    },
                                },
                            }}
                        >
                            {[
                                "Nouveau ? Inscrivez-vous",
                                "Devenez participant automatiquement",
                                "Proposez et échangez des lots",
                                "Rejoignez les familles participantes"
                            ].map((item, index) => (
                                <motion.li
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, x: -20 },
                                        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                                    }}
                                    whileHover={{ x: 8, transition: { duration: 0.2 } }}
                                    className="flex items-center gap-3 text-sm md:text-base text-foreground/80 transition-colors duration-300 cursor-default"
                                >
                                    <motion.span
                                        className="text-lg flex-shrink-0"
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        ✅
                                    </motion.span>
                                    <span className="font-medium">{item}</span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                </div>
            </section>
            <SolidaritySection />
        </Layout>
    );
}
