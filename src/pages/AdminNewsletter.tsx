import { Link } from "react-router-dom";
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
  const { user, signOut } = useAdminAuth();
  const {
    subscribers,
    newsletters,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeSubscribersCount,
    totalSubscribersCount,
    toggleSubscriberStatus,
    deleteSubscriber,
    saveNewsletter,
    deleteNewsletter,
    refreshData,
  } = useNewsletterAdmin();

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-lg">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au site
                </Button>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                  <Mail className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">Administration Newsletter</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="hidden sm:inline ml-2">Actualiser</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} title={`Déconnexion (${user?.email})`}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Déconnexion</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground">Gestion de la Newsletter</h1>
            <p className="text-muted-foreground mt-2">
              Gérez vos abonnés et envoyez des newsletters aux familles
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-8">
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

              {/* Right Column */}
              <div className="space-y-8">
                <NewsletterEditor
                  activeSubscribersCount={activeSubscribersCount}
                  onSave={saveNewsletter}
                  onRefresh={refreshData}
                />
                <NewsletterHistory
                  newsletters={newsletters}
                  onDelete={deleteNewsletter}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminLayout>
  );
}
