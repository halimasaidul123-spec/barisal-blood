-- =========================================================================
-- Barishal Rokto - Cloudflare D1 Complete Database Schema
-- Dialect: SQLite / Cloudflare D1
-- Target: Cloudflare D1 Serverless Database
-- =========================================================================

-- 1. Schema Migrations Ledger
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'donor',
  password_hash TEXT,
  salt TEXT,
  name TEXT NOT NULL,
  avatar TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. Donors Profile Table
CREATE TABLE IF NOT EXISTS donors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  blood_group TEXT NOT NULL,
  gender TEXT NOT NULL,
  age INTEGER,
  dob TEXT,
  district TEXT NOT NULL DEFAULT 'বরিশাল',
  upazila TEXT NOT NULL,
  area TEXT,
  address TEXT,
  last_donation_date TEXT,
  total_donations INTEGER NOT NULL DEFAULT 0,
  is_available INTEGER NOT NULL DEFAULT 1,
  is_verified INTEGER NOT NULL DEFAULT 0,
  verification_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_district_upazila ON donors(district, upazila);
CREATE INDEX IF NOT EXISTS idx_donors_is_available ON donors(is_available);
CREATE INDEX IF NOT EXISTS idx_donors_is_verified ON donors(is_verified);

-- 4. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  permissions TEXT NOT NULL DEFAULT 'all',
  level TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Sessions Table (Auth Bearer Tokens)
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- 6. OTP Codes Table
CREATE TABLE IF NOT EXISTS otp_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'login',
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone);

-- 7. Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL DEFAULT 'বরিশাল',
  upazila TEXT NOT NULL,
  phone TEXT NOT NULL,
  emergency_contact TEXT,
  is_verified INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hospitals_district ON hospitals(district, upazila);

-- 8. Hospital Blood Stock Inventory Table
CREATE TABLE IF NOT EXISTS blood_stocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL,
  blood_group TEXT NOT NULL,
  units INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available',
  last_updated TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(hospital_id, blood_group),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_blood_stocks_hospital ON blood_stocks(hospital_id);

-- 9. Blood Requests Table
CREATE TABLE IF NOT EXISTS blood_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  patient_name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  units_needed INTEGER NOT NULL DEFAULT 1,
  hospital_name TEXT NOT NULL,
  district TEXT NOT NULL DEFAULT 'বরিশাল',
  upazila TEXT NOT NULL,
  location_details TEXT,
  needed_date TEXT NOT NULL,
  needed_time TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  emergency_level TEXT NOT NULL DEFAULT 'urgent',
  case_info TEXT,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_blood_group ON blood_requests(blood_group);
CREATE INDEX IF NOT EXISTS idx_requests_district ON blood_requests(district, upazila);
CREATE INDEX IF NOT EXISTS idx_requests_emergency ON blood_requests(emergency_level);

-- 10. Request Responses Table
CREATE TABLE IF NOT EXISTS request_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  donor_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'accepted',
  donor_message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(request_id, donor_id),
  FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_responses_req ON request_responses(request_id);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  is_read INTEGER NOT NULL DEFAULT 0,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, is_read);

-- 12. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reporter_id INTEGER,
  reported_type TEXT NOT NULL,
  reported_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 13. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id INTEGER,
  details_json TEXT,
  ip TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(created_at);

-- 14. Admin System Config Table
CREATE TABLE IF NOT EXISTS admin_system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 15. User Warnings Table
CREATE TABLE IF NOT EXISTS user_warnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  admin_id INTEGER NOT NULL,
  warning_level TEXT NOT NULL DEFAULT 'moderate',
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  acknowledged INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 16. Blacklist Records Table
CREATE TABLE IF NOT EXISTS blacklist_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT,
  user_id INTEGER,
  reason TEXT NOT NULL,
  admin_id INTEGER,
  banned_at TEXT NOT NULL DEFAULT (datetime('now')),
  is_active INTEGER NOT NULL DEFAULT 1
);

-- 17. Cloudflare D1 Instances Management Table
CREATE TABLE IF NOT EXISTS d1_database_instances (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  database_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  api_token TEXT NOT NULL,
  binding_name TEXT NOT NULL DEFAULT 'DB',
  region TEXT NOT NULL DEFAULT 'APAC (Singapore)',
  environment TEXT NOT NULL DEFAULT 'production',
  replication_mode TEXT NOT NULL DEFAULT 'primary',
  is_primary INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  read_latency_ms REAL NOT NULL DEFAULT 1.8,
  write_latency_ms REAL NOT NULL DEFAULT 4.2,
  storage_bytes INTEGER NOT NULL DEFAULT 3480000,
  tables_count INTEGER NOT NULL DEFAULT 18,
  last_ping_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_synced_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 18. Cloudflare R2 Media Objects in D1
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

-- 19. Cloudflare D1 Donation Albums
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

-- 20. Cloudflare D1 Social Posts
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

-- 21. Cloudflare D1 24-Hour Short Blood Stories
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

-- 22. Cloudflare D1 Chat Messages & Emergency Channels
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

-- 23. Cloudflare D1 Sync Ledger
CREATE TABLE IF NOT EXISTS d1_sync_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operation TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  payload TEXT,
  synced_at TEXT NOT NULL DEFAULT (datetime('now'))
);
