import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link, Navigate } from 'react-router-dom';
import { Trash2, Check, X, LogOut, RotateCcw, ArrowLeft, Gift, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TombolaAPI } from "@/lib/db/tombolaAPI";
import { Parent, Lot } from "@/lib/types";
import { AnimatedSuccessMessage, AnimatedErrorMessage } from "@/components/AnimatedMessage";
import { useUnifiedAdminAuth } from "@/hooks/useUnifiedAdminAuth";

interface AdminMessage {
    type: 'success' | 'error';
    title: string;
    message: string;
    emoji?: string;
}

export default function AdminTombola() {
    const { user, isLoading, isAuthenticated, signOut } = useUnifiedAdminAuth();

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

    // Rediriger vers le login si pas authentifié
    if (!isLoading && !isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // Charger les données au montage
    useEffect(() => {
        if (isAuthenticated && !loading && parents.length === 0) {
            loadData();
        }
    }, [isAuthenticated, isLoading]);

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
        signOut();
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

    // Page de chargement
    if (isLoading) {
        return (
            <AdminLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-muted-foreground">Chargement...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Les références non-authentifiées sont déjà gérées par le Navigate plus haut
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-[#FFFBF7] via-[#F8F5FF] to-[#F5F9FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-orange-100/50 bg-gradient-to-r from-[#FFF5F0] to-[#FFF0F7] backdrop-blur-lg shadow-sm">
                    <div className="container flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 gap-2">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                            <Link to="/admin/dashboard">
                                <Button variant="ghost" size="sm" className="hover:bg-orange-50/50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
                                    <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">Tableau de bord</span>
                                </Button>
                            </Link>
                            <div className="hidden sm:block h-6 w-px bg-gradient-to-b from-orange-200 to-rose-200" />
                            <div className="hidden sm:flex items-center gap-2 min-w-0">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0">
                                    <Gift className="h-3.5 w-3.5 text-white" />
                                </div>
                                <span className="font-semibold text-sm bg-gradient-to-r from-[#FF7B42] to-[#C55FA8] bg-clip-text text-transparent truncate">Administration Tombola</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="border-orange-200 hover:bg-orange-50/50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                            >
                                {loading ? (
                                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                ) : (
                                    <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                                )}
                                <span className="hidden sm:inline ml-1 sm:ml-2">Actualiser</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleLogout} title={`Déconnexion (${user?.email})`} className="hover:bg-rose-50/50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
                                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline ml-1 sm:ml-2">Déconnexion</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container py-4 sm:py-8 px-2 sm:px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 sm:mb-8"
                    >
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] bg-clip-text text-transparent" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                            Gestion de la Tombola
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                            Gérez les participants et les lots
                        </p>
                    </motion.div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Participants Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
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
                                                    <CardContent className="p-4 md:p-6">
                                                        <div className="space-y-3 md:space-y-0 md:flex md:justify-between md:items-start md:gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 md:gap-3 mb-2">
                                                                    <span className="text-2xl md:text-3xl">{parent.emoji}</span>
                                                                    <div className="min-w-0">
                                                                        <h3 className="font-bold text-base md:text-lg truncate">{parent.first_name}</h3>
                                                                        <p className="text-xs md:text-sm text-muted-foreground truncate">{parent.email}</p>
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
                                                                className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="md:inline">Supprimer</span>
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
                                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
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
                                                        <CardContent className="p-4 md:p-6">
                                                            <div className="space-y-3 md:space-y-0 md:flex md:justify-between md:items-start md:gap-4">
                                                                <div className="flex-1">
                                                                    <div className="flex items-start gap-2 md:gap-3 mb-3">
                                                                        <span className="text-xl md:text-2xl flex-shrink-0">🎁</span>
                                                                        <div className="min-w-0">
                                                                            <h3 className="font-bold text-base md:text-lg line-clamp-2">{lot.title}</h3>
                                                                            {lot.description && (
                                                                                <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-2">{lot.description}</p>
                                                                            )}
                                                                            <p className="text-xs md:text-sm font-medium">
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

                                                                <div className="flex flex-col gap-2 w-full md:w-auto">
                                                                    {lot.status === 'available' && (
                                                                        <>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleMarkAsDelivered(lot.id, lot.title)}
                                                                                className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                                                                            >
                                                                                <Check className="h-4 w-4" />
                                                                                <span>Remis</span>
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="destructive"
                                                                                onClick={() => handleDeleteLot(lot.id, lot.title)}
                                                                                className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                                <span>Supprimer</span>
                                                                            </Button>
                                                                        </>
                                                                    )}

                                                                    {lot.status === 'reserved' && (
                                                                        <>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleCancelReservation(lot.id, lot.title)}
                                                                                className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                                <span className="hidden md:inline">Annuler résa</span>
                                                                                <span className="md:hidden">Annuler</span>
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleMarkAsDelivered(lot.id, lot.title)}
                                                                                className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                                                                            >
                                                                                <Check className="h-4 w-4" />
                                                                                <span>Remis</span>
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="destructive"
                                                                                onClick={() => handleDeleteLot(lot.id, lot.title)}
                                                                                className="flex items-center justify-center gap-1 text-xs md:text-sm px-2"
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
                                                                            className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                            <span>Supprimer</span>
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
                                className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4"
                            >
                                <Card>
                                    <CardContent className="p-3 md:p-6 text-center">
                                        <div className="text-2xl md:text-3xl font-bold text-primary">{parents.length}</div>
                                        <p className="text-xs md:text-sm text-muted-foreground mt-1">Participants</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-3 md:p-6 text-center">
                                        <div className="text-2xl md:text-3xl font-bold text-green-600">{lots.filter(l => l.status === 'available').length}</div>
                                        <p className="text-xs md:text-sm text-muted-foreground mt-1">Lots dispo</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-3 md:p-6 text-center">
                                        <div className="text-2xl md:text-3xl font-bold text-yellow-600">{lots.filter(l => l.status === 'reserved').length}</div>
                                        <p className="text-xs md:text-sm text-muted-foreground mt-1">Réservés</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-3 md:p-6 text-center">
                                        <div className="text-2xl md:text-3xl font-bold text-red-600">{lots.filter(l => l.status === 'delivered').length}</div>
                                        <p className="text-xs md:text-sm text-muted-foreground mt-1">Remis</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    )}
                </main>
            </div>

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
        </AdminLayout>
    );
}
