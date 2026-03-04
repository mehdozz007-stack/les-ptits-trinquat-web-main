import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { TombolaHero } from "@/components/tombola/TombolaHero";
import { ParticipantGrid } from "@/components/tombola/ParticipantGrid";
import { LotGrid } from "@/components/tombola/LotGrid";
import { LotForm } from "@/components/tombola/LotForm";
import { SolidaritySection } from "@/components/tombola/SolidaritySection";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useTombolaParticipants } from "@/hooks/useTombolaParticipants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { TombolaParticipantPublic } from "@/hooks/useTombolaParticipants";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Tombola() {
    const navigate = useNavigate();
    const { isReady, isLoading } = useProtectedRoute();
    const { logout, token, user } = useCurrentUser();
    const { participants, fetchMyParticipants } = useTombolaParticipants(false);
    const [currentParticipant, setCurrentParticipant] = useState<TombolaParticipantPublic | null>(null);

    // Charger les participants de l'utilisateur quand le token change
    useEffect(() => {
        if (isReady && token && user?.id) {
            fetchMyParticipants(token, user.id);
        }
    }, [isReady, token, user?.id, fetchMyParticipants]);

    // Auto-select premier participant si disponible
    useEffect(() => {
        if (participants && participants.length > 0 && !currentParticipant) {
            setCurrentParticipant(participants[0]);
        }
    }, [participants]);

    const handleLogout = () => {
        logout();
        navigate('/auth', { replace: true });
    };

    // Protection de la route
    if (isLoading) {
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

    if (!isReady) {
        return null; // Redirection vers /auth en cours
    }

    return (
        <Layout>
            {/* SEO Meta */}
            <title>La Tombola des P'tits Trinquat | Association de Parents d'Élèves</title>
            <meta
                name="description"
                content="Participez à la tombola solidaire des P'tits Trinquat. Proposez des lots et échangez entre familles dans un esprit convivial et bienveillant."
            />

            <TombolaHero />
            <ParticipantGrid currentParticipant={currentParticipant} />
            <LotForm currentParticipant={currentParticipant} />
            <LotGrid currentParticipant={currentParticipant} />
            <SolidaritySection />

            {/* Bouton flottant de déconnexion - bas à gauche */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="fixed bottom-6 left-6 z-50"
            >
                <Button
                    onClick={handleLogout}
                    size="lg"
                    className="gap-2 rounded-full bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    <LogOut className="h-5 w-5" />
                    Déconnexion
                </Button>
            </motion.div>
        </Layout>
    );
}
