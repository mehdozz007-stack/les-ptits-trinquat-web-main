/**
 * EXEMPLES D'UTILISATION - Cookie Consent Hook
 */

import { useCookieConsent } from "@/hooks/useCookieConsent";
import { useEffect } from "react";

// ============================================================
// 1. EXEMPLE BASIQUE - Vérifier le consent
// ============================================================

export function AnalyticsComponent() {
    const { canTrack, isLoaded } = useCookieConsent();

    useEffect(() => {
        if (!isLoaded) return;

        if (canTrack()) {
            console.log("✅ Analytique activée");
        } else {
            console.log("❌ Analytique désactivée");
        }
    }, [isLoaded, canTrack]);

    return <div>Analytique </div>;
}

// ============================================================
// 2. EXEMPLE - Google Analytics Conditionnel
// ============================================================

export function GoogleAnalyticsConditional() {
    const { canTrack } = useCookieConsent();

    useEffect(() => {
        if (!canTrack()) return;

        const script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXX";
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(command: string, ...args: any[]) {
            window.dataLayer.push(arguments);
        }
        gtag("js", new Date());
        gtag("config", "G-XXXXX");
    }, [canTrack]);

    return null;
}

// ============================================================
// 3. EXEMPLE - Tracker un événement personnalisé
// ============================================================

export function TrackedButton() {
    const { canTrack } = useCookieConsent();

    const handleClick = () => {
        if (canTrack() && window.gtag) {
            window.gtag("event", "button_click", {
                button_id: "donate",
            });
        }
        console.log("Bouton cliqué");
    };

    return (
        <button onClick= { handleClick } >
        Cliquez - moi
        </button>
  );
}

// ============================================================
// 4. EXEMPLE - Contenu basé sur les préférences
// ============================================================

export function ConditionalContent() {
    const { preferences, isLoaded } = useCookieConsent();

    if (!isLoaded) return <div>Chargement...</div>;

    return (
        <div>
        { preferences?.analytics && (
            <p>✅ Analytique accepté </p>
      )
}
{
    !preferences?.marketing && (
        <p>❌ Marketing désactivé </p>
      )
}
</div>
  );
}
