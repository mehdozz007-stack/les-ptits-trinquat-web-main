import { motion } from "framer-motion";
import { FileText, Download, Clock, Search, Lock, KeyRound } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Liste des codes d'accès valides
// Ces codes peuvent être distribués aux parents après contact via le formulaire
const VALID_ACCESS_CODES = [
  "FCPE-2026-ALPHA",
  "FCPE-2026-BETA",
  "FCPE-2026-GAMMA",
  "FCPE-2026-DELTA",
  "FCPE-2026-EPSILON",
  "FCPE-2026-ZETA",
  "FCPE-2026-ETA",
  "FCPE-2026-THETA",
  "FCPE-2026-IOTA",
  "FCPE-2026-KAPPA",
  "PARENT-ACCESS-001",
  "PARENT-ACCESS-002",
  "PARENT-ACCESS-003",
  "PARENT-ACCESS-004",
  "PARENT-ACCESS-005",
  "ECOLE-DOC-2024",
  "ECOLE-DOC-2025",
  "CONSEIL-ACCES-01",
  "CONSEIL-ACCES-02",
  "CONSEIL-ACCES-03",
];

const reports = [
  {
    id: 1,
    title: "Compte-rendu Conseil d'école - Novembre 2024",
    date: "15 Novembre 2024",
    type: "Conseil d'école",
    category: "conseil",
    hasFile: true,
    fileUrl: "/documents/exemple-cr-conseil-ecole.pdf",
  },
  {
    id: 2,
    title: "Compte-rendu Conseil d'école - Juin 2024",
    date: "15 Juin 2024",
    type: "Conseil d'école",
    category: "conseil",
    hasFile: true,
    fileUrl: "/documents/exemple-cr-conseil-ecole.pdf",
  },
  {
    id: 3,
    title: "Réunion de rentrée 2024-2025",
    date: "10 Septembre 2024",
    type: "Réunion",
    category: "reunion",
    hasFile: true,
    fileUrl: "/documents/exemple-reunion-rentree.pdf",
  },
  {
    id: 4,
    title: "Procès-verbal Assemblée Générale 2024",
    date: "20 Juin 2024",
    type: "Assemblée",
    category: "assemblee",
    hasFile: true,
    fileUrl: "/documents/exemple-assemblee-generale.pdf",
  },
  {
    id: 5,
    title: "Bilan financier annuel 2023-2024",
    date: "20 Juin 2024",
    type: "Financier",
    category: "financier",
    hasFile: true,
    fileUrl: "/documents/exemple-bilan-financier.pdf",
  },
  {
    id: 6,
    title: "Réunion bureau - Mai 2024",
    date: "15 Mai 2024",
    type: "Bureau",
    category: "reunion",
    hasFile: true,
    fileUrl: "/documents/exemple-reunion-rentree.pdf",
  },
  {
    id: 7,
    title: "Compte-rendu Conseil d'école - Mars 2024",
    date: "20 Mars 2024",
    type: "Conseil d'école",
    category: "conseil",
    hasFile: true,
    fileUrl: "/documents/exemple-cr-conseil-ecole.pdf",
  },
  {
    id: 8,
    title: "Bilan Fête de l'école 2024",
    date: "25 Juin 2024",
    type: "Événement",
    category: "evenement",
    hasFile: true,
    fileUrl: "/documents/exemple-assemblee-generale.pdf",
  },
];

const categories = [
  { id: "all", label: "Tous" },
  { id: "conseil", label: "Conseils d'école" },
  { id: "reunion", label: "Réunions" },
  { id: "assemblee", label: "Assemblées" },
  { id: "financier", label: "Financier" },
  { id: "evenement", label: "Événements" },
];

const ComptesRendus = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const { toast } = useToast();

  // Vérifier si l'accès a déjà été accordé (stocké en session)
  useEffect(() => {
    const storedAccess = sessionStorage.getItem("comptesrendus_access");
    if (storedAccess === "granted") {
      setIsUnlocked(true);
    }
  }, []);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedCode = accessCode.trim().toUpperCase();
    
    if (VALID_ACCESS_CODES.includes(normalizedCode)) {
      setIsUnlocked(true);
      sessionStorage.setItem("comptesrendus_access", "granted");
      toast({
        title: "Accès autorisé",
        description: "Bienvenue ! Vous avez maintenant accès aux documents.",
      });
    } else {
      toast({
        title: "Code invalide",
        description: "Le code saisi n'est pas valide. Contactez-nous pour obtenir un code d'accès.",
        variant: "destructive",
      });
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || report.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (fileUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${title.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Page de verrouillage
  if (!isUnlocked) {
    return (
      <Layout>
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-muted/50 py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 right-20 h-60 w-60 rounded-full bg-secondary/20 watercolor-blob" />
            <div className="absolute bottom-10 -left-10 h-40 w-40 rounded-full bg-violet/20 watercolor-blob" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/5 watercolor-blob" />
          </div>

          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-md text-center"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-10 w-10 text-primary" />
              </div>
              
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Accès protégé
              </h1>
              <p className="mb-8 text-muted-foreground">
                Cette section est réservée aux membres de l'association. 
                Entrez votre code d'accès pour consulter les documents.
              </p>

              <Card variant="elevated" className="text-left">
                <CardContent className="p-6">
                  <form onSubmit={handleCodeSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="accessCode" className="text-sm font-medium">
                        Code d'accès
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="accessCode"
                          type="text"
                          placeholder="Entrez votre code..."
                          value={accessCode}
                          onChange={(e) => setAccessCode(e.target.value)}
                          className="pl-10 uppercase"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={!accessCode.trim()}>
                      Accéder aux documents
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      Vous n'avez pas de code ?{" "}
                      <Link to="/contact" className="text-primary font-medium hover:underline">
                        Contactez-nous
                      </Link>{" "}
                      pour en obtenir un.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/50 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 right-20 h-60 w-60 rounded-full bg-secondary/20 watercolor-blob" />
          <div className="absolute bottom-10 -left-10 h-40 w-40 rounded-full bg-violet/20 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-semibold text-secondary-foreground">
              <FileText className="h-4 w-4" />
              Documents
            </span>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Comptes-rendus et<br />
              <span className="text-gradient">procès-verbaux</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Retrouvez tous les documents officiels de l'association : conseils d'école, réunions, assemblées générales et bilans financiers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="border-b border-border bg-card py-6">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un document..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reports List */}
      <section className="py-12">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredReports.length} document{filteredReports.length > 1 ? "s" : ""} trouvé{filteredReports.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-4">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="elevated" className="group">
                  <CardContent className="flex items-center gap-4 p-4 md:p-6">
                    {/* Icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors md:h-14 md:w-14">
                      <FileText className="h-5 w-5 md:h-6 md:w-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {report.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {report.date}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                          {report.type}
                        </span>
                      </div>
                    </div>

                    {/* Download */}
                    {report.hasFile && report.fileUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => handleDownload(report.fileUrl, report.title)}
                      >
                        <Download className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Télécharger</span>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">Aucun document trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier votre recherche ou vos filtres.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ComptesRendus;
