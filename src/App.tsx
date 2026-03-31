import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Build timestamp: 2026-03-08 03:50:00 UTC
console.log("[APP] Build with React imports fixed for Framer Motion");
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TombolaRefreshProvider } from "@/context/TombolaRefreshContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useInitializeDatabase } from "@/hooks/useInitializeDatabase";

// Pages chargées immédiatement (critiques)
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import MessageEnvoye from "./pages/MessageEnvoye";
import NotFound from "./pages/NotFound";

// Pages lazy-loadées (non-critiques)
const Actualites = React.lazy(() => import("./pages/Actualites"));
const ActualiteDetail = React.lazy(() => import("./pages/ActualiteDetail"));
const DocumentsUtiles = React.lazy(() => import("./pages/DocumentsUtiles"));
const Partenaires = React.lazy(() => import("./pages/Partenaires"));
const APropos = React.lazy(() => import("./pages/APropos"));
const TombolaProtected = React.lazy(() => import("./pages/TombolaProtected"));
const Auth = React.lazy(() => import("./pages/Auth"));
const AdminTombola = React.lazy(() => import("./pages/AdminTombola"));
const AdminNewsletter = React.lazy(() => import("./pages/AdminNewsletter"));
const AdminNewsletterAuth = React.lazy(() => import("./pages/AdminNewsletterAuth"));
const NotreEcole = React.lazy(() => import("./pages/NotreEcole2"));

const queryClient = new QueryClient();

// Composant de loading
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  </div>
);

// Composant pour gérer le scroll au top et l'initialisation DB
const ScrollToTop = () => {
  useScrollToTop();
  useInitializeDatabase();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TombolaRefreshProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Routes critiques - chargées immédiatement */}
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/message-envoye" element={<MessageEnvoye />} />

            {/* Routes lazy-loadées avec Suspense fallback */}
            <Route
              path="/a-propos"
              element={
                <Suspense fallback={<PageLoader />}>
                  <APropos />
                </Suspense>
              }
            />
            <Route
              path="/notre-ecole"
              element={
                <Suspense fallback={<PageLoader />}>
                  <NotreEcole />
                </Suspense>
              }
            />
            {/* Redirection vers actualites */}
            <Route path="/evenements" element={<Navigate to="/actualites" replace />} />
            <Route
              path="/actualites"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Actualites />
                </Suspense>
              }
            />
            <Route
              path="/actualites/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ActualiteDetail />
                </Suspense>
              }
            />
            <Route
              path="/documents-utiles"
              element={
                <Suspense fallback={<PageLoader />}>
                  <DocumentsUtiles />
                </Suspense>
              }
            />
            {/* Comptes rendus redirects to 404 */}
            <Route path="/comptes-rendus" element={<NotFound />} />
            <Route
              path="/partenaires"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Partenaires />
                </Suspense>
              }
            />

            {/* Pages d'authentification et tombola - lazy-loadées */}
            <Route
              path="/auth"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Auth />
                </Suspense>
              }
            />
            <Route
              path="/admin/newsletter/auth"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminNewsletterAuth />
                </Suspense>
              }
            />
            <Route
              path="/tombola"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TombolaProtected />
                </Suspense>
              }
            />
            <Route
              path="/admin/tombola"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminTombola />
                </Suspense>
              }
            />
            <Route
              path="/admin/newsletter"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminNewsletter />
                </Suspense>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TombolaRefreshProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
