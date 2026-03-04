-- ============================================================
-- Migration 0014: Ajouter les tables rate_limits et newsletter_emails
-- ============================================================

-- TABLE RATE_LIMITS - Limite de débit
CREATE TABLE IF NOT EXISTS rate_limits (
    id TEXT PRIMARY KEY,
    ip_address TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    window_start TEXT NOT NULL,
    window_end TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    UNIQUE(ip_address, endpoint, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_address ON rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_endpoint ON rate_limits(endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_end ON rate_limits(window_end);

-- TABLE NEWSLETTER_EMAILS - Emails abonnés à la newsletter
CREATE TABLE IF NOT EXISTS newsletter_emails (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    subscribed INTEGER NOT NULL DEFAULT 1 CHECK (subscribed IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_emails_email ON newsletter_emails(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_emails_subscribed ON newsletter_emails(subscribed);
CREATE INDEX IF NOT EXISTS idx_newsletter_emails_created_at ON newsletter_emails(created_at);
