import { motion } from "framer-motion";
import { FileText, Download, Clock, Search } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// ===== CODE D'ACCÈS - DÉSACTIVÉ POUR LE MOMENT =====
// Liste des codes d'accès valides (à activer si besoin)
// Ces codes peuvent être distribués aux parents après contact via le formulaire
/*const VALID_ACCESS_CODES = [
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
];*/
// ===== FIN CODE D'ACCÈS =====

const reports = [
  {
    id: 1,
    title: "Conseil d'école - 2025-2026",
    date: "2025-2026",
    type: "Conseil d'école",
    category: "conseil",
    hasFile: true,
    fileUrl: "https://www.ent-ecole.fr/cardboard/0193c594-bf68-798a-97b7-aedda95767a2",
  },
  /*{
    id: 2,
    title: "Compte-rendu Conseil d'école - Novembre 2025",
    date: "Novembre 2025",
    type: "Conseil d'école",
    category: "conseil",
    hasFile: true,
    fileUrl: "/documents/Compte Rendu Conseil d'école Asso Novembre 2025.pdf",
  },
  {
    id: 3,
    title: "Procès-Verbal Assemblée Générale - 25 Septembre 2025",
    date: "25 Septembre 2025",
    type: "Assemblée",
    category: "assemblee",
    hasFile: true,
    fileUrl: "/documents/Proces VVerbale Assemblee Generale Ptits Trinquat - 25092025.pdf",
  },
  {
    id: 4,
    title: "Compte Rendu Assemblée Générale - 2025-2026",
    date: "2025-2026",
    type: "Assemblée",
    category: "assemblee",
    hasFile: true,
    fileUrl: "/documents/Compte Rendu  Assemblé Générale Asso 2025-2026.pdf",
  },
  {
    id: 5,
    title: "Procès-Verbal Conseil d'Administration - 2025-2026",
    date: "2025-2026",
    type: "Bureau",
    category: "reunion",
    hasFile: true,
    fileUrl: "/documents/Proces Verbale CONSEIL ADMINISTRATION LES PTITS TRINQUAT 25_26.pdf",
  },
  {
    id: 6,
    title: "Annexe - Présence Conseil d'École - 2025",
    date: "2025",
    type: "Document",
    category: "reunion",
    hasFile: true,
    fileUrl: "/documents/Annexe-0 presence.pdf",
  },
  {
    id: 7,
    title: "Procès-Verbal Elections Parents - Annexe 1",
    date: "2025-2026",
    type: "Élections",
    category: "assemblee",
    hasFile: true,
    fileUrl: "/documents/Annexe-1-pv-elections-parents-2025-2026.pdf",
  },
  {
    id: 8,
    title: "Procès-Verbal Elections Parents - Annexe 1 bis",
    date: "2025-2026",
    type: "Élections",
    category: "assemblee",
    hasFile: true,
    fileUrl: "/documents/Annexe-1-bis-pv-elections-parents-2025-2026.pdf",
  },
  {
    id: 9,
    title: "Questions-Réponses Parents Conseil d'École - Annexe 3",
    date: "2025-2026",
    type: "Sondage",
    category: "reunion",
    hasFile: true,
    fileUrl: "/documents/annexe-3-reponses-parents-dickens-frank.pdf",
  },
  {
    id: 10,
    title: "Compte de Résultat - 2024-2025",
    date: "2024-2025",
    type: "Financier",
    category: "financier",
    hasFile: true,
    fileUrl: "/documents/COMPTE DE RESULTAT 2024-2025 LES PTITS TRINQUAT.pdf",
  },
  {
    id: 11,
    title: "Compte-rendu Installation Barrière",
    date: "2025",
    type: "Projet",
    category: "reunion",
    hasFile: true,
    fileUrl: "/documents/Compte rendu _Barriere installation.pdf",
  },
  {
    id: 12,
    title: "Rapport d'Activités - 2024-2025",
    date: "2024-2025",
    type: "Rapport",
    category: "financier",
    hasFile: true,
    fileUrl: "/documents/Rapport activites 2024-2025.pdf",
  },*/
  {
    id: 13,
    title: "Fiche RSST",
    date: "2025",
    type: "Sécurité",
    category: "document",
    hasFile: true,
    fileUrl: "/documents/RSST_FICHE.pdf",
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
  const { toast } = useToast();

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

  // ===== PAGE DE VERROUILLAGE - DÉSACTIVÉE =====
  // Pour réactiver le système de code d'accès:
  // 1. Décommenter les codes VALID_ACCESS_CODES en haut du fichier
  // 2. Décommenter la logique ci-dessous
  // 3. Utiliser: if (!isUnlocked) { return (...page verrouillée...); }
  /*
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

  if (!isUnlocked) {
    return (
      <Layout>
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-muted/50 py-20">
          ... page de verrouillage ...
        </section>
      </Layout>
    );
  }
  */
  // ===== FIN PAGE DE VERROUILLAGE =====

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
                id={`report-${report.id}`}
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
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors md:line-clamp-1">
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
