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

  const sendNewsletter = async (subject: string, content: string, html?: string) => {
    try {
      const result = await newsletterApi.sendNewsletter(subject, content, html);
      if (result.success) {
        toast({
          title: "Succès",
          description: `Newsletter envoyée à ${result.data?.recipientCount || '?'} abonnés`,
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
          content: newsletter.content,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Brouillon enregistré",
        description: "Votre newsletter a été sauvegardée.",
      });

      await fetchNewsletters();
      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la newsletter.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateNewsletter = async (id: string, newsletter: Partial<Newsletter>) => {
    try {
      const { error } = await supabase
        .from("newsletters")
        .update(newsletter)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Newsletter mise à jour",
        description: "Les modifications ont été enregistrées.",
      });

      await fetchNewsletters();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la newsletter.",
        variant: "destructive",
      });
    }
  };

  const deleteNewsletter = async (id: string) => {
    try {
      const { error } = await supabase
        .from("newsletters")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Newsletter supprimée",
        description: "La newsletter a été supprimée.",
      });

      await fetchNewsletters();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la newsletter.",
        variant: "destructive",
      });
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
    updateNewsletter,
    deleteNewsletter,
    refreshData: loadData,
  };
}
