import { Router } from 'express';
import { db } from '../db/database.js';
import {
  hashPassword,
  verifyPassword,
  generateOTP,
  hashOTP,
  verifyOTP,
  generateSessionToken,
} from '../utils/crypto.js';
import { smsService } from '../services/smsService.js';
import { otpRateLimiter, loginRateLimiter } from '../middleware/rateLimiter.js';
import { AuthenticatedRequest, requireAuth, logAudit } from '../middleware/auth.js';

const router = Router();

function isValidBDPhone(phone: string): boolean {
  return /^01[3-9]\d{8}$/.test(phone.trim());
}

// 1. Send OTP
router.post('/send-otp', otpRateLimiter, async (req, res) => {
  try {
    const { phone, purpose = 'login' } = req.body;
    if (!phone || !isValidBDPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)',
      });
    }

    const cleanPhone = phone.trim();
    const otp = generateOTP();
    const { hash, salt } = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    db.prepare('DELETE FROM otp_codes WHERE phone = ? AND verified = 0').run(cleanPhone);

    db.prepare(`
      INSERT INTO otp_codes (phone, code_hash, salt, purpose, attempts, expires_at, verified)
      VALUES (?, ?, ?, ?, 0, ?, 0)
    `).run(cleanPhone, hash, salt, purpose, expiresAt);

    const smsMessage = `বরিশাল রক্ত ওয়ান-টাইম ওটিপি কোড: ${otp}`;
    await smsService.sendSMS(cleanPhone, smsMessage);

    const isDev = process.env.NODE_ENV !== 'production';

    return res.json({
      success: true,
      message: `${cleanPhone} নম্বরে ৬ ডিজিটের ওটিপি পাঠানো হয়েছে`,
      ...(isDev ? { devDemoOtp: otp } : {}),
    });
  } catch (err: any) {
    console.error('[AUTH] Send OTP error:', err);
    return res.status(500).json({
      success: false,
      message: 'সার্ভার ত্রুটি, পুনরায় চেষ্টা করুন',
    });
  }
});

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'মোবাইল নম্বর ও ওটিপি আবশ্যক',
      });
    }

    const cleanPhone = phone.trim();
    const record = db.prepare(`
      SELECT * FROM otp_codes
      WHERE phone = ? AND verified = 0 AND datetime(expires_at) > datetime('now')
      ORDER BY id DESC LIMIT 1
    `).get(cleanPhone) as any;

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'মেয়াদোত্তীর্ণ বা ভুল ওটিপি',
      });
    }

    if (record.attempts >= 5) {
      db.prepare('DELETE FROM otp_codes WHERE id = ?').run(record.id);
      return res.status(429).json({
        success: false,
        message: 'অতিরিক্ত ভুল প্রচেষ্টা। নতুন ওটিপি পাঠান।',
      });
    }

    const isValid = verifyOTP(otp.trim(), record.code_hash, record.salt);
    if (!isValid) {
      db.prepare('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?').run(record.id);
      return res.status(400).json({
        success: false,
        message: 'ভুল ওটিপি কোড। পুনরায় চেষ্টা করুন।',
      });
    }

    db.prepare('UPDATE otp_codes SET verified = 1 WHERE id = ?').run(record.id);

    return res.json({
      success: true,
      message: 'ওটিপি যাচাই সফল হয়েছে',
    });
  } catch (err: any) {
    console.error('[AUTH] Verify OTP error:', err);
    return res.status(500).json({
      success: false,
      message: 'সার্ভার ত্রুটি',
    });
  }
});

// 3. Register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      phone,
      password,
      role = 'donor',
      blood_group,
      gender = 'male',
      age,
      dob,
      district = 'বরিশাল',
      upazila,
      area,
      address,
      last_donation_date,
      total_donations = 0,
      is_available = 1,
      otp,
    } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'নাম, মোবাইল নম্বর ও পাসওয়ার্ড আবশ্যক',
      });
    }

    if (!isValidBDPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'সঠিক মোবাইল নম্বর দিন (যেমন: 01712345678)',
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে',
      });
    }

    const cleanPhone = phone.trim();
    const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(cleanPhone);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'এই মোবাইল নম্বরে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে',
      });
    }

    if (otp) {
      const otpRecord = db.prepare(`
        SELECT * FROM otp_codes
        WHERE phone = ? AND verified = 1
        ORDER BY id DESC LIMIT 1
      `).get(cleanPhone) as any;

      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: 'মোবাইল নম্বর যাচাই (OTP) সম্পন্ন হয়নি',
        });
      }
    }

    const { hash, salt } = hashPassword(password);
    const userInsert = db.prepare(`
      INSERT INTO users (phone, role, password_hash, salt, name, status)
      VALUES (?, ?, ?, ?, ?, 'active')
    `).run(cleanPhone, role, hash, salt, name.trim());

    const userId = Number(userInsert.lastInsertRowid);

    if (role === 'donor' || blood_group) {
      db.prepare(`
        INSERT INTO donors (
          user_id, blood_group, gender, age, dob, district, upazila,
          area, address, last_donation_date, total_donations, is_available, is_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `).run(
        userId,
        blood_group || 'O+',
        gender,
        age ? Number(age) : null,
        dob || null,
        district || 'বরিশাল',
        upazila || 'বরিশাল সদর',
        area || null,
        address || null,
        last_donation_date || null,
        total_donations ? Number(total_donations) : 0,
        is_available ? 1 : 0
      );
    }

    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, 'স্বাগতম!', 'বরিশাল রক্ত প্ল্যাটফর্মে আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।', 'system')
    `).run(userId);

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare(`
      INSERT INTO sessions (token, user_id, expires_at)
      VALUES (?, ?, ?)
    `).run(sessionToken, userId, expiresAt);

    logAudit(userId, 'USER_REGISTERED', 'user', userId, { phone: cleanPhone, role }, req.ip);

    const fullUser = db.prepare(`
      SELECT u.id, u.phone, u.name, u.role, u.status,
             d.id as donor_id, d.blood_group, d.district, d.upazila, d.is_available, d.is_verified, d.total_donations
      FROM users u
      LEFT JOIN donors d ON d.user_id = u.id
      WHERE u.id = ?
    `).get(userId);

    return res.status(201).json({
      success: true,
      message: 'রেজিস্ট্রেশন সফল হয়েছে',
      data: {
        token: sessionToken,
        user: fullUser,
      },
    });
  } catch (err: any) {
    console.error('[AUTH] Register error:', err);
    return res.status(500).json({
      success: false,
      message: 'রেজিস্ট্রেশনে ত্রুটি ঘটেছে',
    });
  }
});

// 4. Login
router.post('/login', loginRateLimiter, async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'মোবাইল নম্বর ও পাসওয়ার্ড আবশ্যক',
      });
    }

    const cleanPhone = phone.trim();
    const user = db.prepare(`
      SELECT u.*, d.id as donor_id, d.blood_group, d.district, d.upazila, d.is_available, d.is_verified, d.total_donations,
             a.level as admin_level, a.permissions as admin_permissions
      FROM users u
      LEFT JOIN donors d ON d.user_id = u.id
      LEFT JOIN admins a ON a.user_id = u.id
      WHERE u.phone = ?
    `).get(cleanPhone) as any;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ভুল মোবাইল নম্বর বা পাসওয়ার্ড',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'আপনার অ্যাকাউন্টটি স্থগিত করা হয়েছে। এডমিনের সাথে যোগাযোগ করুন।',
      });
    }

    const valid = verifyPassword(password, user.password_hash, user.salt);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'ভুল মোবাইল নম্বর বা পাসওয়ার্ড',
      });
    }

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare(`
      INSERT INTO sessions (token, user_id, expires_at)
      VALUES (?, ?, ?)
    `).run(sessionToken, user.id, expiresAt);

    logAudit(user.id, 'USER_LOGIN', 'user', user.id, null, req.ip);

    const safeUser = {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      donor_id: user.donor_id,
      blood_group: user.blood_group,
      district: user.district,
      upazila: user.upazila,
      is_available: user.is_available,
      is_verified: user.is_verified,
      total_donations: user.total_donations,
      admin_level: user.admin_level,
      admin_permissions: user.admin_permissions,
    };

    return res.json({
      success: true,
      message: 'লগইন সফল হয়েছে',
      data: {
        token: sessionToken,
        user: safeUser,
      },
    });
  } catch (err: any) {
    console.error('[AUTH] Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'সার্ভার ত্রুটি',
    });
  }
});

// Admin Setup Check
router.get('/admin-setup-status', (req, res) => {
  try {
    const row = db.prepare("SELECT value FROM admin_system_config WHERE key = 'first_setup_completed'").get() as { value: string } | undefined;
    const setupCompleted = row ? row.value === '1' : false;
    const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role IN ('admin', 'super_admin')").get() as { count: number };
    return res.json({
      success: true,
      data: {
        canCreateFirstAccount: !setupCompleted,
        setupCompleted,
        totalAdmins: adminCount.count,
      },
    });
  } catch (err: any) {
    return res.json({
      success: true,
      data: { canCreateFirstAccount: true, setupCompleted: false, totalAdmins: 0 },
    });
  }
});

// Admin First Setup
router.post('/admin-first-setup', async (req, res) => {
  try {
    const { username, password, name, phone } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'ইউজারনেম, পাসওয়ার্ড ও নাম আবশ্যক',
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে',
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে',
      });
    }

    const row = db.prepare("SELECT value FROM admin_system_config WHERE key = 'first_setup_completed'").get() as { value: string } | undefined;
    if (row && row.value === '1') {
      return res.status(403).json({
        success: false,
        message: 'প্রথমকালীন এডমিন সেটআপ ইতিমধ্যেই সম্পন্ন হয়েছে',
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanPhone = (phone && phone.trim()) ? phone.trim() : `017${Math.floor(10000000 + Math.random() * 90000000)}`;
    const cleanName = name.trim();

    const existingUserWithUsername = db.prepare("SELECT id FROM users WHERE LOWER(username) = ?").get(cleanUsername) as { id: number } | undefined;
    if (existingUserWithUsername) {
      return res.status(400).json({
        success: false,
        message: 'এই ইউজারনেম ইতিমধ্যে ব্যবহৃত হয়েছে',
      });
    }

    const { hash, salt } = hashPassword(password);
    const existingPhoneUser = db.prepare("SELECT id FROM users WHERE phone = ?").get(cleanPhone) as { id: number } | undefined;
    let userId: number;
    if (existingPhoneUser) {
      userId = existingPhoneUser.id;
      db.prepare(`
        UPDATE users 
        SET username = ?, name = ?, role = 'super_admin', password_hash = ?, salt = ?, status = 'active', updated_at = datetime('now')
        WHERE id = ?
      `).run(cleanUsername, cleanName, hash, salt, userId);
    } else {
      const userInsert = db.prepare(`
        INSERT INTO users (username, phone, role, password_hash, salt, name, status)
        VALUES (?, ?, 'super_admin', ?, ?, ?, 'active')
      `).run(cleanUsername, cleanPhone, hash, salt, cleanName);
      userId = Number(userInsert.lastInsertRowid);
    }

    db.prepare(`
      INSERT INTO admins (user_id, permissions, level)
      VALUES (?, 'all', 'super_admin')
      ON CONFLICT(user_id) DO UPDATE SET permissions = 'all', level = 'super_admin'
    `).run(userId);

    db.prepare("INSERT OR REPLACE INTO admin_system_config (key, value, updated_at) VALUES ('first_setup_completed', '1', datetime('now'))").run();

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(sessionToken, userId, expiresAt);

    logAudit(userId, 'FIRST_ADMIN_SETUP', 'user', userId, { username: cleanUsername, name: cleanName }, req.ip);

    const safeUser = {
      id: userId,
      username: cleanUsername,
      phone: cleanPhone,
      name: cleanName,
      role: 'super_admin',
      status: 'active',
      admin_level: 'super_admin',
      admin_permissions: 'all',
    };

    return res.status(201).json({
      success: true,
      message: 'সুপার এডমিন অ্যাকাউন্ট তৈরি ও লগইন সফল হয়েছে',
      data: {
        token: sessionToken,
        user: safeUser,
      },
    });
  } catch (err: any) {
    console.error('[AUTH] Admin first setup error:', err);
    return res.status(500).json({
      success: false,
      message: 'সার্ভার ত্রুটি',
    });
  }
});

// Admin Login
router.post('/admin-login', loginRateLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'ইউজারনেম ও পাসওয়ার্ড আবশ্যক',
      });
    }

    const identifier = username.trim().toLowerCase();
    const user = db.prepare(`
      SELECT u.*, a.level as admin_level, a.permissions as admin_permissions
      FROM users u
      LEFT JOIN admins a ON a.user_id = u.id
      WHERE (LOWER(u.username) = ? OR u.phone = ?) AND u.role IN ('admin', 'super_admin')
    `).get(identifier, identifier) as any;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ভুল এডমিন ইউজারনেম বা পাসওয়ার্ড',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'এই এডমিন অ্যাকাউন্টটি স্থগিত রয়েছে',
      });
    }

    const valid = verifyPassword(password, user.password_hash, user.salt);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'ভুল এডমিন ইউজারনেম বা পাসওয়ার্ড',
      });
    }

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(sessionToken, user.id, expiresAt);

    logAudit(user.id, 'ADMIN_LOGIN', 'user', user.id, { username: user.username }, req.ip);

    const safeUser = {
      id: user.id,
      username: user.username,
      phone: user.phone,
      name: user.name,
      role: user.role,
      status: user.status,
      admin_level: user.admin_level || (user.role === 'super_admin' ? 'super_admin' : 'admin'),
      admin_permissions: user.admin_permissions || 'all',
    };

    return res.json({
      success: true,
      message: 'এডমিন সেন্ট্রাল প্যানেলে স্বাগতম',
      data: {
        token: sessionToken,
        user: safeUser,
      },
    });
  } catch (err: any) {
    console.error('[AUTH] Admin login error:', err);
    return res.status(500).json({
      success: false,
      message: 'সার্ভার ত্রুটি',
    });
  }
});

// Current User Profile (me)
router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.prepare(`
    SELECT u.id, u.phone, u.name, u.role, u.status, u.avatar, u.created_at,
           d.id as donor_id, d.blood_group, d.gender, d.age, d.dob, d.district, d.upazila,
           d.area, d.address, d.last_donation_date, d.total_donations, d.is_available, d.is_verified,
           a.level as admin_level, a.permissions as admin_permissions
    FROM users u
    LEFT JOIN donors d ON d.user_id = u.id
    LEFT JOIN admins a ON a.user_id = u.id
    WHERE u.id = ?
  `).get(req.user!.id);

  return res.json({
    success: true,
    data: user,
  });
});

// Logout
router.post('/logout', requireAuth, (req: AuthenticatedRequest, res) => {
  if (req.sessionToken) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(req.sessionToken);
  }
  return res.json({
    success: true,
    message: 'লগআউট সম্পন্ন হয়েছে',
  });
});

export default router;
