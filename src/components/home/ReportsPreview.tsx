import { motion } from "framer-motion";
import { ArrowRight, FileText, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  },*/
  {
    id: 13,
    title: "Fiche RSST",
    date: "2025",
    type: "Sécurité",
    category: "reunion",
    hasFile: true,
    fileUrl: "/documents/RSST_FICHE.pdf",
  },
  /*{
    id: 4,
    title: "Compte de Résultat - 2024-2025",
    date: "2024-2025",
    type: "Financier",
  },*/
];

export function ReportsPreview() {
  return (
    <section className="relative overflow-hidden bg-muted/50 py-8 sm:py-12 md:py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 right-5 sm:right-10 h-32 sm:h-40 w-32 sm:w-40 rounded-full bg-secondary/20 watercolor-blob" />
        <div className="absolute -bottom-5 sm:bottom-20 -left-5 sm:left-10 h-40 sm:h-60 w-40 sm:w-60 rounded-full bg-primary/10 watercolor-blob" />
      </div>

      <div className="container relative px-3 sm:px-4">
        <div className="grid gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-2 items-start lg:items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs font-semibold text-secondary-foreground">
              <FileText className="h-3 w-3" />
              Documents officiels
            </span>
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Comptes-rendus et<br />
              <span className="text-gradient">procès-verbaux</span>
            </h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              Retrouvez tous les comptes-rendus de nos réunions, conseils d'école, assemblées générales et documents financiers de l'association.
            </p>
          </motion.div>

          {/* Reports List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-2 sm:space-y-3"
          >
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated" className="group">
                  <CardContent className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3">
                    {/* Icon */}
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary-foreground">
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                        {report.title}
                      </h3>
                      <div className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          {report.date}
                        </span>
                        <span className="hidden sm:inline-block w-px h-3 bg-border" />
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">
                          {report.type}
                        </span>
                      </div>
                    </div>

                    {/* View Button - Always visible */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 h-7 px-2 sm:h-8 sm:px-3"
                      asChild
                    >
                      <Link to={`/comptes-rendus#report-${report.id}`} className="text-xs sm:text-sm">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline ml-1">Voir</span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center lg:col-span-2 mt-6"
          >
            <Button
              variant="default"
              size="lg"
              className="text-sm sm:text-base"
              asChild
            >
              <Link to="/comptes-rendus" className="flex items-center gap-2">
                Voir tous les documents
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
