import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface UseNewsletterSubscriptionReturn {
  isSubscribing: boolean;
  error: Error | null;
  success: boolean;
  subscribe: (email: string, firstName?: string) => Promise<void>;
}

export function useNewsletterSubscription(): UseNewsletterSubscriptionReturn {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = useCallback(async (email: string, firstName?: string) => {
    setIsSubscribing(true);
    setError(null);
    setSuccess(false);

    try {
      // Vérifier si l'email existe déjà
      const { data: existing, error: checkError } = await supabase
        .from("newsletter_subscribers")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existing) {
        // Email déjà abonné, activer si désactivé
        if (!existing.is_active) {
          const { error: updateError } = await supabase
            .from("newsletter_subscribers")
            .update({ is_active: true })
            .eq("id", existing.id);

          if (updateError) throw updateError;
        }
      } else {
        // Créer un nouvel abonné
        const { error: insertError } = await supabase
          .from("newsletter_subscribers")
          .insert({
            email,
            first_name: firstName || null,
            consent: true,
            is_active: true,
          });

        if (insertError) throw insertError;
      }

      setSuccess(true);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error("Error subscribing to newsletter:", error);
      throw error;
    } finally {
      setIsSubscribing(false);
    }
  }, []);

  return {
    isSubscribing,
    error,
    success,
    subscribe,
  };
}
