import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Download, Facebook, Instagram } from "lucide-react";
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
                <section className="relative overflow-hidden py-12 sm:py-16 md:py-20">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className={`absolute -top-20 -right-20 h-60 w-60 rounded-full ${headerBlobColors[actualite.color]?.primary || "bg-primary/50"} watercolor-blob`} />
                        <div className={`absolute -bottom-10 -left-10 h-40 w-40 rounded-full ${headerBlobColors[actualite.color]?.secondary || "bg-secondary/40"} watercolor-blob`} />
                    </div>
                    <div className="container relative">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="mb-6 gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </Button>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            {/* Badge en haut centré */}
                            <div className="flex justify-center mb-8">
                                <Badge
                                    className={`shrink-0 ${badgeColors[actualite.type]}`}
                                    variant="secondary"
                                >
                                    {actualiteTypeLabels[actualite.type]}
                                </Badge>
                            </div>

                            {/* Titre centré */}
                            <h1 className={`text-4xl font-extrabold md:text-5xl mb-8 leading-tight ${titleGradients[actualite.color]}`}>
                                {actualite.title}
                            </h1>

                            {/* Meta information centré */}
                            <div className="space-y-3 text-sm text-muted-foreground mb-8 flex flex-col items-center">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{actualite.date}</span>
                                </div>
                                {actualite.time && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{actualite.time}</span>
                                    </div>
                                )}
                                {actualite.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{actualite.location}</span>
                                    </div>
                                )}
                                {actualite.attendees && (
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{actualite.attendees} participants attendus</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
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
                            <Card
                                className={`overflow-hidden border-2 rounded-2xl ${actualiteColorClasses[actualite.color]}`}
                            >
                                <CardContent className="p-8 sm:p-12">
                                    <div className="prose prose-invert max-w-none">
                                        <div className="text-lg text-foreground leading-relaxed whitespace-pre-wrap text-center">
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
                    </div>
                </section>

                {/* CTA Section */}
                <section className="border-t border-border py-12 sm:py-16">
                    <div className="container text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
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
