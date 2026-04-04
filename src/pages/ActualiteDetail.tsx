import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Download, Facebook, Instagram, Heart, Eye, Tickets, Gift } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getActualiteById, actualiteTypeLabels, actualiteColorClasses, formatDateFr } from "@/lib/actualites";
import { useToast } from "@/hooks/use-toast";
const titleGradients: Record<string, string> = {
    primary: "bg-gradient-to-r from-primary/90 via-secondary/90 to-pink-500 bg-clip-text text-transparent font-extrabold",
    secondary: "bg-gradient-to-r from-secondary/90 via-primary/90 to-orange-500 bg-clip-text text-transparent font-extrabold",
    sky: "bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 bg-clip-text text-transparent font-extrabold",
    violet: "bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold",
    accent: "bg-gradient-to-r from-accent/90 via-green-500 to-yellow-500 bg-clip-text text-transparent font-extrabold",
    green: "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent font-extrabold",
    orange: "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent font-extrabold",
    pink: "bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent font-extrabold",
    rose: "bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 bg-clip-text text-transparent font-extrabold",
    emerald: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent font-extrabold",
    amber: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-extrabold",
    cyan: "bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 bg-clip-text text-transparent font-extrabold",
    indigo: "bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-extrabold",
    fuchsia: "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 bg-clip-text text-transparent font-extrabold",
};

const badgeColors: Record<string, string> = {
    evenement: "bg-gradient-to-r from-sky/70 to-blue-400/70 text-white font-semibold shadow-sm",
    document: "bg-gradient-to-r from-violet/70 to-purple-400/70 text-white font-semibold shadow-sm",
    annonce: "bg-gradient-to-r from-primary/70 to-pink-400/70 text-white font-semibold shadow-sm",
    information: "bg-gradient-to-r from-emerald/70 to-teal-400/70 text-white font-semibold shadow-sm",
};

const headerBlobColors: Record<string, { primary: string; secondary: string }> = {
    primary: { primary: "bg-primary/50", secondary: "bg-secondary/40" },
    secondary: { primary: "bg-secondary/50", secondary: "bg-primary/40" },
    sky: { primary: "bg-sky-500/50", secondary: "bg-blue-500/40" },
    violet: { primary: "bg-violet-500/50", secondary: "bg-purple-500/40" },
    accent: { primary: "bg-accent/50", secondary: "bg-green-500/40" },
    rose: { primary: "bg-rose-500/50", secondary: "bg-pink-500/40" },
    emerald: { primary: "bg-emerald-500/50", secondary: "bg-teal-500/40" },
    amber: { primary: "bg-amber-500/50", secondary: "bg-orange-500/40" },
    cyan: { primary: "bg-cyan-500/50", secondary: "bg-blue-500/40" },
    indigo: { primary: "bg-indigo-500/50", secondary: "bg-purple-500/40" },
    fuchsia: { primary: "bg-fuchsia-500/50", secondary: "bg-pink-500/40" },
};

const shadowColors: Record<string, string> = {
    primary: "shadow-2xl shadow-primary/40 hover:shadow-2xl hover:shadow-primary/60 transition-all duration-500",
    secondary: "shadow-2xl shadow-secondary/40 hover:shadow-2xl hover:shadow-secondary/60 transition-all duration-500",
    sky: "shadow-2xl shadow-sky-500/40 hover:shadow-2xl hover:shadow-sky-500/60 transition-all duration-500",
    violet: "shadow-2xl shadow-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/60 transition-all duration-500",
    accent: "shadow-2xl shadow-accent/40 hover:shadow-2xl hover:shadow-accent/60 transition-all duration-500",
    green: "shadow-2xl shadow-green-500/40 hover:shadow-2xl hover:shadow-green-500/60 transition-all duration-500",
    orange: "shadow-2xl shadow-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/60 transition-all duration-500",
    pink: "shadow-2xl shadow-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/60 transition-all duration-500",
    rose: "shadow-2xl shadow-rose-500/40 hover:shadow-2xl hover:shadow-rose-500/60 transition-all duration-500",
    emerald: "shadow-2xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 transition-all duration-500",
    amber: "shadow-2xl shadow-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/60 transition-all duration-500",
    cyan: "shadow-2xl shadow-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/60 transition-all duration-500",
    indigo: "shadow-2xl shadow-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/60 transition-all duration-500",
    fuchsia: "shadow-2xl shadow-fuchsia-500/40 hover:shadow-2xl hover:shadow-fuchsia-500/60 transition-all duration-500",
};

const buttonGradients: Record<string, string> = {
    primary: "bg-gradient-to-r from-primary via-secondary to-pink-600 hover:from-primary/90 hover:via-secondary/90 hover:to-pink-700 shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/60",
    secondary: "bg-gradient-to-r from-secondary via-primary to-orange-600 hover:from-secondary/90 hover:via-primary/90 hover:to-orange-700 shadow-lg shadow-secondary/40 hover:shadow-xl hover:shadow-secondary/60",
    sky: "bg-gradient-to-r from-sky-600 via-blue-600 to-violet-600 hover:from-sky-700 hover:via-blue-700 hover:to-violet-700 shadow-lg shadow-sky-500/40 hover:shadow-xl hover:shadow-sky-500/60",
    violet: "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 shadow-lg shadow-violet-500/40 hover:shadow-xl hover:shadow-violet-500/60",
    accent: "bg-gradient-to-r from-accent via-green-600 to-yellow-600 hover:from-accent/90 hover:via-green-700 hover:to-yellow-700 shadow-lg shadow-accent/40 hover:shadow-xl hover:shadow-accent/60",
    rose: "bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 hover:from-rose-700 hover:via-pink-700 hover:to-red-700 shadow-lg shadow-rose-500/40 hover:shadow-xl hover:shadow-rose-500/60",
    emerald: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/60",
    amber: "bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-700 hover:via-orange-700 hover:to-yellow-700 shadow-lg shadow-amber-500/40 hover:shadow-xl hover:shadow-amber-500/60",
    cyan: "bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 hover:from-cyan-700 hover:via-blue-700 hover:to-teal-700 shadow-lg shadow-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/60",
    indigo: "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/60",
    fuchsia: "bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 hover:from-fuchsia-700 hover:via-pink-700 hover:to-purple-700 shadow-lg shadow-fuchsia-500/40 hover:shadow-xl hover:shadow-fuchsia-500/60",
};

export function ActualiteDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const actualite = id ? getActualiteById(id) : null;

    if (!actualite) {
        return (
            <Layout>
                <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                    <Card className="bg-muted/50">
                        <CardContent className="py-16 text-center">
                            <h3 className="mb-2 text-lg font-semibold">Actualité non trouvée</h3>
                            <p className="mb-6 text-muted-foreground">
                                L'actualité que vous recherchez n'existe pas.
                            </p>
                            <Button onClick={() => navigate("/actualites")}>
                                Retour aux actualités
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        );
    }

    const handleDownload = (fileUrl: string, title: string) => {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `${title.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Téléchargement lancé",
            description: `${title} a été téléchargé avec succès.`,
        });
    };

    return (
        <Layout>
            <div className="min-h-[calc(100vh-200px)]">
                {/* Header */}
                <section className="relative overflow-hidden bg-gradient-to-b from-primary/16 via-secondary/12 to-background py-14 sm:py-16 md:py-20">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className={`absolute -top-24 -right-20 h-72 w-72 rounded-full ${headerBlobColors[actualite.color]?.primary || "bg-primary/35"} watercolor-blob blur-2xl opacity-36`} />
                        <div className={`absolute bottom-0 -left-16 h-56 w-56 rounded-full ${headerBlobColors[actualite.color]?.secondary || "bg-secondary/30"} watercolor-blob blur-2xl opacity-32`} />
                        <div className="absolute top-1/3 right-1/4 h-44 w-44 rounded-full bg-gradient-to-br from-white/75 to-primary/30 blur-2xl opacity-85" />
                    </div>
                    <div className="container relative z-10">
                        <motion.div
                            whileHover={{ x: -2 }}
                            transition={{ duration: 0.2 }}
                            className="mb-6 inline-block"
                        >
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/actualites")}
                                className="gap-2 rounded-full bg-background/70 backdrop-blur-sm"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Retour aux actualités
                            </Button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-5 flex justify-center md:justify-start"
                            >
                                <Badge className={`shrink-0 ${badgeColors[actualite.type]}`} variant="secondary">
                                    {actualiteTypeLabels[actualite.type]}
                                </Badge>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mb-6"
                            >
                                <h1
                                    className={`text-3xl leading-tight sm:text-4xl md:text-5xl ${titleGradients[actualite.color] || titleGradients.primary}`}
                                >
                                    {actualite.title}
                                </h1>
                                <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                                    Retrouvez les informations essentielles de cette actualite dans un format clair et lisible.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
                            >
                                {actualite.date && (
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 backdrop-blur-sm"
                                    >
                                        <Calendar className="h-4 w-4 text-purple-500" />
                                        <span>{formatDateFr(actualite.date)}</span>
                                    </motion.div>
                                )}
                                {actualite.time && (
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 backdrop-blur-sm"
                                    >
                                        <Clock className="h-4 w-4 text-blue-500" />
                                        <span>{actualite.time}</span>
                                    </motion.div>
                                )}
                                {actualite.location && (
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 backdrop-blur-sm"
                                    >
                                        <MapPin className="h-4 w-4 text-emerald-500" />
                                        <span>{actualite.location}</span>
                                    </motion.div>
                                )}
                                {actualite.attendees && (
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 backdrop-blur-sm"
                                    >
                                        <Users className="h-4 w-4 text-rose-500" />
                                        <span>{actualite.attendees} participants attendus</span>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Bottom wave decoration */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                            <path
                                d="M0 120L48 110C96 100 192 80 288 75C384 70 480 80 576 85C672 90 768 90 864 85C960 80 1056 70 1152 70C1248 70 1344 80 1392 85L1440 90V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
                                fill="hsl(var(--background))"
                            />
                        </svg>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12 sm:py-16 md:py-20">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                viewport={{ once: true }}
                            >
                                {/* Affiche de l'événement */}
                                {actualite.affiche && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                        whileHover={{ scale: 1.03, y: -8 }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeOut",
                                            scale: { type: "spring", stiffness: 300, damping: 30 }
                                        }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        className="mb-8 flex justify-center group"
                                    >
                                        <div className="relative w-full sm:w-[70%]">
                                            <img
                                                src={actualite.affiche}
                                                alt={`Affiche - ${actualite.title}`}
                                                className="w-full rounded-xl object-cover shadow-3xl shadow-black/40 group-hover:shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-1000"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{
                                        y: -12,
                                        transition: { duration: 0.3 }
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                        scale: { duration: 0.4 }
                                    }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="relative group"
                                >
                                    {/* Animated glow background */}
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl blur-3xl opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"
                                        whileHover={{ opacity: 1 }}
                                        style={{
                                            background: `linear-gradient(135deg, ${actualite.color === 'rose' ? 'rgba(225, 29, 72, 0.3), rgba(236, 72, 153, 0.25)' :
                                                actualite.color === 'sky' ? 'rgba(14, 165, 233, 0.3), rgba(99, 102, 241, 0.25)' :
                                                    actualite.color === 'violet' ? 'rgba(124, 58, 255, 0.3), rgba(236, 72, 153, 0.25)' :
                                                        actualite.color === 'emerald' ? 'rgba(16, 185, 129, 0.3), rgba(34, 197, 94, 0.25)' :
                                                            actualite.color === 'amber' ? 'rgba(217, 119, 6, 0.3), rgba(251, 146, 60, 0.25)' :
                                                                actualite.color === 'indigo' ? 'rgba(79, 70, 229, 0.3), rgba(139, 92, 246, 0.25)' :
                                                                    actualite.color === 'fuchsia' ? 'rgba(217, 70, 239, 0.3), rgba(236, 72, 153, 0.25)' :
                                                                        'rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.25)'
                                                })`
                                        }}
                                    />
                                    <Card
                                        className={`h-full overflow-hidden border-2 rounded-2xl transition-all duration-500 ${actualiteColorClasses[actualite.color]} ${shadowColors[actualite.color]}`}
                                    >
                                        <CardContent className="p-6 sm:p-10">
                                            <div className="prose prose-invert max-w-none">
                                                <div className="text-base text-foreground leading-relaxed whitespace-pre-wrap text-center">
                                                    {actualite.content || actualite.description}
                                                </div>
                                            </div>

                                            {/* Download section */}
                                            {actualite.fileUrl && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.2, duration: 0.4 }}
                                                    className="mt-8 pt-8 flex justify-center"
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.08, y: -3 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Button
                                                            variant="default"
                                                            size="lg"
                                                            onClick={() => handleDownload(actualite.fileUrl!, actualite.title)}
                                                            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                                                        >
                                                            <Download className="h-5 w-5" />
                                                            Télécharger le document
                                                        </Button>
                                                    </motion.div>
                                                </motion.div>
                                            )}

                                            {/* External link section */}
                                            {actualite.link && actualite.type !== "evenement" && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.3, duration: 0.4 }}
                                                    className="mt-8 pt-8 flex justify-center"
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.08, y: -3 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Button
                                                            asChild
                                                            variant="default"
                                                            size="lg"
                                                            className="bg-gradient-to-r shadow-lg hover:shadow-xl transition-all duration-300"
                                                        >
                                                            <a href={actualite.link} target="_blank" rel="noopener noreferrer">
                                                                Consulter
                                                            </a>
                                                        </Button>
                                                    </motion.div>
                                                </motion.div>
                                            )}

                                            {/* Reservation link section */}
                                            {actualite.reservationLink && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.3, duration: 0.4 }}
                                                    className="mt-8 pt-8 flex justify-center"
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.08, y: -3 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Button
                                                            asChild
                                                            variant="default"
                                                            size="lg"
                                                            className="gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/60 transition-all duration-300"
                                                        >
                                                            <a href={actualite.reservationLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                                <Tickets className="h-5 w-5" />
                                                                Réserver
                                                            </a>
                                                        </Button>
                                                    </motion.div>
                                                </motion.div>
                                            )}

                                            {/* Tombola exchange button section */}
                                            {actualite.authLink && actualite.id === "act-001" && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.4, duration: 0.4 }}
                                                    className="mt-8 pt-8 flex justify-center"
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.08, y: -3 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Button
                                                            asChild
                                                            variant="default"
                                                            size="lg"
                                                            className={`gap-2 text-white font-semibold transition-all duration-300 ${buttonGradients[actualite.color]}`}
                                                        >
                                                            <Link to={actualite.authLink} className="flex items-center gap-2">
                                                                <Gift className="h-5 w-5" />
                                                                Echangez vos lots
                                                            </Link>
                                                        </Button>
                                                    </motion.div>
                                                </motion.div>
                                            )}

                                            {/* Donation link section */}
                                            {actualite.donationLink && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.4, duration: 0.4 }}
                                                    className="mt-8 pt-8 flex justify-center"
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.08, y: -3 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Button
                                                            asChild
                                                            variant="default"
                                                            size="lg"
                                                            className={`gap-2 text-white font-semibold transition-all duration-300 ${buttonGradients[actualite.color]}`}
                                                        >
                                                            <a href={actualite.donationLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                                <Heart className="h-5 w-5" />
                                                                Faire un don
                                                            </a>
                                                        </Button>
                                                    </motion.div>
                                                </motion.div>
                                            )}

                                            {/* Gallery image section */}
                                            {actualite.galleryImage && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    whileHover={{ y: -8 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        ease: "easeOut",
                                                        scale: { type: "spring", stiffness: 300, damping: 30 }
                                                    }}
                                                    viewport={{ once: true, margin: "-100px" }}
                                                    className="mt-10 pt-10 flex justify-center group"
                                                >
                                                    <div className="relative w-full md:w-3/5">
                                                        <img
                                                            src={actualite.galleryImage}
                                                            alt={`Galerie - ${actualite.title}`}
                                                            className="w-full rounded-xl object-cover shadow-2xl shadow-black/40 group-hover:shadow-2xl group-hover:shadow-rose-500/50 transition-all duration-1000"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative overflow-hidden bg-muted/50 sm:py-12 py-20 md:py-28">
                    <div className="container text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Heart className="mx-auto mb-4 h-12 w-12 text-secondary" />
                            <h2 className="mb-4 text-2xl font-bold">Rester connecté</h2>
                            <p className="mb-8 max-w-2xl text-muted-foreground mx-auto">
                                Suivez-nous sur les réseaux sociaux pour ne rien manquer de l'actualité de l'école.
                            </p>
                            <div className="flex justify-center gap-6 mb-8">
                                <a href="https://www.facebook.com/LesPtitsTrinquats" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-125">
                                    <Facebook className="h-8 w-8 text-primary hover:text-primary/80" />
                                </a>
                                <a href="https://www.instagram.com/Les_ptits_trinquat" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-125">
                                    <Instagram className="h-8 w-8 text-primary hover:text-primary/80" />
                                </a>
                            </div>
                            <Button variant="playful" size="lg" asChild>
                                <Link to="/actualites">
                                    Retour aux actualités
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

export default ActualiteDetail;
