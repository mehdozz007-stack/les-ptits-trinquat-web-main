import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Check, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTombolaParticipants } from "@/hooks/useTombolaParticipants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/use-toast";
import { AuthTombolaForm } from "./AuthTombolaForm";

export function ParticipantForm() {
  const { user, token, isAuthenticated, login, register } = useCurrentUser();
  const { participants, deleteParticipant, fetchMyParticipants } = useTombolaParticipants(false);
  const { toast } = useToast();

  const [deleting, setDeleting] = useState(false);

  // Charger les participants quand on est authentifié
  useEffect(() => {
    if (isAuthenticated && token && user?.id) {
      fetchMyParticipants(token, user.id);
    }
  }, [isAuthenticated, token, user?.id, fetchMyParticipants]);

  // Rafraîchir les participants quand la fenêtre retrouve le focus
  useEffect(() => {
    if (!isAuthenticated || !token || !user?.id) return;

    const handleFocus = () => {
      console.log('📱 Window focused - refreshing my participants');
      fetchMyParticipants(token, user.id);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, token, user?.id, fetchMyParticipants]);

  // Rafraîchir périodiquement
  useEffect(() => {
    if (!isAuthenticated || !token || !user?.id) return;

    const interval = setInterval(() => {
      console.log('⏱️ Periodic refresh - syncing my participants');
      fetchMyParticipants(token, user.id);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, token, user?.id, fetchMyParticipants]);

  // Si non authentifié, afficher AuthTombolaForm
  if (!isAuthenticated || !token) {
    return (
      <section className="bg-gradient-to-b from-muted/30 via-primary/5 to-muted/20 py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm font-semibold text-primary">
              <UserPlus className="h-4 w-4" />
              Rejoignez-nous
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Un seul compte pour tout ! 🎯
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Créez votre compte unique pour vous inscrire à la tombola, proposer des lots et participer à l'aventure.
            </p>
          </motion.div>

          <AuthTombolaForm
            onAuthSuccess={() => {
              toast({
                title: "Bienvenue ! 🎉",
                description: "Vous êtes connecté et inscrit à la tombola",
              });
              // Participant sera créé automatiquement
            }}
            onLogin={login}
            onRegister={register}
          />
        </div>
      </section>
    );
  }

  const handleDeleteParticipant = async (participantId: string) => {
    if (!token) return;

    if (!confirm("Êtes-vous sûr ? Cette action supprimera votre participation et tous vos lots.")) {
      return;
    }

    setDeleting(true);
    const { error } = await deleteParticipant(participantId, token);
    setDeleting(false);

    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Supprimé ! 🗑️",
      description: "Votre participation a été supprimée. Redirection en cours...",
    });

    // Nettoyer et recharger
    setTimeout(() => {
      localStorage.removeItem('tombola_auth_token');
      localStorage.removeItem('tombola_current_user');
      window.location.reload();
    }, 1000);
  };

  return (
    <section className="bg-gradient-to-b from-muted/20 via-primary/5 to-muted/10 py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm font-semibold text-primary">
            <UserPlus className="h-4 w-4" />
            Votre profil
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {participants.length > 0 ? "Votre participation" : "Aucun participant"}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {participants.length > 0
              ? "Voici votre profil pour la tombola. Vous pouvez le supprimer si vous changez d'avis."
              : "Vous avez été automatiquement inscrit dès votre création de compte ! 🎉"}
          </p>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          {participants.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {participants.map((participant) => (
                <Card
                  key={participant.id}
                  className="overflow-hidden border border-primary/20 bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="bg-gradient-to-r from-blue-100/60 via-primary/20 to-slate-100/60 border-b border-primary/15">
                    <CardTitle className="flex items-center gap-4 text-lg">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-blue-50 text-4xl shadow-md"
                      >
                        {participant.emoji}
                      </motion.div>
                      <div className="text-left flex-1">
                        <p className="text-lg font-bold text-slate-800">{participant.prenom}</p>
                        {participant.classes && (
                          <p className="text-sm text-slate-500 font-medium">{participant.classes}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          Inscrit(e) le {new Date(participant.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="mb-5 text-sm text-slate-600 leading-relaxed">
                      Vous êtes maintenant participant à la tombola ! Vous pouvez proposer des lots et en réserver d'autres.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 gap-2 border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-200"
                        disabled={deleting}
                        onClick={() => handleDeleteParticipant(participant.id)}
                      >
                        {deleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Supprimer mon profil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">En cours de chargement...</p>
              <Loader2 className="h-8 w-8 animate-spin mx-auto mt-4 text-primary" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
