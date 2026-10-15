-- =========================================================================
-- Barishal Blood - Cloudflare D1 Schema & Cloudflare R2 Binding
-- Database: barishal-Blood-d1
-- R2 Bucket: barishal-Blood-media
-- SQLite Dialect for Cloudflare D1 Serverless SQL
-- =========================================================================

-- 1. Cloudflare R2 Media Metadata in D1
CREATE TABLE IF NOT EXISTS r2_media_objects (
  id TEXT PRIMARY KEY,
  r2_bucket TEXT NOT NULL DEFAULT 'barishal-Blood-media',
  r2_key TEXT UNIQUE NOT NULL,
  public_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  user_id INTEGER,
  album_id TEXT,
  caption TEXT,
  entity_type TEXT NOT NULL DEFAULT 'post',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_r2_media_key ON r2_media_objects(r2_key);
CREATE INDEX IF NOT EXISTS idx_r2_media_user ON r2_media_objects(user_id);
CREATE INDEX IF NOT EXISTS idx_r2_media_album ON r2_media_objects(album_id);

-- 2. Cloudflare D1 Donation Albums
CREATE TABLE IF NOT EXISTS d1_donation_albums (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  caption TEXT,
  hospital_name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  donation_date TEXT NOT NULL,
  donation_number INTEGER DEFAULT 1,
  cover_r2_url TEXT NOT NULL,
  r2_photos_json TEXT NOT NULL DEFAULT '[]',
  privacy TEXT NOT NULL DEFAULT 'everyone',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_d1_albums_user ON d1_donation_albums(user_id);
CREATE INDEX IF NOT EXISTS idx_d1_albums_bg ON d1_donation_albums(blood_group);

-- 3. Cloudflare D1 Social Posts
CREATE TABLE IF NOT EXISTS d1_social_posts (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  user_blood_group TEXT,
  category TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'general',
  title TEXT,
  content TEXT NOT NULL,
  media_urls_json TEXT DEFAULT '[]',
  media_r2_keys_json TEXT DEFAULT '[]',
  donation_meta_json TEXT,
  emergency_meta_json TEXT,
  reactions_json TEXT DEFAULT '{"support":0,"lifesaver":0,"respect":0,"hero":0,"congratulations":0}',
  comments_json TEXT DEFAULT '[]',
  privacy TEXT NOT NULL DEFAULT 'everyone',
  priority INTEGER NOT NULL DEFAULT 7,
  is_verified_institution INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_d1_posts_cat ON d1_social_posts(category);
CREATE INDEX IF NOT EXISTS idx_d1_posts_user ON d1_social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_d1_posts_priority ON d1_social_posts(priority);

-- 4. Cloudflare D1 24-Hour Short Blood Stories
CREATE TABLE IF NOT EXISTS d1_blood_stories (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  user_badge TEXT,
  blood_group TEXT,
  story_type TEXT NOT NULL DEFAULT 'donation',
  media_url TEXT NOT NULL,
  r2_key TEXT,
  caption TEXT NOT NULL,
  location TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_d1_stories_exp ON d1_blood_stories(expires_at);

-- 5. Cloudflare D1 Chat Messages & Emergency Channels
CREATE TABLE IF NOT EXISTS d1_chat_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id INTEGER NOT NULL,
  sender_name TEXT NOT NULL,
  text TEXT NOT NULL,
  media_url TEXT,
  r2_key TEXT,
  is_emergency INTEGER NOT NULL DEFAULT 0,
  is_delivered INTEGER NOT NULL DEFAULT 1,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_d1_chat_conv ON d1_chat_messages(conversation_id);

-- 6. Cloudflare D1 Sync Ledger
CREATE TABLE IF NOT EXISTS d1_sync_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operation TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  payload TEXT,
  synced_at TEXT NOT NULL DEFAULT (datetime('now'))
);
