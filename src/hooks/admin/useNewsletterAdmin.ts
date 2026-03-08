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
      const result = await newsletterApi.getSubscribers();
      if (result.success && result.data) {
        setSubscribers(result.data);
      } else {
        throw new Error(result.error || "Erreur lors du chargement");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les abonnés.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    await fetchSubscribers();
    setIsLoading(false);
  }, [fetchSubscribers]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleSubscriberStatus = async (id: string, currentStatus: boolean) => {
    try {
      const currentSubscriber = subscribers.find(s => s.id === id);
      if (!currentSubscriber) return;

      setSubscribers(subs =>
        subs.map(s =>
          s.id === id ? { ...s, is_active: !currentStatus } : s
        )
      );

      toast({
        title: "Succès",
        description: `Abonné ${!currentStatus ? "activé" : "désactivé"}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      await fetchSubscribers();
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet abonné ?")) return;

    try {
      setSubscribers(subs => subs.filter(s => s.id !== id));

      toast({
        title: "Succès",
        description: "Abonné supprimé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'abonné",
        variant: "destructive",
      });
      await fetchSubscribers();
    }
  };

  const sendNewsletter = async (newsletterId: string) => {
    try {
      const result = await newsletterApi.sendNewsletter(newsletterId);
      if (result.success) {
        toast({
          title: "Succès",
          description: "Newsletter envoyée avec succès",
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la newsletter",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    subscribers,
    newsletters,
    isLoading,
    searchQuery,
    setSearchQuery,
    fetchSubscribers,
    toggleSubscriberStatus,
    deleteSubscriber,
    sendNewsletter,
  };
}
