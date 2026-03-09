/**
 * Hook pour tracker les événements personnalisés avec Umami
 * Usage: const { trackEvent } = useUmamiEvents();
 *        trackEvent('newsletter_subscription', { success: true, firstName: 'Jean' });
 */

export function useUmamiEvents() {
    const trackEvent = (eventName: string, data?: Record<string, any>) => {
        try {
            // Umami expose une fonction globale `umami` sur window
            if (typeof window !== 'undefined' && (window as any).umami) {
                (window as any).umami.track(eventName, data);
                console.log(`[Umami] Event tracked: ${eventName}`, data);
            }
        } catch (error) {
            console.error(`[Umami] Failed to track event: ${eventName}`, error);
        }
    };

    return { trackEvent };
}

/**
 * Événements à tracker:
 * 
 * 1. Newsletter
 *    - newsletter_subscription_attempt: { success: boolean, email?: string }
 *    - newsletter_subscription_success: { firstName?: string }
 * 
 * 2. Tombola
 *    - tombola_participant_registration: { name: string }
 *    - tombola_lot_proposed: { name: string, emoji: string }
 *    - tombola_lot_reserved: { lotName: string, participantName: string }
 *    - tombola_lot_contact_clicked: { contactType: 'owner' | 'reserver' }
 *    - tombola_lot_delivered: { lotName: string }
 *    - tombola_lot_cancelled: { reason: string }
 * 
 * 3. Réservations
 *    - event_reservation_clicked: { eventName: string, eventType: string }
 * 
 * 4. Dons / Actions
 *    - donation_link_clicked: { eventName: string }
 *    - document_downloaded: { documentName: string }
 */
