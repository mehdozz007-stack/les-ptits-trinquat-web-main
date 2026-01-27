import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Download, Link as LinkIcon, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAllActualites, actualiteTypeLabels, actualiteColorClasses, ActualiteType } from "@/lib/actualites";
import { useToast } from "@/hooks/use-toast";

const badgeColors: Record<string, string> = {
    evenement: "bg-gradient-to-r from-sky/70 to-blue-400/70 text-white font-semibold shadow-sm",
    document: "bg-gradient-to-r from-violet/70 to-purple-400/70 text-white font-semibold shadow-sm",
    annonce: "bg-gradient-to-r from-primary/70 to-pink-400/70 text-white font-semibold shadow-sm",
    information: "bg-gradient-to-r from-emerald/70 to-teal-400/70 text-white font-semibold shadow-sm",
};

const titleGradients: Record<string, string> = {
    primary: "bg-gradient-to-r from-primary via-secondary to-pink bg-clip-text text-transparent font-extrabold",
    secondary: "bg-gradient-to-r from-secondary via-primary to-orange bg-clip-text text-transparent font-extrabold",
    sky: "bg-gradient-to-r from-sky-600 via-blue-600 to-violet-600 bg-clip-text text-transparent font-extrabold",
    violet: "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold",
    accent: "bg-gradient-to-r from-accent via-green-600 to-yellow-600 bg-clip-text text-transparent font-extrabold",
};

const allActualites = getAllActualites();

const filterOptions: { id: string; label: string; type?: ActualiteType }[] = [
    { id: "tous", label: "Tous" },
    { id: "evenement", label: "Événements", type: "evenement" },
    { id: "document", label: "Documents", type: "document" },
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
                <section className="relative py-12 sm:py-16 md:py-20">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl"
                        >
                            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                                <FileText className="h-4 w-4" />
                                Actualités
                            </span>
                            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
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
                                                        <h3 className={`font-bold line-clamp-2 ${titleGradients[actualite.color]}`}>
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
                                                <p className="text-sm text-muted-foreground line-clamp-4 flex-1">
                                                    {actualite.description}
                                                </p>

                                                {/* Footer avec date et bouton */}
                                                <div className="flex items-center justify-between gap-3 border-t border-current border-opacity-20 pt-4 mt-2">
                                                    <span className="text-xs font-medium text-muted-foreground">
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
