import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les abonnés.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchNewsletters = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("newsletters")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNewsletters(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les newsletters.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchSubscribers(), fetchNewsletters()]);
    setIsLoading(false);
  }, [fetchSubscribers, fetchNewsletters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleSubscriberStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Statut modifié",
        description: `L'abonné a été ${!currentStatus ? "activé" : "désactivé"}.`,
      });

      await fetchSubscribers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut.",
        variant: "destructive",
      });
    }
  };

  const deleteSubscriber = async (id: string) => {
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Abonné supprimé",
        description: "L'abonné a été supprimé de la liste.",
      });

      await fetchSubscribers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'abonné.",
        variant: "destructive",
      });
    }
  };

  const saveNewsletter = async (newsletter: Omit<Newsletter, "id" | "created_at" | "updated_at" | "sent_at" | "recipients_count" | "status">) => {
    try {
      const { data, error } = await supabase
        .from("newsletters")
        .insert({
          title: newsletter.title,
          subject: newsletter.subject,
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
