import { motion } from "framer-motion";
import { ArrowRight, FileText, Download, Link as LinkIcon, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLatestActualites, actualiteTypeLabels, actualiteColorClasses } from "@/lib/actualites";
import { useToast } from "@/hooks/use-toast";

const actualites = getLatestActualites(3);

const badgeColors: Record<string, string> = {
    evenement: "bg-gradient-to-r from-sky/70 to-blue-400/70 text-white font-semibold shadow-sm",
    document: "bg-gradient-to-r from-violet/70 to-purple-400/70 text-white font-semibold shadow-sm",
    annonce: "bg-gradient-to-r from-primary/70 to-pink-400/50 text-white font-semibold shadow-sm",
    information: "bg-gradient-to-r from-emerald/70 to-teal-400/70 text-white font-semibold shadow-sm",
};

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

export function ActualitesPreview() {
    const { toast } = useToast();

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

    const renderActionButton = (actualite: ReturnType<typeof getLatestActualites>[0]) => {
        if (actualite.fileUrl) {
            return (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(actualite.fileUrl!, actualite.title)}
                    className="gap-2"
                >
                    <Download className="h-4 w-4" />
                    Télécharger
                </Button>
            );
        }

        // Lien vers la page actualités avec ancrage vers l'actualité spécifique
        return (
            <Button asChild variant="outline" size="sm" className="gap-2">
                <Link to={`/actualites#${actualite.id}`}>
                    <ArrowRight className="h-4 w-4" />
                    Lire plus
                </Link>
            </Button>
        );
    };

    return (
        <section className="relative overflow-hidden bg-muted/50 sm:py-12 py-20 md:py-28">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 max-w-3xl"
                >
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                        <FileText className="h-4 w-4" />
                        Actualités
                    </span>
                    <h2 className="mb-4 text-2xl font-extrabold md:text-4xl">
                        Actualités de l'école <br />
                        <span className="text-gradient">et de l'association</span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Restez informés des derniers événements, annonces et documents partagés par les parents élus et l'équipe de l'école.
                    </p>
                </motion.div>

                {actualites.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {actualites.map((actualite, index) => (
                            <motion.div
                                key={actualite.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group h-full"
                            >
                                <Card
                                    className={`h-full overflow-hidden border-2 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 ${actualiteColorClasses[actualite.color]}`}
                                >
                                    <CardContent className="flex flex-col gap-4 p-6">
                                        {/* Header avec badge */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <h3 className={`font-bold ${titleGradients[actualite.color]}`}>
                                                    {actualite.title}
                                                </h3>
                                            </div>
                                            <Badge
                                                className={`shrink-0 ${badgeColors[actualite.type]}`}
                                                variant="secondary"
                                            >
                                                {actualiteTypeLabels[actualite.type]}
                                            </Badge>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground flex-1">
                                            {actualite.description}
                                        </p>

                                        {/* Location pour les événements */}
                                        {actualite.type === "evenement" && actualite.location && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                                <span>{actualite.location}</span>
                                            </div>
                                        )}

                                        {/* Footer avec date et bouton */}
                                        <div className="flex items-center justify-between gap-3 border-t border-current border-opacity-20 pt-4 mt-2">
                                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {actualite.date}
                                            </span>
                                            {renderActionButton(actualite)}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="bg-muted/50">
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                Aucune actualité pour le moment. Revenez bientôt !
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Lien vers page complète */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <Button asChild variant="playful" size="lg">
                        <Link to="/actualites">
                            <ArrowRight className="mr-2 h-5 w-5" />
                            Consulter toutes les actualités
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
