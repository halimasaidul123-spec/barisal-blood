import { Router } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAuth, requireAdmin, logAudit } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/hospitals
router.get('/', (req, res) => {
  try {
    const { district, upazila, search } = req.query;
    let whereClauses: string[] = [];
    const params: any[] = [];

    if (district && district !== 'all') {
      whereClauses.push('district = ?');
      params.push(district);
    }
    if (upazila && upazila !== 'all') {
      whereClauses.push('upazila = ?');
      params.push(upazila);
    }
    if (search) {
      whereClauses.push('(name LIKE ? OR address LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const hospitals = db.prepare(`
      SELECT * FROM hospitals
      ${whereSql}
      ORDER BY is_verified DESC, name ASC
    `).all(...params);

    return res.json({
      success: true,
      data: hospitals,
    });
  } catch (err: any) {
    console.error('[HOSPITALS] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'হাসপাতাল তালিকা লোড করা যায়নি',
    });
  }
});

// POST /api/v1/hospitals
router.post('/', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { name, address, district = 'বরিশাল', upazila, phone, emergency_contact } = req.body;
    if (!name || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: 'হাসপাতালের নাম, ঠিকানা ও ফোন নম্বর আবশ্যক',
      });
    }

    const isAdmin = req.user!.role === 'admin' || req.user!.role === 'super_admin';
    const isVerified = isAdmin ? 1 : 0;

    const result = db.prepare(`
      INSERT INTO hospitals (name, address, district, upazila, phone, emergency_contact, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      name.trim(),
      address.trim(),
      district,
      upazila || 'বরিশাল সদর',
      phone.trim(),
      emergency_contact ? emergency_contact.trim() : null,
      isVerified
    );

    logAudit(req.user!.id, 'CREATE_HOSPITAL', 'hospital', Number(result.lastInsertRowid), { name }, req.ip);

    return res.status(201).json({
      success: true,
      message: isVerified ? 'হাসপাতাল যুক্ত করা হয়েছে' : 'হাসপাতাল জমা দেওয়া হয়েছে (অনুমোদন সাপেক্ষে)',
      data: { id: result.lastInsertRowid },
    });
  } catch (err: any) {
    console.error('[HOSPITALS] Create error:', err);
    return res.status(500).json({
      success: false,
      message: 'হাসপাতাল যুক্ত করতে ব্যর্থ হয়েছে',
    });
  }
});

// PUT /api/v1/hospitals/:id/verify
router.put('/:id/verify', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = Number(req.params.id);
    const { is_verified = 1 } = req.body;
    db.prepare('UPDATE hospitals SET is_verified = ?, updated_at = datetime(\'now\') WHERE id = ?').run(
      is_verified ? 1 : 0,
      id
    );
    logAudit(req.user!.id, 'VERIFY_HOSPITAL', 'hospital', id, { is_verified }, req.ip);
    return res.json({
      success: true,
      message: 'হাসপাতাল যাচাই সম্পন্ন হয়েছে',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'ব্যর্থ হয়েছে',
    });
  }
});

// GET /api/v1/hospitals/stocks
router.get('/stocks', (req, res) => {
  try {
    const { hospital_id, blood_group } = req.query;
    let where: string[] = ['1=1'];
    const params: any[] = [];

    if (hospital_id) {
      where.push('s.hospital_id = ?');
      params.push(Number(hospital_id));
    }
    if (blood_group && blood_group !== 'all') {
      where.push('s.blood_group = ?');
      params.push(blood_group);
    }

    const stocks = db.prepare(`
      SELECT s.*, h.name as hospital_name, h.district, h.upazila, h.phone
      FROM blood_stocks s
      JOIN hospitals h ON s.hospital_id = h.id
      WHERE ${where.join(' AND ')}
      ORDER BY h.is_verified DESC, s.units ASC
    `).all(...params);

    return res.json({
      success: true,
      data: stocks,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'স্টক লোড ব্যর্থ' });
  }
});

// PUT /api/v1/hospitals/:id/stocks
router.put('/:id/stocks', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const hospitalId = Number(req.params.id);
    const { blood_group, units } = req.body;
    const numUnits = Number(units) || 0;
    const status = numUnits <= 1 ? 'critical' : numUnits <= 4 ? 'low' : 'available';

    db.prepare(`
      INSERT INTO blood_stocks (hospital_id, blood_group, units, status, last_updated)
      VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT(hospital_id, blood_group) DO UPDATE SET
        units = excluded.units,
        status = excluded.status,
        last_updated = datetime('now')
    `).run(hospitalId, blood_group, numUnits, status);

    logAudit(req.user!.id, 'UPDATE_BLOOD_STOCK', 'hospital', hospitalId, { blood_group, units: numUnits }, req.ip);

    return res.json({
      success: true,
      message: 'ব্লাড ব্যাংক স্টক আপডেট হয়েছে',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'আপডেট ব্যর্থ' });
  }
});

export default router;
