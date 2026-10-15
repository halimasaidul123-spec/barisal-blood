-- =========================================================================
-- Barishal Rokto - Cloudflare D1 Initial Seed Data
-- =========================================================================

-- 1. Initial Admin Users
-- Password for all seed users is 'admin1234'
INSERT OR IGNORE INTO users (id, phone, username, role, password_hash, salt, name, status)
VALUES 
(1, '01700000000', 'superadmin', 'super_admin', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt_barishal_admin', 'প্রধান এডমিন (Super Admin)', 'active'),
(2, '01800000000', 'admin', 'admin', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt_barishal_admin', 'মডারেটর এডমিন', 'active');

INSERT OR IGNORE INTO admins (user_id, permissions, level)
VALUES 
(1, 'all', 'super_admin'),
(2, 'all', 'admin');

-- 2. Barishal Division Hospitals
INSERT OR IGNORE INTO hospitals (id, name, address, district, upazila, phone, emergency_contact, is_verified)
VALUES
(1, 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)', 'বান্দ রোড, বরিশাল সদর', 'বরিশাল', 'বরিশাল সদর', '01711223344', '01700112233', 1),
(2, 'বরিশাল জেনারেল হাসপাতাল (সদর হাসপাতাল)', 'হাসপাতাল রোড, বরিশাল', 'বরিশাল', 'বরিশাল সদর', '01722334455', '01711334455', 1),
(3, 'পটুয়াখালী জেলা সদর হাসপাতাল', 'কলেজ রোড, পটুয়াখালী', 'পটুয়াখালী', 'পটুয়াখালী সদর', '01733445566', '01722445566', 1),
(4, 'ভোলা ২৫০ শয্যা জেনারেল হাসপাতাল', 'সদর রোড, ভোলা', 'ভোলা', 'ভোলা সদর', '01744556677', '01733556677', 1),
(5, 'পিরোজপুর জেলা হাসপাতাল', 'হাসপাতাল রোড, পিরোজপুর', 'পিরোজপুর', 'পিরোজপুর সদর', '01755667788', '01744667788', 1),
(6, 'বরগুনা জেলা সদর হাসপাতাল', 'থানা রোড, বরগুনা', 'বরগুনা', 'বরগুনা সদর', '01766778899', '01755778899', 1),
(7, 'ঝালকাঠি জেলা সদর হাসপাতাল', 'মেইন রোড, ঝালকাঠি', 'ঝালকাঠি', 'ঝালকাঠি সদর', '01777889900', '01766889900', 1),
(8, 'বাবুগঞ্জ উপজেলা স্বাস্থ্য কমপ্লেক্স', 'বাবুগঞ্জ বাজার, বরিশাল', 'বরিশাল', 'বাবুগঞ্জ', '01788990011', '01777990011', 1);

-- 3. Hospital Blood Stocks
INSERT OR IGNORE INTO blood_stocks (hospital_id, blood_group, units, status) VALUES
(1, 'A+', 8, 'available'),
(1, 'A-', 2, 'low'),
(1, 'B+', 12, 'available'),
(1, 'B-', 1, 'critical'),
(1, 'AB+', 5, 'available'),
(1, 'AB-', 1, 'critical'),
(1, 'O+', 15, 'available'),
(1, 'O-', 2, 'low'),
(2, 'A+', 5, 'available'),
(2, 'B+', 6, 'available'),
(2, 'O+', 7, 'available'),
(2, 'AB+', 3, 'low');

-- 4. Sample Donors in Barishal
INSERT OR IGNORE INTO users (id, phone, role, password_hash, salt, name, status)
VALUES
(3, '01711112233', 'donor', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt_barishal_admin', 'তানভীর আহমেদ', 'active'),
(4, '01722223344', 'donor', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt_barishal_admin', 'সাদিয়া রহমান', 'active'),
(5, '01733334455', 'donor', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt_barishal_admin', 'মাহমুদুল হাসান', 'active'),
(6, '01744445566', 'donor', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt_barishal_admin', 'ফাতেমা আক্তার', 'active'),
(7, '01755556677', 'donor', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt_barishal_admin', 'রাকিবুল ইসলাম', 'active');

INSERT OR IGNORE INTO donors (id, user_id, blood_group, gender, age, district, upazila, area, address, last_donation_date, total_donations, is_available, is_verified)
VALUES
(1, 3, 'O+', 'male', 27, 'বরিশাল', 'বরিশাল সদর', 'নতুন বাজার', 'সদর রোড, বরিশাল', '2025-11-10', 5, 1, 1),
(2, 4, 'A+', 'female', 24, 'বরিশাল', 'বরিশাল সদর', 'রূপাতলী', 'রূপাতলী হাউজিং, বরিশাল', '2025-10-15', 3, 1, 1),
(3, 5, 'B+', 'male', 31, 'বরিশাল', 'বাবুগঞ্জ', 'মীরগঞ্জ', 'বাবুগঞ্জ বাজার', '2025-12-01', 8, 1, 1),
(4, 6, 'AB+', 'female', 22, 'বরিশাল', 'উজিরপুর', 'ধামুরা', 'উজিরপুর বাজার', '2025-09-20', 2, 1, 1),
(5, 7, 'O-', 'male', 29, 'পটুয়াখালী', 'পটুয়াখালী সদর', 'নিউ মার্কেট', 'পটুয়াখালী কলেজ রোড', '2025-08-14', 4, 1, 1);

-- 5. Active Emergency Blood Requests
INSERT OR IGNORE INTO blood_requests (id, user_id, patient_name, blood_group, units_needed, hospital_name, district, upazila, location_details, needed_date, needed_time, contact_phone, emergency_level, case_info, status)
VALUES
(1, 1, 'রহিমা খাতুন', 'O+', 2, 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)', 'বরিশাল', 'বরিশাল সদর', '৩য় তলা, গাইনী ওয়ার্ড', date('now', '+1 day'), '১০:০০ AM', '01712345678', 'urgent', 'সিজারিয়ান অপারেশন', 'active'),
(2, 1, 'আব্দুল করিম', 'B+', 1, 'বরিশাল জেনারেল হাসপাতাল (সদর হাসপাতাল)', 'বরিশাল', 'বরিশাল সদর', 'জরুরি বিভাগ', date('now'), '০২:০০ PM', '01898765432', 'emergency', 'সড়ক দুর্ঘটনাজনিত রক্তক্ষরণ', 'active');

-- 6. System Configuration
INSERT OR IGNORE INTO admin_system_config (key, value, updated_at) VALUES
('first_setup_completed', '1', datetime('now')),
('emergency_broadcast_active', '0', datetime('now')),
('emergency_broadcast_message', '', datetime('now')),
('emergency_broadcast_level', 'critical', datetime('now')),
('maintenance_mode', '0', datetime('now'));

-- 7. Cloudflare D1 Instances Configuration
INSERT OR IGNORE INTO d1_database_instances (
  id, name, database_id, account_id, api_token, binding_name, region,
  environment, replication_mode, is_primary, status, read_latency_ms,
  write_latency_ms, storage_bytes, tables_count, last_ping_at
) VALUES 
(
  'd1-prod-primary',
  'barishal-rokto-prod-d1',
  '9f1a23b4-56c7-88d9-0e1f-23456789abcd',
  'c7a8b9e0123456789abcdef012345678',
  'cf_d1_sec_99a812bfa4c58e19d70034a1',
  'DB',
  'APAC / Singapore (SIN - Edge)',
  'production',
  'primary',
  1,
  'active',
  1.8,
  4.2,
  3480000,
  23,
  datetime('now')
),
(
  'd1-edge-replica-apac',
  'barishal-rokto-edge-replica',
  'b4c89012-34ef-56a7-8901-cdef01234567',
  'c7a8b9e0123456789abcdef012345678',
  'cf_d1_sec_99a812bfa4c58e19d70034a1',
  'DB_REPLICA',
  'South Asia / Dhaka (DAC - Local Edge)',
  'production',
  'read_replica',
  0,
  'active',
  0.9,
  5.1,
  3480000,
  23,
  datetime('now')
);
