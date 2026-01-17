import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: "draft" | "sent";
  sent_at: string | null;
  recipients_count: number;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  first_name: string | null;
  email: string;
  consent: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UseNewsletterAdminReturn {
  newsletters: Newsletter[];
  subscribers: NewsletterSubscriber[];
  isLoading: boolean;
  error: Error | null;
  // Newsletter operations
  createNewsletter: (
    title: string,
    subject: string,
    content: string
  ) => Promise<Newsletter>;
  updateNewsletter: (
    id: string,
    title: string,
    subject: string,
    content: string
  ) => Promise<Newsletter>;
  deleteNewsletter: (id: string) => Promise<void>;
  fetchNewsletters: () => Promise<void>;
  sendNewsletter: (id: string) => Promise<void>;
  // Subscriber operations
  fetchSubscribers: () => Promise<void>;
  deleteSubscriber: (id: string) => Promise<void>;
  toggleSubscriberStatus: (id: string, isActive: boolean) => Promise<void>;
}

export function useNewsletterAdmin(): UseNewsletterAdminReturn {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNewsletters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("newsletters")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setNewsletters(data || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error("Error fetching newsletters:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSubscribers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setSubscribers(data || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error("Error fetching subscribers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewsletter = useCallback(
    async (title: string, subject: string, content: string) => {
      setError(null);
      try {
        const { data, error: createError } = await supabase
          .from("newsletters")
          .insert({
            title,
            subject,
            content,
            status: "draft",
          })
          .select()
          .single();

        if (createError) throw createError;

        const newNewsletter = data as Newsletter;
        setNewsletters((prev) => [newNewsletter, ...prev]);
        return newNewsletter;
      } catch (err) {
        const error = err as Error;
        setError(error);
        console.error("Error creating newsletter:", error);
        throw error;
      }
    },
    []
  );

  const updateNewsletter = useCallback(
    async (id: string, title: string, subject: string, content: string) => {
      setError(null);
      try {
        const { data, error: updateError } = await supabase
          .from("newsletters")
          .update({
            title,
            subject,
            content,
          })
          .eq("id", id)
          .select()
          .single();

        if (updateError) throw updateError;

        const updatedNewsletter = data as Newsletter;
        setNewsletters((prev) =>
          prev.map((n) => (n.id === id ? updatedNewsletter : n))
        );
        return updatedNewsletter;
      } catch (err) {
        const error = err as Error;
        setError(error);
        console.error("Error updating newsletter:", error);
        throw error;
      }
    },
    []
  );

  const deleteNewsletter = useCallback(async (id: string) => {
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from("newsletters")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setNewsletters((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error("Error deleting newsletter:", error);
      throw error;
    }
  }, []);

  const sendNewsletter = useCallback(async (id: string) => {
    setError(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("No session found");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-newsletter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
          body: JSON.stringify({ newsletterId: id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send newsletter");
      }

      // Mettre à jour l'état local
      const { data, error: fetchError } = await supabase
        .from("newsletters")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const updatedNewsletter = data as Newsletter;
      setNewsletters((prev) =>
        prev.map((n) => (n.id === id ? updatedNewsletter : n))
      );
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error("Error sending newsletter:", error);
      throw error;
    }
  }, []);

  const deleteSubscriber = useCallback(async (id: string) => {
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error("Error deleting subscriber:", error);
      throw error;
    }
  }, []);

  const toggleSubscriberStatus = useCallback(
    async (id: string, isActive: boolean) => {
      setError(null);
      try {
        const { data, error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({ is_active: isActive })
          .eq("id", id)
          .select()
          .single();

        if (updateError) throw updateError;

        const updatedSubscriber = data as NewsletterSubscriber;
        setSubscribers((prev) =>
          prev.map((s) => (s.id === id ? updatedSubscriber : s))
        );
      } catch (err) {
        const error = err as Error;
        setError(error);
        console.error("Error toggling subscriber status:", error);
        throw error;
      }
    },
    []
  );

  return {
    newsletters,
    subscribers,
    isLoading,
    error,
    createNewsletter,
    updateNewsletter,
    deleteNewsletter,
    fetchNewsletters,
    sendNewsletter,
    fetchSubscribers,
    deleteSubscriber,
    toggleSubscriberStatus,
  };
}
