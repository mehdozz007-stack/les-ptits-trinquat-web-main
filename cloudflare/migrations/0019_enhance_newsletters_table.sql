-- ============================================================
-- Migration 0019: Améliorer les tables newsletters
-- Ajouter colonnes pour preview_text, scheduled_at, templates, etc.
-- ============================================================

-- Ajouter les colonnes manquantes à newsletter_subscribers
ALTER TABLE newsletter_subscribers ADD COLUMN unsubscribed_at TEXT;
ALTER TABLE newsletter_subscribers ADD COLUMN updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'));

-- Ajouter les colonnes manquantes à newsletters  
ALTER TABLE newsletters ADD COLUMN preview_text TEXT;
ALTER TABLE newsletters ADD COLUMN html_template TEXT;
ALTER TABLE newsletters ADD COLUMN scheduled_at TEXT;
ALTER TABLE newsletters ADD COLUMN sent_by TEXT;
ALTER TABLE newsletters ADD COLUMN created_by TEXT;

-- Créer la table pour tracked email events
-- Drop first if exists (in case migration is re-run)
DROP TABLE IF EXISTS newsletter_email_events;

CREATE TABLE newsletter_email_events (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    newsletter_id TEXT NOT NULL,
    subscriber_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'opened', 'clicked', 'bounced', 'complained')),
    event_timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (newsletter_id) REFERENCES newsletters(id) ON DELETE CASCADE,
    FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers(id) ON DELETE CASCADE
);

CREATE INDEX idx_newsletter_email_events_newsletter_id ON newsletter_email_events(newsletter_id);
CREATE INDEX idx_newsletter_email_events_subscriber_id ON newsletter_email_events(subscriber_id);
CREATE INDEX idx_newsletter_email_events_event_type ON newsletter_email_events(event_type);
