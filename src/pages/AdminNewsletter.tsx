import { Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, RefreshCw, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SubscribersList } from "@/components/admin/SubscribersList";
import { NewsletterEditor } from "@/components/admin/NewsletterEditor";
import { NewsletterHistory } from "@/components/admin/NewsletterHistory";
import { useNewsletterAdmin } from "@/hooks/useNewsletterAdmin";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminNewsletter() {
  const { user, isLoading, signOut } = useAdminAuth();
  const {
    subscribers,
    isLoading: isLoadingData,
    searchQuery,
    setSearchQuery,
    activeSubscribersCount,
    totalSubscribersCount,
    toggleSubscriberStatus,
    deleteSubscriber,
    refreshData,
  } = useNewsletterAdmin();

  useEffect(() => {
    console.log('[AdminNewsletter] Subscribers changed:', {
      count: subscribers.length,
      isLoading: isLoadingData
    });
  }, [subscribers.length, isLoadingData]);

  // Rediriger vers le login si pas authentifié
  if (!isLoading && !user) {
    return <Navigate to="/admin/newsletter/auth" replace />;
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#FFFBF7] via-[#F8F5FF] to-[#F5F9FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-orange-100/50 bg-gradient-to-r from-[#FFF5F0] to-[#FFF0F7] backdrop-blur-lg shadow-sm">
          <div className="container flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link to="/">
                <Button variant="ghost" size="sm" className="hover:bg-orange-50/50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Retour</span>
                </Button>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gradient-to-b from-orange-200 to-rose-200" />
              <div className="hidden sm:flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0">
                  <Mail className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-semibold text-sm bg-gradient-to-r from-[#FF7B42] to-[#C55FA8] bg-clip-text text-transparent truncate">Administration Newsletter</span>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('[AdminNewsletter] Refresh button clicked');
                  refreshData();
                }}
                disabled={isLoadingData}
                className="border-orange-200 hover:bg-orange-50/50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
              >
                {isLoadingData ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="hidden sm:inline ml-1 sm:ml-2">Actualiser</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} title={`Déconnexion (${user?.email})`} className="hover:bg-rose-50/50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1 sm:ml-2">Déconnexion</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-4 sm:py-8 px-2 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] bg-clip-text text-transparent" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
              Gestion de la Newsletter
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Gérez vos abonnés et envoyez des newsletters aux familles
            </p>
          </motion.div>

          {isLoadingData ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 auto-rows-max">
              {/* Left Column - Subscribers List (full width on mobile, half on desktop) */}
              <div className="space-y-6 sm:space-y-8">
                <SubscribersList
                  subscribers={subscribers}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeCount={activeSubscribersCount}
                  totalCount={totalSubscribersCount}
                  onToggleStatus={toggleSubscriberStatus}
                  onDelete={deleteSubscriber}
                />
              </div>

              {/* Right Column - Editor & History (full width on mobile, half on desktop) */}
              <div className="space-y-6 sm:space-y-8">
                <NewsletterEditor />
                <NewsletterHistory />
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminLayout>
  );
}
