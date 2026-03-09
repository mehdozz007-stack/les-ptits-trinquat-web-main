import { useState, useEffect, useCallback } from "react";
import { newsletterApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  consent: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  preview_text?: string;
  status: string;
  sent_at: string | null;
  recipients_count: number;
  created_at: string;
  updated_at: string;
}

export function useNewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchSubscribers = useCallback(async () => {
    try {
      console.log('[useNewsletterAdmin] Fetching subscribers...');
      const result = await newsletterApi.getSubscribers();
      console.log('[useNewsletterAdmin] API Result:', result);

      if (result.success && result.data) {
        console.log('[useNewsletterAdmin] Subscribers loaded:', result.data.length, 'items');
        setSubscribers(result.data);
      } else {
        console.warn('[useNewsletterAdmin] API returned false success or no data:', result);
        throw new Error(result.error || "Erreur lors du chargement des abonnés");
      }
    } catch (error: any) {
      console.error("Fetch subscribers error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les abonnés.",
        variant: "destructive",
      });
      setSubscribers([]);
    }
  }, [toast]);

  const fetchNewsletters = useCallback(async () => {
    try {
      const result = await newsletterApi.getNewsletters();
      if (result.success && result.data) {
        setNewsletters(result.data);
      } else {
        throw new Error(result.error || "Erreur lors du chargement des newsletters");
      }
    } catch (error: any) {
      console.error("Fetch newsletters error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les newsletters.",
        variant: "destructive",
      });
      setNewsletters([]);
    }
  }, [toast]);

  // Fonction pour charger les données - SANS dépendances circulaires
  const loadData = useCallback(async () => {
    console.log('[useNewsletterAdmin] loadData called');
    setIsLoading(true);
    await Promise.all([fetchSubscribers(), fetchNewsletters()]);
    setIsLoading(false);
  }, [fetchSubscribers, fetchNewsletters]);

  // Charger les données AU MONTAGE uniquement
  useEffect(() => {
    console.log('[useNewsletterAdmin] Component mounted, loading initial data');
    loadData();
  }, []); // Dépendance vide pour ne s'exécuter qu'une fois

  const toggleSubscriberStatus = async (id: string, currentStatus: boolean) => {
    try {
      const currentSubscriber = subscribers.find(s => s.id === id);
      if (!currentSubscriber) return;

      // Optimistic update
      setSubscribers(subs =>
        subs.map(s =>
          s.id === id ? { ...s, is_active: !currentStatus } : s
        )
      );

      const result = await newsletterApi.toggleSubscriber(id, !currentStatus);
      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la mise à jour");
      }

      toast({
        title: "Succès",
        description: `Abonné ${!currentStatus ? "activé" : "désactivé"}`,
      });
    } catch (error: any) {
      console.error("Toggle subscriber error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      await fetchSubscribers();
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet abonné ?")) return;

    try {
      // Optimistic update
      setSubscribers(subs => subs.filter(s => s.id !== id));

      const result = await newsletterApi.deleteSubscriber(id);
      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la suppression");
      }

      toast({
        title: "Succès",
        description: "Abonné supprimé",
      });
    } catch (error: any) {
      console.error("Delete subscriber error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'abonné",
        variant: "destructive",
      });
      await fetchSubscribers();
    }
  };

  const saveNewsletter = async (title: string, subject: string, content: string, previewText?: string) => {
    try {
      const result = await newsletterApi.createNewsletter(title, subject, content, previewText);
      if (result.success) {
        toast({
          title: "Succès",
          description: "Newsletter créée",
        });
        await fetchNewsletters();
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Save newsletter error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la newsletter",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteNewsletter = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette newsletter ?")) return;

    try {
      setNewsletters(newsletters.filter(n => n.id !== id));
      toast({
        title: "Succès",
        description: "Newsletter supprimée",
      });
    } catch (error: any) {
      console.error("Delete newsletter error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la newsletter",
        variant: "destructive",
      });
      await fetchNewsletters();
    }
  };

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.first_name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const activeSubscribersCount = subscribers.filter((s) => s.is_active).length;

  return {
    subscribers: filteredSubscribers,
    newsletters,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeSubscribersCount,
    totalSubscribersCount: subscribers.length,
    toggleSubscriberStatus,
    deleteSubscriber,
    saveNewsletter,
    deleteNewsletter,
    fetchSubscribers,
    fetchNewsletters,
    refreshData: loadData,
  };
}
