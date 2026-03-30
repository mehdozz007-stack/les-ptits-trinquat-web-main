import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const COOKIE_CONSENT_KEY = "cookie_consent";

interface CookiePreferences {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
}

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
    });

    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!stored) {
            setIsVisible(true);
        } else {
            const parsed = JSON.parse(stored);
            setPreferences(parsed);
        }
    }, []);

    const handleAcceptAll = () => {
        const newPrefs = {
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newPrefs));
        setIsVisible(false);
    };

    const handleRejectAll = () => {
        const newPrefs = {
            essential: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newPrefs));
        setIsVisible(false);
    };

    const handleSave = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
        setIsVisible(false);
    };

    const togglePreference = (key: "analytics" | "marketing") => {
        setPreferences({ ...preferences, [key]: !preferences[key] });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-0 left-0 right-0 z-40 m-3 md:m-6"
                >
                    <div className="mx-auto max-w-3xl">
                        <div className="relative rounded-2xl border border-primary/40 bg-gradient-to-br from-background via-primary/30 to-background p-4 md:p-6 shadow-2xl backdrop-blur-md">
                            {/* Close Button */}
                            <button
                                onClick={handleRejectAll}
                                className="absolute right-3 top-3 p-1"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="pr-10 md:pr-0">
                                {/* Header */}
                                <h3 className="text-lg font-bold mb-2">🍪 Paramètres des cookies</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Nous utilisons des cookies pour améliorer votre expérience.
                                    Vous pouvez personnaliser vos préférences ci-dessous.
                                </p>

                                {/* Details */}
                                <AnimatePresence>
                                    {showDetails && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-4 space-y-3 border-t border-primary/10 pt-4"
                                        >
                                            <div className="flex items-start gap-3">
                                                <Checkbox id="essential" checked={true} disabled className="mt-1" />
                                                <div className="flex-1">
                                                    <label className="text-sm font-semibold">Cookies essentiels (Obligatoire)</label>
                                                    <p className="text-xs text-muted-foreground mt-1">Nécessaires au fonctionnement du site</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id="analytics"
                                                    checked={preferences.analytics}
                                                    onCheckedChange={() => togglePreference("analytics")}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    <label className="text-sm font-semibold">Cookies analytiques</label>
                                                    <p className="text-xs text-muted-foreground mt-1">Nous aident à améliorer le site</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id="marketing"
                                                    checked={preferences.marketing}
                                                    onCheckedChange={() => togglePreference("marketing")}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    <label className="text-sm font-semibold">Cookies marketing</label>
                                                    <p className="text-xs text-muted-foreground mt-1">Pour du contenu personnalisé</p>
                                                </div>
                                            </div>

                                            <div className="text-xs text-muted-foreground border-t border-primary/10 pt-3 mt-3">
                                                Voir notre{" "}
                                                <a href="/documents/confidentialite.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                    politique de confidentialité
                                                </a>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Toggle Details */}
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary"
                                >
                                    <span>{showDetails ? "Masquer" : "Personnaliser"}</span>
                                    <motion.div animate={{ rotate: showDetails ? 180 : 0 }}>
                                        <ChevronDown className="h-4 w-4" />
                                    </motion.div>
                                </button>

                                {/* Buttons */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Button variant="outline" onClick={handleRejectAll} className="text-sm">
                                        Tout rejeter
                                    </Button>

                                    {showDetails && (
                                        <Button variant="outline" onClick={handleSave} className="text-sm">
                                            Enregistrer
                                        </Button>
                                    )}

                                    <Button
                                        onClick={handleAcceptAll}
                                        className={`text-sm text-white bg-gradient-to-r from-primary to-secondary ${showDetails ? "" : "md:col-span-2"
                                            }`}
                                    >
                                        Tout accepter
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
