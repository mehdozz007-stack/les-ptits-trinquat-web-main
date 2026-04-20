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
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all other routes for code splitting
const Actualites = React.lazy(() => import("./pages/Actualites").then(m => ({ default: m.Actualites })));
const ActualiteDetail = React.lazy(() => import("./pages/ActualiteDetail"));
const DocumentsUtiles = React.lazy(() => import("./pages/DocumentsUtiles"));
const Partenaires = React.lazy(() => import("./pages/Partenaires"));
const APropos = React.lazy(() => import("./pages/APropos"));
const Contact = React.lazy(() => import("./pages/Contact"));
const MessageEnvoye = React.lazy(() => import("./pages/MessageEnvoye"));
const Auth = React.lazy(() => import("./pages/Auth"));
const AdminNewsletter = React.lazy(() => import("./pages/AdminNewsletter"));
const AdminNewsletterAuth = React.lazy(() => import("./pages/AdminNewsletterAuth"));
const NotreEcole = React.lazy(() => import("./pages/NotreEcole2"));
const TombolaSecret = React.lazy(() => import("./pages/TombolaSecret"));
const AdminTombolaSecret = React.lazy(() => import("./pages/AdminTombolaSecret"));

const queryClient = new QueryClient();

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/a-propos" element={<APropos />} />
              <Route path="/notre-ecole" element={<NotreEcole />} />
              {/* Redirection vers actualites */}
              <Route path="/evenements" element={<Navigate to="/actualites" replace />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/actualites/:id" element={<ActualiteDetail />} />
              <Route path="/documents-utiles" element={<DocumentsUtiles />} />
              {/* Comptes rendus redirects to 404 */}
              <Route path="/comptes-rendus" element={<NotFound />} />
              <Route path="/partenaires" element={<Partenaires />} />
              {/* Pages d'authentification et tombola */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin/newsletter/auth" element={<AdminNewsletterAuth />} />
              <Route path="/tombola" element={<NotFound />} />
              <Route path="/tombola/:token" element={<TombolaSecret />} />
              <Route path="/admin/tombola" element={<NotFound />} />
              <Route path="/admin/tombola/:token" element={<AdminTombolaSecret />} />
              <Route path="/admin/newsletter" element={<AdminNewsletter />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/message-envoye" element={<MessageEnvoye />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TombolaRefreshProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
