-- ============================================================
-- Migration 0020: Recréer les tables newsletter manquantes
-- Après le reset en 0012, il faut recréer newsletter_subscribers et newsletters
-- ============================================================

-- Créer la table newsletter_subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    first_name TEXT,
    consent INTEGER NOT NULL DEFAULT 0 CHECK (consent IN (0, 1)),
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    unsubscribed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);

-- Créer la table newsletters
CREATE TABLE IF NOT EXISTS newsletters (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'failed')),
    preview_text TEXT,
    html_template TEXT,
    sent_at TEXT,
    scheduled_at TEXT,
    sent_by TEXT,
    created_by TEXT,
    recipients_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON newsletters(created_at);

-- Créer la table newsletter_email_events
CREATE TABLE IF NOT EXISTS newsletter_email_events (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    newsletter_id TEXT NOT NULL,
    subscriber_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'opened', 'clicked', 'bounced', 'complained')),
    event_timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (newsletter_id) REFERENCES newsletters(id) ON DELETE CASCADE,
    FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email_events_newsletter_id ON newsletter_email_events(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_email_events_subscriber_id ON newsletter_email_events(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_email_events_event_type ON newsletter_email_events(event_type);
