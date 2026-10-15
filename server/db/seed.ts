import { db } from './database.js';
import { hashPassword } from '../utils/crypto.js';

export function seedInitialData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) {
    return; // Already seeded
  }

  console.log('[SEED] Seeding realistic data for Barishal Rokto...');

  // 1. Create Super Admin
  const { hash: superHash, salt: superSalt } = hashPassword('admin1234');
  const superAdminInsert = db.prepare(`
    INSERT INTO users (phone, role, password_hash, salt, name, status)
    VALUES ('01700000000', 'super_admin', ?, ?, 'প্রধান এডমিন (Super Admin)', 'active')
  `).run(superHash, superSalt);

  db.prepare(`
    INSERT INTO admins (user_id, permissions, level)
    VALUES (?, 'all', 'super_admin')
  `).run(superAdminInsert.lastInsertRowid);

  // 2. Create Regular Admin
  const { hash: adminHash, salt: adminSalt } = hashPassword('admin1234');
  const adminInsert = db.prepare(`
    INSERT INTO users (phone, role, password_hash, salt, name, status)
    VALUES ('01800000000', 'admin', ?, ?, 'মডারেটর এডমিন', 'active')
  `).run(adminHash, adminSalt);

  db.prepare(`
    INSERT INTO admins (user_id, permissions, level)
    VALUES (?, 'all', 'admin')
  `).run(adminInsert.lastInsertRowid);

  // 3. Seed Hospitals in Barishal Division
  const hospitalsData = [
    {
      name: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)',
      address: 'বান্দ রোড, বরিশাল সদর',
      district: 'বরিশাল',
      upazila: 'বরিশাল সদর',
      phone: '01711223344',
      emergency_contact: '01700112233',
    },
    {
      name: 'বরিশাল জেনারেল হাসপাতাল (সদর হাসপাতাল)',
      address: 'হাসপাতাল রোড, বরিশাল',
      district: 'বরিশাল',
      upazila: 'বরিশাল সদর',
      phone: '01722334455',
      emergency_contact: '01711334455',
    },
    {
      name: 'পটুয়াখালী জেলা সদর হাসপাতাল',
      address: 'কলেজ রোড, পটুয়াখালী',
      district: 'পটুয়াখালী',
      upazila: 'পটুয়াখালী সদর',
      phone: '01733445566',
      emergency_contact: '01722445566',
    },
    {
      name: 'ভোলা ২৫০ শয্যা জেনারেল হাসপাতাল',
      address: 'সদর রোড, ভোলা',
      district: 'ভোলা',
      upazila: 'ভোলা সদর',
      phone: '01744556677',
      emergency_contact: '01733556677',
    },
    {
      name: 'পিরোজপুর জেলা হাসপাতাল',
      address: 'হাসপাতাল রোড, পিরোজপুর',
      district: 'পিরোজপুর',
      upazila: 'পিরোজপুর সদর',
      phone: '01755667788',
      emergency_contact: '01744667788',
    },
    {
      name: 'বরগুনা জেলা সদর হাসপাতাল',
      address: 'থানা রোড, বরগুনা',
      district: 'বরগুনা',
      upazila: 'বরগুনা সদর',
      phone: '01766778899',
      emergency_contact: '01755778899',
    },
    {
      name: 'ঝালকাঠি জেলা সদর হাসপাতাল',
      address: 'মেইন রোড, ঝালকাঠি',
      district: 'ঝালকাঠি',
      upazila: 'ঝালকাঠি সদর',
      phone: '01777889900',
      emergency_contact: '01766889900',
    },
    {
      name: 'বাবুগঞ্জ উপজেলা স্বাস্থ্য কমপ্লেক্স',
      address: 'বাবুগঞ্জ বাজার, বরিশাল',
      district: 'বরিশাল',
      upazila: 'বাবুগঞ্জ',
      phone: '01788990011',
      emergency_contact: '01777990011',
    },
  ];

  for (const h of hospitalsData) {
    db.prepare(`
      INSERT INTO hospitals (name, address, district, upazila, phone, emergency_contact, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(h.name, h.address, h.district, h.upazila, h.phone, h.emergency_contact);
  }

  // 4. Seed Donors with different blood groups and upazilas
  const demoDonors = [
    {
      name: 'তানভীর আহমেদ',
      phone: '01711000101',
      blood_group: 'O+',
      gender: 'male',
      age: 26,
      district: 'বরিশাল',
      upazila: 'বরিশাল সদর',
      area: 'রূপাতলী',
      address: 'রূপাতলী হাউজিং',
      last_donation_date: '2026-06-15',
      total_donations: 8,
      is_available: 1,
      is_verified: 1,
    },
    {
      name: 'নুসরাত জাহান',
      phone: '01711000102',
      blood_group: 'A+',
      gender: 'female',
      age: 23,
      district: 'বরিশাল',
      upazila: 'বরিশাল সদর',
      area: 'নতুন বাজার',
      address: 'নতুন বাজার রোড',
      last_donation_date: '2026-07-20',
      total_donations: 4,
      is_available: 1,
      is_verified: 1,
    },
    {
      name: 'রাকিবুল হাসান',
      phone: '01711000103',
      blood_group: 'B+',
      gender: 'male',
      age: 29,
      district: 'পটুয়াখালী',
      upazila: 'পটুয়াখালী সদর',
      area: 'কলেজ রোড',
      address: 'সদর রোড',
      last_donation_date: '2026-05-10',
      total_donations: 12,
      is_available: 1,
      is_verified: 1,
    },
    {
      name: 'সাব্বির হোসেন',
      phone: '01711000104',
      blood_group: 'AB+',
      gender: 'male',
      age: 24,
      district: 'ভোলা',
      upazila: 'ভোলা সদর',
      area: 'নতুন বাজার',
      address: 'বাজার রোড',
      last_donation_date: '2026-08-01',
      total_donations: 5,
      is_available: 1,
      is_verified: 1,
    },
    {
      name: 'ফারজানা আক্তার',
      phone: '01711000105',
      blood_group: 'O-',
      gender: 'female',
      age: 27,
      district: 'পিরোজপুর',
      upazila: 'পিরোজপুর সদর',
      area: 'পৌরসভা রোড',
      address: 'স্টেডিয়াম রোড',
      last_donation_date: '2026-04-18',
      total_donations: 6,
      is_available: 1,
      is_verified: 1,
    },
    {
      name: 'মেহেদী হাসান',
      phone: '01711000106',
      blood_group: 'A-',
      gender: 'male',
      age: 25,
      district: 'বরগুনা',
      upazila: 'বরগুনা সদর',
      area: 'কলেজ রোড',
      address: 'সদর রোড',
      last_donation_date: '2026-03-12',
      total_donations: 7,
      is_available: 1,
      is_verified: 1,
    },
    {
      name: 'সাইফুল ইসলাম',
      phone: '01711000107',
      blood_group: 'B-',
      gender: 'male',
      age: 31,
      district: 'ঝালকাঠি',
      upazila: 'ঝালকাঠি সদর',
      area: 'পুরাতন বাজার',
      address: 'হাসপাতাল রোড',
      last_donation_date: '2026-07-05',
      total_donations: 9,
      is_available: 1,
      is_verified: 1,
    },
    {
      name: 'জাহিদুল ইসলাম',
      phone: '01711000108',
      blood_group: 'AB-',
      gender: 'male',
      age: 28,
      district: 'বরিশাল',
      upazila: 'বাবুগঞ্জ',
      area: 'রহমতপুর',
      address: 'কৃষি কলেজ মোড়',
      last_donation_date: '2026-08-14',
      total_donations: 3,
      is_available: 1,
      is_verified: 1,
    },
    {
      name: 'মারুফা বেগম',
      phone: '01711000109',
      blood_group: 'O+',
      gender: 'female',
      age: 22,
      district: 'বরিশাল',
      upazila: 'গৌরনদী',
      area: 'টর্কি বন্দর',
      address: 'গৌরনদী বাসস্ট্যান্ড',
      last_donation_date: null,
      total_donations: 0,
      is_available: 1,
      is_verified: 0,
    },
  ];

  const defaultPasswordHash = hashPassword('donor1234');

  for (const donor of demoDonors) {
    const userRes = db.prepare(`
      INSERT INTO users (phone, role, password_hash, salt, name, status)
      VALUES (?, 'donor', ?, ?, ?, 'active')
    `).run(donor.phone, defaultPasswordHash.hash, defaultPasswordHash.salt, donor.name);
    const uId = Number(userRes.lastInsertRowid);

    db.prepare(`
      INSERT INTO donors (
        user_id, blood_group, gender, age, district, upazila,
        area, address, last_donation_date, total_donations, is_available, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      uId,
      donor.blood_group,
      donor.gender,
      donor.age,
      donor.district,
      donor.upazila,
      donor.area,
      donor.address,
      donor.last_donation_date,
      donor.total_donations,
      donor.is_available,
      donor.is_verified
    );
  }

  // 5. Seed Blood Requests (Emergency and Regular)
  const demoRequests = [
    {
      patient_name: 'আব্দুর রহিম',
      blood_group: 'O+',
      units_needed: 2,
      hospital_name: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)',
      district: 'বরিশাল',
      upazila: 'বরিশাল সদর',
      location_details: 'সার্জারি ওয়ার্ড, বেড নং ১২',
      needed_date: 'আজকের মধ্যে',
      needed_time: 'জরুরি',
      contact_phone: '01719876543',
      emergency_level: 'critical',
      case_info: 'রোড এক্সিডেন্ট',
      additional_notes: 'রোগীর জরুরি অপারেশন। ২ ব্যাগ O+ রক্ত প্রয়োজন।',
      status: 'active',
    },
    {
      patient_name: 'রোকসানা পারভীন',
      blood_group: 'B+',
      units_needed: 1,
      hospital_name: 'পটুয়াখালী জেলা সদর হাসপাতাল',
      district: 'পটুয়াখালী',
      upazila: 'পটুয়াখালী সদর',
      location_details: 'গাইনি ওয়ার্ড, ৩য় তলা',
      needed_date: 'আগামীকাল সকাল ১০টা',
      needed_time: 'সকাল ১০:০০',
      contact_phone: '01712349876',
      emergency_level: 'urgent',
      case_info: 'সিজারিয়ান অপারেশন',
      additional_notes: 'রোগীর সিজারিয়ান ডেলিভারির জন্য ১ ব্যাগ রক্ত দরকার।',
      status: 'active',
    },
    {
      patient_name: 'ফারহান তাহমিদ',
      blood_group: 'A+',
      units_needed: 1,
      hospital_name: 'ভোলা ২৫০ শয্যা জেনারেল হাসপাতাল',
      district: 'ভোলা',
      upazila: 'ভোলা সদর',
      location_details: 'শিশু ওয়ার্ড',
      needed_date: 'আগামীকাল',
      needed_time: 'দুপুর ১২:০০',
      contact_phone: '01733441122',
      emergency_level: 'standard',
      case_info: 'থ্যালাসেমিয়া রোগী',
      additional_notes: 'নিয়মিত থ্যালাসেমিয়া রক্ত সঞ্চালন।',
      status: 'active',
    },
  ];

  for (const r of demoRequests) {
    db.prepare(`
      INSERT INTO blood_requests (
        patient_name, blood_group, units_needed, hospital_name, district, upazila,
        location_details, needed_date, needed_time, contact_phone, emergency_level,
        case_info, additional_notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      r.patient_name,
      r.blood_group,
      r.units_needed,
      r.hospital_name,
      r.district,
      r.upazila,
      r.location_details,
      r.needed_date,
      r.needed_time,
      r.contact_phone,
      r.emergency_level,
      r.case_info,
      r.additional_notes,
      r.status
    );
  }

  console.log('[SEED] Realistic Barishal Rokto seed data loaded successfully!');
}
