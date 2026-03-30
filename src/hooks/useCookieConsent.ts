import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "cookie_consent";

interface CookiePreferences {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
}

export function useCookieConsent() {
    const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (stored) {
            try {
                setPreferences(JSON.parse(stored));
            } catch (error) {
                console.error("Erreur lecture cookies:", error);
            }
        }
        setIsLoaded(true);
    }, []);

    const canTrack = () => preferences?.analytics === true;
    const canMarket = () => preferences?.marketing === true;

    return {
        preferences,
        isLoaded,
        canTrack,
        canMarket,
    };
}
