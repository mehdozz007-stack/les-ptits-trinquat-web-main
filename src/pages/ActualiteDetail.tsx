import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Download, Facebook, Instagram, Heart } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getActualiteById, actualiteTypeLabels, actualiteColorClasses } from "@/lib/actualites";
import { useToast } from "@/hooks/use-toast";
const titleGradients: Record<string, string> = {
    primary: "bg-gradient-to-r from-primary via-secondary to-pink-600 bg-clip-text text-transparent font-extrabold",
    secondary: "bg-gradient-to-r from-secondary via-primary to-orange-600 bg-clip-text text-transparent font-extrabold",
    sky: "bg-gradient-to-r from-sky-600 via-blue-600 to-violet-600 bg-clip-text text-transparent font-extrabold",
    violet: "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold",
    accent: "bg-gradient-to-r from-accent via-green-600 to-yellow-600 bg-clip-text text-transparent font-extrabold",
    green: "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent font-extrabold",
    orange: "bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent font-extrabold",
    pink: "bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent font-extrabold",
    rose: "bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent font-extrabold",
    emerald: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent font-extrabold",
    amber: "bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent font-extrabold",
    cyan: "bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent font-extrabold",
    indigo: "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-extrabold",
    fuchsia: "bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 bg-clip-text text-transparent font-extrabold",
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
    primary: "shadow-lg shadow-primary/25 hover:shadow-primary/40",
    secondary: "shadow-lg shadow-secondary/25 hover:shadow-secondary/40",
    sky: "shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40",
    violet: "shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
    accent: "shadow-lg shadow-accent/25 hover:shadow-accent/40",
    green: "shadow-lg shadow-green-500/25 hover:shadow-green-500/40",
    orange: "shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40",
    pink: "shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40",
    rose: "shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40",
    emerald: "shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40",
    amber: "shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40",
    cyan: "shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40",
    indigo: "shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40",
    fuchsia: "shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40",
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
                <section className="relative overflow-hidden py-8 sm:py-12 md:py-20 bg-gradient-to-br from-slate-50/10 via-purple-50/5 to-pink-50/10">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Blobs colorés animés avec gradients */}
                        <div className={`absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br ${headerBlobColors[actualite.color]?.primary || "from-primary to-secondary"} watercolor-blob animate-pulse-soft opacity-25`} />
                        <div className={`absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr ${headerBlobColors[actualite.color]?.secondary || "from-secondary to-primary"} watercolor-blob animate-pulse-soft opacity-20`} style={{ animationDelay: "1s" }} />
                        <div className="absolute top-1/3 right-1/4 h-60 w-60 rounded-full bg-gradient-to-br from-accent via-yellow-400 to-pink-300 watercolor-blob blur-3xl opacity-15" style={{ animationDelay: "0.5s" }} />
                        <div className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-gradient-to-tr from-purple-300 via-pink-200 to-rose-300 watercolor-blob blur-3xl opacity-12" style={{ animationDelay: "1.5s" }} />
                        <div className="absolute top-1/2 -right-20 h-80 w-80 rounded-full bg-gradient-to-bl from-blue-200 via-purple-200 to-pink-100 watercolor-blob blur-2xl opacity-15" />
                        <div className="absolute top-1/4 left-1/2 h-64 w-64 rounded-full bg-gradient-to-br from-sky-300 via-cyan-200 to-blue-200 watercolor-blob blur-3xl opacity-10" />
                    </div>
                    <div className="container relative z-10">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="mb-2 sm:mb-6 gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </Button>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            {/* Badge en haut centré avec effect */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex justify-center mb-8"
                            >
                                <div className="relative inline-block">
                                    <div className={`absolute inset-0 rounded-full blur-lg bg-gradient-to-r from-purple-300 to-pink-300 opacity-40`} />
                                    <Badge
                                        className={`shrink-0 relative ${badgeColors[actualite.type]}`}
                                        variant="secondary"
                                    >
                                        {actualiteTypeLabels[actualite.type]}
                                    </Badge>
                                </div>
                            </motion.div>

                            {/* Titre centré avec animation */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className={`text-3xl font-extrabold md:text-5xl mb-8 leading-tight ${titleGradients[actualite.color]}`}
                            >
                                {actualite.title}
                            </motion.h1>

                            {/* Meta information centré avec animation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-3 text-sm text-muted-foreground mb-8 flex flex-col items-center"
                            >
                                <div className="flex items-center gap-2 backdrop-blur-sm bg-gradient-to-r from-purple-50/40 to-pink-50/40 px-4 py-2 rounded-lg border border-purple-200/20">
                                    <Calendar className="h-4 w-4 text-purple-500" />
                                    <span>{actualite.date}</span>
                                </div>
                                {actualite.time && (
                                    <div className="flex items-center gap-2 backdrop-blur-sm bg-gradient-to-r from-blue-50/40 to-purple-50/40 px-4 py-2 rounded-lg border border-blue-200/20">
                                        <Clock className="h-4 w-4 text-blue-500" />
                                        <span>{actualite.time}</span>
                                    </div>
                                )}
                                {actualite.location && (
                                    <div className="flex items-center gap-2 backdrop-blur-sm bg-gradient-to-r from-emerald-50/40 to-cyan-50/40 px-4 py-2 rounded-lg border border-emerald-200/20">
                                        <MapPin className="h-4 w-4 text-emerald-500" />
                                        <span>{actualite.location}</span>
                                    </div>
                                )}
                                {actualite.attendees && (
                                    <div className="flex items-center gap-2 backdrop-blur-sm bg-gradient-to-r from-rose-50/40 to-red-50/40 px-4 py-2 rounded-lg border border-rose-200/20">
                                        <Users className="h-4 w-4 text-rose-500" />
                                        <span>{actualite.attendees} participants attendus</span>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Bottom wave decoration */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                            <path
                                d="M0 120L48 105C96 90 192 70 288 65C384 60 480 75 576 85C672 95 768 100 864 85C960 70 1056 60 1152 60C1248 60 1344 70 1392 85L1440 95V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
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
                                <Card
                                    className={`h-full overflow-hidden border-2 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 ${actualiteColorClasses[actualite.color]} ${shadowColors[actualite.color]} transition-shadow duration-300`}
                                >
                                    <CardContent className="p-6 sm:p-10">
                                        {/* Affiche de l'événement */}
                                        {actualite.affiche && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                className="mb-8 flex justify-center"
                                            >
                                                <img
                                                    src={actualite.affiche}
                                                    alt={`Affiche - ${actualite.title}`}
                                                    className="w-full sm:w-[70%] rounded-xl object-cover shadow-md"
                                                />
                                            </motion.div>
                                        )}

                                        <div className="prose prose-invert max-w-none">
                                            <div className="text-base text-foreground leading-relaxed whitespace-pre-wrap text-center">
                                                {actualite.content || actualite.description}
                                            </div>
                                        </div>

                                        {/* Download section */}
                                        {actualite.fileUrl && (
                                            <div className="mt-8 pt-8 border-t border-current border-opacity-20 flex justify-center">
                                                <Button
                                                    variant="default"
                                                    size="lg"
                                                    onClick={() => handleDownload(actualite.fileUrl!, actualite.title)}
                                                    className="gap-2"
                                                >
                                                    <Download className="h-5 w-5" />
                                                    Télécharger le document
                                                </Button>
                                            </div>
                                        )}

                                        {/* External link section */}
                                        {actualite.link && actualite.type !== "evenement" && (
                                            <div className="mt-8 pt-8 border-t border-current border-opacity-20 flex justify-center">
                                                <Button
                                                    asChild
                                                    variant="default"
                                                    size="lg"
                                                >
                                                    <a href={actualite.link} target="_blank" rel="noopener noreferrer">
                                                        Consulter
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
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
