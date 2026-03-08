import React from 'react';
import { motion } from "framer-motion";
import { Search, Users, UserCheck, UserX, Trash2, Mail, Download } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Subscriber } from "@/hooks/useNewsletterAdmin";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";

interface SubscribersListProps {
  subscribers: Subscriber[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCount: number;
  totalCount: number;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

// Détecte si on est sur mobile pour optimiser les animations
const isMobileDevice = () => typeof window !== "undefined" && window.innerWidth < 640;

export function SubscribersList({
  subscribers,
  searchQuery,
  onSearchChange,
  activeCount,
  totalCount,
  onToggleStatus,
  onDelete,
}: SubscribersListProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    console.log('[SubscribersList] Mobile detection:', {
      isMobile: isMobileDevice(),
      windowWidth: typeof window !== "undefined" ? window.innerWidth : "N/A",
      subscribersLength: subscribers.length
    });

    // Écouter les changements de taille de fenêtre
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [subscribers.length]);

  // Log quand les subscribers changent
  useEffect(() => {
    console.log('[SubscribersList] Subscribers updated:', {
      count: subscribers.length,
      items: subscribers.slice(0, 2).map(s => ({ id: s.id, email: s.email }))
    });
  }, [subscribers]);

  // Désactiver les animations sur mobile pour éviter le scroll anchoring
  const animationVariants = isMobile ? {} : {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  };
  const exportToCSV = () => {
    const headers = ["Prénom", "Email", "Date d'inscription", "Statut"];
    const rows = subscribers.map((sub) => [
      sub.first_name || "",
      sub.email,
      new Date(sub.created_at).toLocaleDateString("fr-FR"),
      sub.is_active ? "Actif" : "Désinscrit",
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(";")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `abonnes-newsletter-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV téléchargé");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-sm border-orange-100/50 bg-white/40 sm:bg-white/60 sm:backdrop-blur-sm hover:shadow-md transition-shadow relative z-0" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col gap-4 sm:gap-0">
            <div>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] bg-clip-text text-transparent" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <span>Liste des abonnés</span>
              </CardTitle>
              <CardDescription className="mt-1 sm:mt-2 text-xs sm:text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <strong className="text-[#FF7B42]">{activeCount}</strong> abonnés actifs sur <strong>{totalCount}</strong> inscrits
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:justify-end">
              <Badge variant="outline" className="flex items-center gap-1 border-orange-200 text-[#FF7B42] text-xs">
                <UserCheck className="h-3 w-3" />
                {activeCount} actifs
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1 bg-rose-100 text-rose-700 text-xs">
                <UserX className="h-3 w-3" />
                {totalCount - activeCount} désinscrits
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={subscribers.length === 0}
                className="border-orange-200 text-[#FF7B42] hover:bg-orange-50/50 text-xs h-8 sm:h-9"
              >
                <Download className="h-3 w-3 mr-1" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-3 py-3 sm:px-6 sm:py-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-200 pointer-events-none" />
            <Input
              placeholder="Rechercher par email ou prénom..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"
            />
          </div>

          {subscribers.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <Mail className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-30" />
              <p style={{ fontFamily: "'Nunito', sans-serif" }} className="text-sm sm:text-base">Aucun abonné trouvé</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block rounded-xl border border-orange-100/50 overflow-hidden bg-white/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-orange-50/50 to-rose-50/50 border-orange-100/50">
                      <TableHead style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm text-gray-700">Prénom</TableHead>
                      <TableHead style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm text-gray-700">Email</TableHead>
                      <TableHead style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm text-gray-700">Inscrit le</TableHead>
                      <TableHead style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm text-gray-700">Statut</TableHead>
                      <TableHead style={{ fontFamily: "'Nunito', sans-serif" }} className="text-right text-xs sm:text-sm text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber, index) => (
                      <motion.tr
                        key={subscriber.id}
                        {...animationVariants}
                        transition={isMobile ? undefined : { delay: index * 0.05 }}
                        className="border-b last:border-0 hover:bg-orange-50/30 transition-colors"
                      >
                        <TableCell className="font-medium text-sm">
                          {subscriber.first_name || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {subscriber.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(subscriber.created_at), "dd MMM yyyy", { locale: fr })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={subscriber.is_active ? "default" : "secondary"}
                            className={subscriber.is_active ? "bg-gradient-to-r from-[#FF7B42] to-[#FF9A6A] text-white hover:opacity-90 text-xs" : "bg-rose-100 text-rose-700 hover:bg-rose-100 text-xs"}
                          >
                            {subscriber.is_active ? "Actif" : "Désinscrit"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onToggleStatus(subscriber.id, subscriber.is_active)}
                              className={`${subscriber.is_active ? "text-[#FF7B42] hover:bg-orange-50/50" : "text-green-600 hover:bg-green-50/50"} h-8 w-8 p-0`}
                            >
                              {subscriber.is_active ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-[#C55FA8] hover:bg-rose-50/50 h-8 w-8 p-0">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="w-[95vw] sm:w-auto">
                                <AlertDialogHeader>
                                  <AlertDialogTitle style={{ fontFamily: "'Nunito', sans-serif" }} className="text-base sm:text-lg">Supprimer cet abonné ?</AlertDialogTitle>
                                  <AlertDialogDescription style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs sm:text-sm">
                                    Cette action est irréversible. L'abonné sera définitivement supprimé de la liste.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                                  <AlertDialogCancel className="text-xs sm:text-sm">Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDelete(subscriber.id)}
                                    className="text-xs sm:text-sm">
                                    Supprimer</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View - SIMPLE & BEAUTIFUL */}
              <div className="sm:hidden">
                <div style={{ display: 'block' }} className="space-y-3">
                  {subscribers.map((subscriber) => (
                    <div
                      key={subscriber.id}
                      className="bg-white rounded-lg border border-orange-100 shadow-sm hover:shadow-md transition-shadow"
                      style={{ padding: '16px' }}
                    >
                      {/* Header with name and badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">
                            {subscriber.first_name || "Prénom inconnu"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {subscriber.email}
                          </p>
                        </div>
                        <Badge
                          className={`whitespace-nowrap text-xs ${subscriber.is_active
                            ? "bg-gradient-to-r from-[#FF7B42] to-[#FF9A6A] text-white"
                            : "bg-rose-100 text-rose-700"
                            }`}
                        >
                          {subscriber.is_active ? "Actif" : "Désinscrit"}
                        </Badge>
                      </div>

                      {/* Date */}
                      <p className="text-xs text-gray-400 mb-4">
                        📅 {format(new Date(subscriber.created_at), "dd MMM yyyy", { locale: fr })}
                      </p>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2 border-t border-orange-50">
                        <button
                          onClick={() => onToggleStatus(subscriber.id, subscriber.is_active)}
                          className="flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all"
                          style={{
                            backgroundColor: subscriber.is_active ? '#FFE8D6' : '#D4EDDA',
                            color: subscriber.is_active ? '#FF7B42' : '#28a745',
                            border: `1px solid ${subscriber.is_active ? '#FF7B42' : '#28a745'}`,
                            marginTop: '8px'
                          }}
                        >
                          {subscriber.is_active ? (
                            <>
                              <UserX className="h-3 w-3 mr-1 inline" />
                              Résilier
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3 w-3 mr-1 inline" />
                              Réactiver
                            </>
                          )}
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all"
                              style={{
                                backgroundColor: '#FCE8EC',
                                color: '#C55FA8',
                                border: '1px solid #C55FA8',
                                marginTop: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 className="h-3 w-3 mr-1 inline" />
                              Supprimer
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="w-[95vw] sm:w-auto">
                            <AlertDialogHeader>
                              <AlertDialogTitle style={{ fontFamily: "'Nunito', sans-serif" }} className="text-base">
                                Supprimer {subscriber.first_name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription style={{ fontFamily: "'Nunito', sans-serif" }} className="text-xs">
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col-reverse gap-2">
                              <AlertDialogCancel className="text-xs">Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(subscriber.id)}
                                className="text-xs"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
