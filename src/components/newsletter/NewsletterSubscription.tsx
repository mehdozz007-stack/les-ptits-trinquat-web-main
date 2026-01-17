import { useState } from "react";
import { useNewsletterSubscription } from "@/hooks/admin/useNewsletterSubscription";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function NewsletterSubscription() {
  const { isSubscribing, error, success, subscribe } =
    useNewsletterSubscription();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [agreedToConsent, setAgreedToConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToConsent) {
      return;
    }

    try {
      await subscribe(email, firstName);
      setEmail("");
      setFirstName("");
      setAgreedToConsent(false);
    } catch (err) {
      console.error("Error subscribing:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-2">
          Abonnez-vous à notre newsletter
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Recevez les actualités de l'école directement dans votre boîte mail.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || "Une erreur s'est produite"}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Merci ! Vous êtes maintenant abonné à notre newsletter.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={isSubscribing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Prénom (optionnel)
            </label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jean"
              disabled={isSubscribing}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="consent"
              checked={agreedToConsent}
              onCheckedChange={(checked) =>
                setAgreedToConsent(checked as boolean)
              }
              disabled={isSubscribing}
            />
            <label
              htmlFor="consent"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              J'accepte de recevoir des informations par email
            </label>
          </div>

          <Button
            type="submit"
            disabled={!agreedToConsent || isSubscribing || !email}
            className="w-full"
          >
            {isSubscribing ? "Inscription..." : "S'abonner"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Nous ne partagerons jamais votre email. Vous pouvez vous désabonner à
          tout moment.
        </p>
      </div>
    </div>
  );
}
