import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check, X, LogOut, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TombolaAPI } from "@/lib/db/tombolaAPI";
import { Parent, Lot } from "@/lib/types";
import { AnimatedSuccessMessage, AnimatedErrorMessage } from "@/components/AnimatedMessage";

interface AdminMessage {
    type: 'success' | 'error';
    title: string;
    message: string;
    emoji?: string;
}

export default function AdminTombola() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const [parents, setParents] = useState<Parent[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<AdminMessage | null>(null);

    // Auto-hide messages
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        setLoading(true);

        try {
            // Tentative de connexion via l'API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: adminEmail.toLowerCase(),
                    password: adminPassword,
                }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Identifiants invalides' }));
                setLoginError(error.error || "Email ou mot de passe incorrect");
                return;
            }

            const data = await response.json();
            if (data.success) {
                // Stocker le token correctement pour getAuth()
                if (data.data?.token) {
                    // Stocker en tant qu'objet JSON avec la structure attendue
                    localStorage.setItem('tombola_auth', JSON.stringify({
                        parentId: 'admin',
                        email: adminEmail.toLowerCase(),
                    }));
                    localStorage.setItem('admin_token', data.data.token);
                    console.log('✅ Admin token stocké:', data.data.token.substring(0, 20) + '...');
                }
                setIsLoggedIn(true);
                setAdminEmail("");
                setAdminPassword("");

                // Attendre un peu que le stockage se synchronise
                setTimeout(() => {
                    console.log('📊 Chargement des données admin...');
                    loadData();
                }, 100);

                setMessage({
                    type: 'success',
                    title: 'Connecté',
                    message: 'Vous êtes connecté en tant qu\'administrateur',
                    emoji: '✅'
                });
            } else {
                setLoginError(data.error || "Email ou mot de passe incorrect");
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError("Erreur de connexion au serveur");
        } finally {
            setLoading(false);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [parentsList, lotsList] = await Promise.all([
                TombolaAPI.getAdminParents(),
                TombolaAPI.getLots(),
            ]);
            setParents(parentsList || []);
            setLots(lotsList || []);
        } catch (error) {
            console.error("Error loading data:", error);
            setMessage({
                type: 'error',
                title: 'Erreur de chargement',
                message: 'Impossible de charger les données',
                emoji: '⚠️'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteParticipant = async (id: string, name: string) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${name}? Ses lots seront aussi supprimés.`)) {
            return;
        }

        try {
            await TombolaAPI.adminDeleteParticipant(id);
            setParents(parents.filter(p => p.id !== id));
            setLots(lots.filter(l => l.parent_id !== id));
            setMessage({
                type: 'success',
                title: 'Participant supprimé',
                message: `${name} et ses lots ont été supprimés.`,
                emoji: '✅'
            });
        } catch (error) {
            setMessage({
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de supprimer le participant',
                emoji: '⚠️'
            });
        }
    };

    const handleCancelReservation = async (lotId: string, lotName: string) => {
        if (!window.confirm(`Annuler la réservation de "${lotName}"?`)) {
            return;
        }

        try {
            await TombolaAPI.adminCancelReservation(lotId);
            const updatedLots = await TombolaAPI.getLots();
            setLots(updatedLots || []);
            setMessage({
                type: 'success',
                title: 'Réservation annulée',
                message: `La réservation de "${lotName}" a été annulée.`,
                emoji: '✅'
            });
        } catch (error) {
            setMessage({
                type: 'error',
                title: 'Erreur',
                message: 'Impossible d\'annuler la réservation',
                emoji: '⚠️'
            });
        }
    };

    const handleMarkAsDelivered = async (lotId: string, lotName: string) => {
        if (!window.confirm(`Marquer "${lotName}" comme remis?`)) {
            return;
        }

        try {
            await TombolaAPI.adminMarkAsDelivered(lotId);
            const updatedLots = await TombolaAPI.getLots();
            setLots(updatedLots || []);
            setMessage({
                type: 'success',
                title: 'Lot marqué comme remis',
                message: `"${lotName}" est maintenant marqué comme remis.`,
                emoji: '✅'
            });
        } catch (error) {
            setMessage({
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de marquer le lot comme remis',
                emoji: '⚠️'
            });
        }
    };

    const handleDeleteLot = async (id: string, name: string) => {
        if (!window.confirm(`Supprimer définitivement le lot "${name}"?`)) {
            return;
        }

        try {
            await TombolaAPI.adminDeleteLot(id);
            setLots(lots.filter(l => l.id !== id));
            setMessage({
                type: 'success',
                title: 'Lot supprimé',
                message: `Le lot "${name}" a été supprimé.`,
                emoji: '✅'
            });
        } catch (error) {
            setMessage({
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de supprimer le lot',
                emoji: '⚠️'
            });
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setParents([]);
        setLots([]);
        setAdminEmail("");
        setAdminPassword("");
        // Nettoyer le localStorage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('tombola_auth');
    };

    const handleRefresh = async () => {
        await loadData();
        setMessage({
            type: 'success',
            title: 'Données actualisées',
            message: 'Les données ont été rechargées avec succès.',
            emoji: '🔄'
        });
    };

    if (!isLoggedIn) {
        return (
            <Layout>
                <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-secondary/5 to-accent/10 py-20">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-md mx-auto"
                        >
                            <Card className="border-2 border-primary/30 shadow-lg">
                                <CardContent className="p-8">
                                    <h1 className="text-2xl font-bold mb-2 text-center">🔐 Admin Tombola</h1>
                                    <p className="text-muted-foreground text-center mb-6">Connectez-vous pour accéder à l'administration</p>

                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold mb-2 block">Email</label>
                                            <Input
                                                type="email"
                                                placeholder="admin@email.com"
                                                value={adminEmail}
                                                onChange={(e) => setAdminEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold mb-2 block">Mot de passe</label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={adminPassword}
                                                onChange={(e) => setAdminPassword(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {loginError && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                <p className="text-red-700 text-sm font-semibold">⚠️ {loginError}</p>
                                            </div>
                                        )}

                                        <Button type="submit" className="w-full" disabled={loading}>
                                            {loading ? "Connexion en cours..." : "Se connecter"}
                                        </Button>
                                    </form>

                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-xs text-blue-700 font-mono">
                                            <strong>Identifiants admin:</strong><br />
                                            Email: admin@email.com<br />
                                            Mot de passe: Entrez le mot de passe admin défini dans votre fichier .env.local (ADMIN_PASSWORD)
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Messages */}
            <AnimatePresence>
                {message && (
                    message.type === 'success' ? (
                        <AnimatedSuccessMessage
                            title={message.title}
                            message={message.message}
                            emoji={message.emoji}
                        />
                    ) : (
                        <AnimatedErrorMessage
                            title={message.title}
                            message={message.message}
                            emoji={message.emoji || "⚠️"}
                        />
                    )
                )}
            </AnimatePresence>

            {/* Header */}
            <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 border-b">
                <div className="container">
                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-3xl font-bold">🎁 Administration Tombola</h1>
                            <p className="text-muted-foreground mt-1">Gestion des participants et lots</p>
                        </motion.div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Actualiser
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleLogout}
                                className="flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container">
                    {loading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Chargement des données...</p>
                        </div>
                    )}

                    {!loading && (
                        <div className="space-y-12">
                            {/* Participants Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    👥 Participants
                                    <span className="text-sm font-normal text-muted-foreground">({parents.length})</span>
                                </h2>

                                {parents.length === 0 ? (
                                    <Card>
                                        <CardContent className="p-8 text-center text-muted-foreground">
                                            Aucun participant pour le moment
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid gap-4">
                                        {parents.map((parent) => (
                                            <motion.div
                                                key={parent.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <Card className="hover:shadow-lg transition-shadow">
                                                    <CardContent className="p-6">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <span className="text-3xl">{parent.emoji}</span>
                                                                    <div>
                                                                        <h3 className="font-bold text-lg">{parent.first_name}</h3>
                                                                        <p className="text-sm text-muted-foreground">{parent.email}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2 flex-wrap">
                                                                    {parent.classes && (
                                                                        <span className="inline-block bg-primary/10 px-2 py-1 rounded text-xs font-medium text-primary">
                                                                            {parent.classes}
                                                                        </span>
                                                                    )}
                                                                    <span className="inline-block bg-muted px-2 py-1 rounded text-xs text-muted-foreground">
                                                                        {parent.created_at ? new Date(parent.created_at).toLocaleDateString('fr-FR') : ''}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDeleteParticipant(parent.id, parent.first_name)}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                Supprimer
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Lots Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    🎁 Lots
                                    <span className="text-sm font-normal text-muted-foreground">({lots.length})</span>
                                </h2>

                                {lots.length === 0 ? (
                                    <Card>
                                        <CardContent className="p-8 text-center text-muted-foreground">
                                            Aucun lot pour le moment
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid gap-4">
                                        {lots.map((lot) => {
                                            const owner = parents.find(p => p.id === lot.parent_id);
                                            return (
                                                <motion.div
                                                    key={lot.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <Card className={`hover:shadow-lg transition-shadow ${lot.status === 'available'
                                                        ? 'border-l-4 border-l-green-500'
                                                        : lot.status === 'reserved'
                                                            ? 'border-l-4 border-l-yellow-500'
                                                            : 'border-l-4 border-l-red-500'
                                                        }`}>
                                                        <CardContent className="p-6">
                                                            <div className="flex justify-between items-start gap-4">
                                                                <div className="flex-1">
                                                                    <div className="flex items-start gap-3 mb-3">
                                                                        <span className="text-2xl">🎁</span>
                                                                        <div>
                                                                            <h3 className="font-bold text-lg">{lot.title}</h3>
                                                                            {lot.description && (
                                                                                <p className="text-sm text-muted-foreground mb-2">{lot.description}</p>
                                                                            )}
                                                                            <p className="text-sm font-medium">
                                                                                Proposé par: <span className="text-primary">{owner?.first_name || 'N/A'}</span>
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex gap-2 flex-wrap mb-3">
                                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${lot.status === 'available'
                                                                            ? 'bg-green-500/20 text-green-700'
                                                                            : lot.status === 'reserved'
                                                                                ? 'bg-yellow-500/20 text-yellow-700'
                                                                                : 'bg-red-500/20 text-red-700'
                                                                            }`}>
                                                                            {lot.status === 'available' && '🟢 Disponible'}
                                                                            {lot.status === 'reserved' && '🟡 Réservé'}
                                                                            {lot.status === 'delivered' && '🔴 Remis'}
                                                                        </span>
                                                                        {lot.created_at && (
                                                                            <span className="inline-block bg-muted px-2 py-1 rounded text-xs text-muted-foreground">
                                                                                {new Date(lot.created_at).toLocaleDateString('fr-FR')}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col gap-2">
                                                                    {lot.status === 'available' && (
                                                                        <>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleMarkAsDelivered(lot.id, lot.title)}
                                                                                className="flex items-center gap-2 whitespace-nowrap"
                                                                            >
                                                                                <Check className="h-4 w-4" />
                                                                                Remis
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="destructive"
                                                                                onClick={() => handleDeleteLot(lot.id, lot.title)}
                                                                                className="flex items-center gap-2"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                                Supprimer
                                                                            </Button>
                                                                        </>
                                                                    )}

                                                                    {lot.status === 'reserved' && (
                                                                        <>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleCancelReservation(lot.id, lot.title)}
                                                                                className="flex items-center gap-2 whitespace-nowrap"
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                                Annuler résa
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleMarkAsDelivered(lot.id, lot.title)}
                                                                                className="flex items-center gap-2 whitespace-nowrap"
                                                                            >
                                                                                <Check className="h-4 w-4" />
                                                                                Remis
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="destructive"
                                                                                onClick={() => handleDeleteLot(lot.id, lot.title)}
                                                                                className="flex items-center gap-2"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </>
                                                                    )}

                                                                    {lot.status === 'delivered' && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="destructive"
                                                                            onClick={() => handleDeleteLot(lot.id, lot.title)}
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                            Supprimer
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>

                            {/* Statistics */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                            >
                                <Card>
                                    <CardContent className="p-6 text-center">
                                        <div className="text-3xl font-bold text-primary">{parents.length}</div>
                                        <p className="text-sm text-muted-foreground mt-1">Participants</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6 text-center">
                                        <div className="text-3xl font-bold text-green-600">{lots.filter(l => l.status === 'available').length}</div>
                                        <p className="text-sm text-muted-foreground mt-1">Lots disponibles</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6 text-center">
                                        <div className="text-3xl font-bold text-yellow-600">{lots.filter(l => l.status === 'reserved').length}</div>
                                        <p className="text-sm text-muted-foreground mt-1">Réservés</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6 text-center">
                                        <div className="text-3xl font-bold text-red-600">{lots.filter(l => l.status === 'delivered').length}</div>
                                        <p className="text-sm text-muted-foreground mt-1">Remis</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
