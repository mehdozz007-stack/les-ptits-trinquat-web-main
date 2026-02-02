import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Index from "./pages/Index";
import { Actualites } from "./pages/Actualites";
import Partenaires from "./pages/Partenaires";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import MessageEnvoye from "./pages/MessageEnvoye";
import NotreEcole from "./pages/NotreEcole2";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Composant pour gérer le scroll au top
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/notre-ecole" element={<NotreEcole />} />
          {/* Redirection vers actualites */}
          <Route path="/evenements" element={<Navigate to="/actualites" replace />} />
          <Route path="/actualites" element={<Actualites />} />
          {/* Comptes rendus redirects to 404 */}
          <Route path="/comptes-rendus" element={<NotFound />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/message-envoye" element={<MessageEnvoye />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
