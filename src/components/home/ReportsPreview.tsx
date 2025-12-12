import { motion } from "framer-motion";
import { ArrowRight, FileText, Lock, Clock, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

const reports = [
  {
    id: 1,
    title: "Compte-rendu Conseil d'école",
    date: "15 Novembre 2025",
    type: "Conseil d'école",
    fileUrl: "/documents/exemple-cr-conseil-ecole.pdf",
  },
  {
    id: 2,
    title: "Réunion de rentrée",
    date: "10 Septembre 2025",
    type: "Réunion",
    fileUrl: "/documents/exemple-reunion-rentree.pdf",
  },
  {
    id: 3,
    title: "Assemblée générale 2025",
    date: "20 Juin 2025",
    type: "Assemblée",
    fileUrl: "/documents/exemple-assemblee-generale.pdf",
  },
  {
    id: 4,
    title: "Bilan financier annuel",
    date: "20 Juin 2025",
    type: "Financier",
    fileUrl: "/documents/exemple-bilan-financier.pdf",
  },
];

export function ReportsPreview() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const accessGranted = sessionStorage.getItem('comptesrendus_access');
    setIsUnlocked(accessGranted === 'true');
  }, []);

  const handleDownload = (fileUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = title + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative overflow-hidden bg-muted/50 py-20 md:py-28">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 h-40 w-40 rounded-full bg-secondary/20 watercolor-blob" />
        <div className="absolute bottom-20 left-10 h-60 w-60 rounded-full bg-primary/10 watercolor-blob" />
      </div>

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${isUnlocked ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary-foreground'}`}>
              {isUnlocked ? (
                <>
                  <FileText className="h-3.5 w-3.5" />
                  Documents accessibles
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  Accès réservé
                </>
              )}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Comptes-rendus et<br />
              <span className="text-gradient">procès-verbaux</span>
            </h2>
            <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
              Retrouvez tous les comptes-rendus de nos réunions, conseils d'école et assemblées générales. 
              {!isUnlocked && (
                <span className="block mt-2 text-primary font-medium">
                  Un code d'accès est nécessaire pour consulter ces documents.
                </span>
              )}
            </p>
            <Button variant="default" size="lg" asChild>
              <Link to="/comptes-rendus">
                {isUnlocked ? 'Voir tous les documents' : 'Accéder aux documents'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Reports List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated" className={`group ${!isUnlocked ? 'opacity-75' : ''}`}>
                  <CardContent className="flex items-center gap-4 p-4">
                    {/* Icon */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isUnlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <FileText className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {report.date}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                          {report.type}
                        </span>
                      </div>
                    </div>

                    {/* Download or Lock icon */}
                    {isUnlocked ? (
                      <button
                        onClick={() => handleDownload(report.fileUrl, report.title)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* CTA to unlock */}
            {!isUnlocked && (
              <div className="pt-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Vous n'avez pas de code d'accès ?
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contact">
                    Contactez-nous pour en obtenir un
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
