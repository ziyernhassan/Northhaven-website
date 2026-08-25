-- D1 migration 0001 — leads table for the website demo-request form.
-- Apply once: Cloudflare dashboard → Storage & D1 → nh_leads → Console → paste → Run.

CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  business    TEXT    NOT NULL,
  phone       TEXT    NOT NULL,
  message     TEXT    NOT NULL DEFAULT '',
  ip          TEXT    NOT NULL DEFAULT '',
  user_agent  TEXT    NOT NULL DEFAULT '',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- backs the per-IP rate-limit query in functions/api/lead.js
CREATE INDEX IF NOT EXISTS idx_leads_ip_time ON leads (ip, created_at);
