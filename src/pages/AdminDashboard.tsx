import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Gift, LogOut, ArrowRight, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useUnifiedAdminAuth } from '@/hooks/useUnifiedAdminAuth';

export default function AdminDashboard() {
    const { user, isLoading, isAuthenticated, signOut } = useUnifiedAdminAuth();

    // Rediriger vers le login si pas authentifié
    if (!isLoading && !isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const adminSections = [
        {
            id: 'newsletter',
            title: 'Newsletter',
            description: 'Gérez les abonnés et envoyez des newsletters',
            icon: Mail,
            href: '/admin/newsletter',
            gradient: 'from-orange-400 to-pink-500',
            bgGradient: 'from-orange-50/50 to-pink-50/50',
            borderColor: 'border-orange-200/50',
            emoji: '📧',
        },
        {
            id: 'tombola',
            title: 'Tombola',
            description: 'Gérez les participants et les lots',
            icon: Gift,
            href: '/admin/tombola',
            gradient: 'from-purple-400 to-rose-500',
            bgGradient: 'from-purple-50/50 to-rose-50/50',
            borderColor: 'border-purple-200/50',
            emoji: '🎁',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
        },
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-[#FFFBF7] via-[#F8F5FF] to-[#F5F9FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-orange-100/50 bg-gradient-to-r from-[#FFF5F0] to-[#FFF0F7] backdrop-blur-lg shadow-sm">
                    <div className="container flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 gap-2">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                            <Link to="/">
                                <Button variant="ghost" size="sm" className="hover:bg-orange-50/50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
                                    ← <span className="hidden sm:inline ml-2">Retour</span>
                                </Button>
                            </Link>
                            <div className="hidden sm:block h-6 w-px bg-gradient-to-b from-orange-200 to-rose-200" />
                            <div className="hidden sm:flex items-center gap-2 min-w-0">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0">
                                    <LayoutGrid className="h-3.5 w-3.5 text-white" />
                                </div>
                                <span className="font-semibold text-sm bg-gradient-to-r from-[#FF7B42] to-[#C55FA8] bg-clip-text text-transparent truncate">Espace Administrateur</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50/50 border border-orange-200/30">
                                <span className="text-xs sm:text-sm text-gray-700 truncate">{user?.email}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={signOut} className="hover:bg-rose-50/50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
                                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline ml-1 sm:ml-2">Déconnexion</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container py-8 sm:py-12 px-2 sm:px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 sm:mb-12"
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                            Bienvenue dans l'administration
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground" style={{ fontFamily: "'Nunito', sans-serif" }}>
                            Choisissez un espace pour commencer
                        </p>
                    </motion.div>

                    {/* Admin Sections Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-6 sm:gap-8 md:grid-cols-2 max-w-4xl"
                    >
                        {adminSections.map((section) => {
                            const IconComponent = section.icon;
                            return (
                                <motion.div
                                    key={section.id}
                                    variants={itemVariants}
                                    className="group"
                                >
                                    <Link to={section.href} className="block h-full">
                                        <div className={`relative overflow-hidden rounded-xl border-2 ${section.borderColor} bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-105 h-full`}>
                                            {/* Background gradient */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${section.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                            <div className="relative p-6 sm:p-8 flex flex-col h-full">
                                                {/* Icon and Title */}
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${section.gradient} text-white shadow-md group-hover:shadow-lg transition-all`}>
                                                        <IconComponent className="h-7 w-7 sm:h-8 sm:w-8" />
                                                    </div>
                                                    <span className="text-2xl sm:text-3xl">{section.emoji}</span>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 mb-6">
                                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                                        {section.title}
                                                    </h2>
                                                    <p className="text-sm sm:text-base text-gray-600">
                                                        {section.description}
                                                    </p>
                                                </div>

                                                {/* Arrow */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                                                    <span className="text-xs sm:text-sm font-semibold text-gray-600">
                                                        Accéder
                                                    </span>
                                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 sm:mt-16 max-w-2xl"
                    >
                        <div className="bg-gradient-to-r from-orange-50/50 to-pink-50/50 border-2 border-orange-200/50 rounded-xl p-6 sm:p-8">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                💡 Information utile
                            </h3>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                Vous pouvez accéder à l'une ou l'autre des sections d'administration avec votre compte unique. N'oubliez pas de vous déconnecter après votre session pour des raisons de sécurité.
                            </p>
                        </div>
                    </motion.div>
                </main>
            </div>
        </AdminLayout>
    );
}
