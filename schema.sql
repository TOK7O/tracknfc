-- schema.sql
CREATE TABLE IF NOT EXISTS Analytics (
     id TEXT PRIMARY KEY,
     link_slug TEXT,
     timestamp TEXT,
     hashed_ip TEXT,
     user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_link_slug ON Analytics(link_slug);
CREATE INDEX IF NOT EXISTS idx_timestamp ON Analytics(timestamp);