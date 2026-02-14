import { motion } from "framer-motion";
import { ArrowRight, FileText, Link as LinkIcon, Calendar, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLatestActualites, actualiteTypeLabels, actualiteColorClasses } from "@/lib/actualites";

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

const buttonGradients: Record<string, string> = {
    primary: "bg-gradient-to-r from-primary via-secondary to-pink-600 hover:from-primary/90 hover:via-secondary/90 hover:to-pink-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-secondary via-primary to-orange-600 hover:from-secondary/90 hover:via-primary/90 hover:to-orange-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    sky: "bg-gradient-to-r from-sky-600 via-blue-600 to-violet-600 hover:from-sky-600/90 hover:via-blue-600/90 hover:to-violet-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    violet: "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-600/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    accent: "bg-gradient-to-r from-accent via-green-600 to-yellow-600 hover:from-accent/90 hover:via-green-600/90 hover:to-yellow-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    green: "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-600/90 hover:via-emerald-600/90 hover:to-teal-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    orange: "bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-600/90 hover:via-amber-600/90 hover:to-yellow-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    pink: "bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-600/90 hover:via-rose-600/90 hover:to-red-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    rose: "bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 hover:from-rose-600/90 hover:via-pink-600/90 hover:to-red-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    emerald: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-600/90 hover:via-teal-600/90 hover:to-cyan-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    amber: "bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-600/90 hover:via-orange-600/90 hover:to-yellow-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    cyan: "bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 hover:from-cyan-600/90 hover:via-blue-600/90 hover:to-teal-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    indigo: "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-600/90 hover:via-purple-600/90 hover:to-blue-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
    fuchsia: "bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 hover:from-fuchsia-600/90 hover:via-pink-600/90 hover:to-purple-600/90 text-white font-semibold shadow-lg hover:shadow-xl",
};

export function ActualitesPreview() {
    const renderActionButton = (actualite: ReturnType<typeof getLatestActualites>[0]) => {
        // Tous les boutons mènent vers la page de détail
        return (
            <Button asChild size="sm" className={`gap-2 border-0 ${buttonGradients[actualite.color]}`}>
                <Link to={`/actualites/${actualite.id}`}>
                    <ChevronRight className="h-4 w-4" />
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
                    <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
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

                                        {/* Footer avec date, location et bouton */}
                                        <div className="pt-4 mt-2">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                                        <span>{actualite.date}</span>
                                                    </div>
                                                    {/* Location */}
                                                    {actualite.location && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                                            <span>{actualite.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Bouton */}
                                                {renderActionButton(actualite)}
                                            </div>
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
                            <ChevronRight className="mr-2 h-5 w-5" />
                            Consulter toutes les actualités
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
