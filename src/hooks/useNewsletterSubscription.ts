import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface SubscribeData {
  email: string;
  firstName?: string;
  consent: boolean;
}

export function useNewsletterSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const subscribe = async (data: SubscribeData) => {
    if (!data.consent) {
      toast({
        title: "Consentement requis",
        description: "Veuillez accepter de recevoir la newsletter.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    setIsSuccess(false);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: data.email.toLowerCase().trim(),
          first_name: data.firstName?.trim() || null,
          consent: true,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Déjà inscrit(e) !",
            description: "Cette adresse email est déjà inscrite à notre newsletter.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return false;
      }

      setIsSuccess(true);
      toast({
        title: "Bienvenue dans la famille ! 💌",
        description: data.firstName 
          ? `Merci ${data.firstName}, vous recevrez bientôt de nos nouvelles !`
          : "Vous recevrez bientôt de nos nouvelles !",
      });
      return true;
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Oups !",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
  };

  return { subscribe, isLoading, isSuccess, reset };
}
