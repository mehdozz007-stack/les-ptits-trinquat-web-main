import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Download, Link as LinkIcon, Search, Calendar, Clock, MapPin, Users, ChevronRight, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAllActualites, actualiteTypeLabels, actualiteColorClasses, ActualiteType, getPastEvents } from "@/lib/actualites";
import { useToast } from "@/hooks/use-toast";

const badgeColors: Record<string, string> = {
    evenement: "bg-gradient-to-r from-sky/70 to-blue-400/70 text-white font-semibold shadow-sm",
    document: "bg-gradient-to-r from-violet/70 to-purple-400/70 text-white font-semibold shadow-sm",
    annonce: "bg-gradient-to-r from-primary/70 to-pink-400/70 text-white font-semibold shadow-sm",
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

const allActualites = getAllActualites();

const filterOptions: { id: string; label: string; type?: ActualiteType }[] = [
    { id: "tous", label: "Tous" },
    { id: "evenement", label: "Événements", type: "evenement" },
    { id: "annonce", label: "Annonces", type: "annonce" },
    { id: "information", label: "Information", type: "information" },
];

export function Actualites() {
    const { toast } = useToast();
    const [activeFilter, setActiveFilter] = useState("tous");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredActualites = allActualites.filter((actualite) => {
        const matchesFilter = activeFilter === "tous" || actualite.type === activeFilter;
        const matchesSearch =
            actualite.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            actualite.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

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

    const renderActionButton = (actualite: (typeof allActualites)[0]) => {
        // Ne pas afficher de bouton pour les événements
        if (actualite.type === "evenement") {
            return null;
        }

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

        if (actualite.link) {
            return (
                <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link to={actualite.link}>
                        <LinkIcon className="h-4 w-4" />
                        Lire plus
                    </Link>
                </Button>
            );
        }

        return (
            <Button variant="outline" size="sm" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                Consulter
            </Button>
        );
    };

    return (
        <Layout>
            <div className="min-h-[calc(100vh-200px)]">
                {/* Header section */}
                <section className="relative overflow-hidden py-20 sm:py-28 md:py-32">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-secondary/25 watercolor-blob" />
                        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/25 watercolor-blob" />
                        <div className="absolute top-1/2 right-1/4 h-52 w-52 rounded-full bg-accent/15 watercolor-blob" />
                    </div>
                    <div className="container relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl"
                        >
                            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                                <FileText className="h-4 w-4" />
                                Actualités
                            </span>
                            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
                                Actualités <br />
                                <span className="text-gradient">de l'école et de l'association</span>
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Découvrez les derniers événements, documents et annonces de notre communauté scolaire.
                                Des informations partagées par les parents élus et l'équipe de l'école pour vous tenir
                                régulièrement informés.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Search and filters section */}
                <section className="border-b border-border py-6 sm:py-8">
                    <div className="container space-y-6">
                        {/* Search bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une actualité..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </motion.div>

                        {/* Filter buttons */}
                        <div className="flex flex-wrap gap-2">
                            {filterOptions.map((option, index) => (
                                <motion.div
                                    key={option.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Button
                                        variant={activeFilter === option.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setActiveFilter(option.id)}
                                        className="transition-all duration-300"
                                    >
                                        {option.label}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>

                        {/* Result count */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-sm text-muted-foreground"
                        >
                            {filteredActualites.length} résultat{filteredActualites.length > 1 ? "s" : ""}
                        </motion.div>
                    </div>
                </section>

                {/* Actualites grid */}
                <section className="py-12 sm:py-16 md:py-20">
                    <div className="container">
                        {filteredActualites.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredActualites.map((actualite, index) => (
                                    <motion.div
                                        key={actualite.id}
                                        id={actualite.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: (index % 6) * 0.05 }}
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
                                                <div className="border-t border-current border-opacity-20 pt-4 mt-2">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                                                <span>{actualite.date}</span>
                                                            </div>
                                                            {/* Location pour les événements */}
                                                            {actualite.type === "evenement" && actualite.location && (
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                                                    <span>{actualite.location}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Boutons à droite */}
                                                        <div className="flex flex-col items-end gap-2">
                                                            <Button asChild variant="outline" size="sm" className="gap-2">
                                                                <Link to={`/actualites/${actualite.id}`}>
                                                                    <ArrowRight className="h-4 w-4" />
                                                                    Lire la suite
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card className="bg-muted/50">
                                    <CardContent className="py-16 text-center">
                                        <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                                        <h3 className="mb-2 text-lg font-semibold">Aucune actualité trouvée</h3>
                                        <p className="text-muted-foreground">
                                            {searchQuery
                                                ? `Aucun résultat pour "${searchQuery}". Essayez une autre recherche.`
                                                : "Aucune actualité pour ce filtre. Revenez bientôt !"}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Événements passés Section */}
                {getPastEvents().length > 0 && (
                    <section className="bg-muted/50 py-12 sm:py-16 md:py-20">
                        <div className="container">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-12"
                            >
                                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                                    <Calendar className="h-4 w-4" />
                                    Événements passés
                                </span>
                                <h2 className="mb-4 text-3xl font-extrabold">
                                    Nos <span className="text-gradient">événements précédents</span>
                                </h2>
                                <p className="text-base text-muted-foreground max-w-2xl">
                                    Revivez les moments forts et les belles rencontres que nous avons eu le plaisir de partager avec vous.
                                </p>
                            </motion.div>

                            <div className="grid gap-4 sm:gap-6">
                                {getPastEvents().map((event, index) => {
                                    const colorMap = {
                                        primary: { bg: "bg-primary", text: "text-primary", light: "bg-primary/10" },
                                        secondary: { bg: "bg-secondary", text: "text-secondary", light: "bg-secondary/10" },
                                        sky: { bg: "bg-sky", text: "text-sky", light: "bg-sky/10" },
                                        accent: { bg: "bg-accent", text: "text-accent", light: "bg-accent/10" },
                                        violet: { bg: "bg-violet", text: "text-violet", light: "bg-violet/10" },
                                    };
                                    const colors = colorMap[event.color as keyof typeof colorMap];

                                    return (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card variant="elevated" className={`group h-full overflow-hidden border-2 rounded-2xl transition-all duration-300 hover:shadow-lg ${actualiteColorClasses[event.color]}`}>
                                                <CardContent className="p-4 sm:p-6">
                                                    <div className="flex flex-row gap-3 sm:gap-6">
                                                        {/* Icon */}
                                                        <div className={`flex h-12 sm:h-20 w-12 sm:w-20 shrink-0 items-center justify-center rounded-xl ${colors.light}`}>
                                                            <Calendar className={`h-6 sm:h-8 w-6 sm:w-8 ${colors.text}`} />
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                                <h3 className="font-bold text-lg sm:text-xl text-foreground line-clamp-2">
                                                                    {event.title}
                                                                </h3>
                                                                <Badge
                                                                    className="shrink-0"
                                                                    variant="secondary"
                                                                    style={{
                                                                        background: "rgb(156 163 175 / 0.7)",
                                                                        color: "rgb(31 41 55)"
                                                                    }}
                                                                >
                                                                    Passé
                                                                </Badge>
                                                            </div>

                                                            <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                                                                {event.description}
                                                            </p>

                                                            <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className={`h-4 w-4 ${colors.text}`} />
                                                                    {event.date}
                                                                </div>
                                                                {event.time && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className={`h-4 w-4 ${colors.text}`} />
                                                                        {event.time}
                                                                    </div>
                                                                )}
                                                                {event.location && (
                                                                    <div className="flex items-center gap-2">
                                                                        <MapPin className={`h-4 w-4 ${colors.text}`} />
                                                                        {event.location}
                                                                    </div>
                                                                )}
                                                                {event.attendees && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Users className={`h-4 w-4 ${colors.text}`} />
                                                                        {event.attendees} participants
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {event.link && (
                                                                <Button
                                                                    asChild
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="gap-2"
                                                                >
                                                                    <a href={event.link} target="_blank" rel="noopener noreferrer">
                                                                        Voir la photo
                                                                        <ChevronRight className="h-4 w-4" />
                                                                    </a>
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
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                {filteredActualites.length > 0 && (
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
                                    <Link to="/">
                                        <ArrowRight className="mr-2 h-5 w-5" />
                                        Retour à l'accueil
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
}
