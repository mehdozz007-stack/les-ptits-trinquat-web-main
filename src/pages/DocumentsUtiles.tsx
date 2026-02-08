import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Files, Search, Heart, FileQuestion, LucideFileQuestion } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { actualitesData, actualiteTypeLabels, actualiteColorClasses } from "@/lib/actualites";
import { useToast } from "@/hooks/use-toast";

// Récupérer uniquement les documents
const allDocuments = actualitesData.filter((doc) => doc.type === "document");

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
    document: "bg-gradient-to-r from-violet/70 to-purple-400/70 text-white font-semibold shadow-sm",
};

export function DocumentsUtiles() {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDocuments = allDocuments.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                {/* Header Section */}
                <section className="relative overflow-hidden bg-hero py-20">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-sky/20 watercolor-blob" />
                        <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-primary/20 watercolor-blob" />
                    </div>
                    <div className="container relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                                <Files className="h-4 w-4" />
                                Documents
                            </span>
                            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
                                Documents <span className="text-gradient">Utiles</span>
                            </h1>
                            <p className="text-base sm:text-lg text-muted-foreground mb-8">
                                Retrouvez ici tous les documents importants de l'école. Consultez et téléchargez facilement les fiches, protocoles et informations essentielles.
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher un document..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-3 rounded-xl border-2 border-violet/20 bg-white/50 backdrop-blur-sm focus:border-violet/50 transition"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Documents Grid */}
                <section className="py-12 sm:py-16 md:py-20">
                    <div className="container">
                        {filteredDocuments.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredDocuments.map((doc, index) => (
                                    <motion.div
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group h-full"
                                    >
                                        <Card
                                            className={`h-full overflow-hidden border-2 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 ${actualiteColorClasses[doc.color]}`}
                                        >
                                            <CardContent className="flex flex-col gap-4 p-6">
                                                {/* Header */}
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <h3 className={`font-bold text-lg ${titleGradients[doc.color]}`}>
                                                            {doc.title}
                                                        </h3>
                                                    </div>
                                                    <Badge
                                                        className={`shrink-0 ${badgeColors[doc.type]}`}
                                                        variant="secondary"
                                                    >
                                                        {actualiteTypeLabels[doc.type]}
                                                    </Badge>
                                                </div>

                                                {/* Description */}
                                                <p className="text-sm text-muted-foreground flex-1">
                                                    {doc.description}
                                                </p>

                                                {/* Date */}
                                                <div className="border-t border-current border-opacity-20 pt-4">
                                                    <p className="text-xs text-muted-foreground mb-4">
                                                        {doc.date}
                                                    </p>

                                                    {/* Download Button */}
                                                    {doc.fileUrl && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handleDownload(doc.fileUrl!, doc.title)}
                                                            className="w-full gap-2"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            Télécharger
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-muted/50">
                                <CardContent className="py-12 text-center">
                                    <Files className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        Aucun document trouvé pour "{searchQuery}". Essayez une autre recherche.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
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
                            <FileQuestion className="mx-auto mb-4 h-12 w-12 text-sky-700" />
                            <h2 className="mb-4 text-2xl font-bold">Des questions ?</h2>
                            <p className="mb-8 max-w-2xl text-muted-foreground mx-auto">
                                Si vous ne trouvez pas le document que vous cherchez, n'hésitez pas à nous contacter.
                            </p>
                            <Button variant="playful" size="lg" asChild>
                                <a href="/contact">Nous contacter</a>
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

export default DocumentsUtiles;
