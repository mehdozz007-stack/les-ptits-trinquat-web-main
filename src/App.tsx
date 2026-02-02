import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useInitializeDatabase } from "@/hooks/useInitializeDatabase";
import Index from "./pages/Index";
import Evenements from "./pages/Evenements";
import ComptesRendus from "./pages/ComptesRendus";
import Partenaires from "./pages/Partenaires";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import MessageEnvoye from "./pages/MessageEnvoye";
import Tombola2 from "./pages/Tombola2";
import AdminTombola from "./pages/AdminTombola";
import NotreEcole from "./pages/NotreEcole2";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Composant pour gérer le scroll au top et l'initialisation DB
const ScrollToTop = () => {
  useScrollToTop();
  useInitializeDatabase();
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
          <Route path="/evenements" element={<Evenements />} />
          <Route path="/comptes-rendus" element={<ComptesRendus />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/tombola" element={<Tombola2 />} />
          <Route path="/admin/tombola" element={<AdminTombola />} />
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
