import { Router } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest, requireAuth, requireAdmin, logAudit } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/reports
router.post('/', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { reported_type, reported_id, reason } = req.body;
    if (!reported_type || !reported_id || !reason) {
      return res.status(400).json({
        success: false,
        message: 'অভিযোগের ধরণ ও কারণ প্রদান করুন',
      });
    }

    const result = db.prepare(`
      INSERT INTO reports (reporter_id, reported_type, reported_id, reason, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).run(req.user!.id, reported_type, Number(reported_id), reason.trim());

    logAudit(req.user!.id, 'SUBMIT_REPORT', reported_type, Number(reported_id), { reason }, req.ip);

    return res.status(201).json({
      success: true,
      message: 'আপনার অভিযোগ এডমিন প্যানেলে পাঠানো হয়েছে',
      data: { id: result.lastInsertRowid },
    });
  } catch (err: any) {
    console.error('[REPORTS] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'অভিযোগ পাঠাতে ব্যর্থ হয়েছে',
    });
  }
});

// GET /api/v1/reports
router.get('/', requireAdmin, (req, res) => {
  try {
    const reports = db.prepare(`
      SELECT r.*, u.name as reporter_name, u.phone as reporter_phone
      FROM reports r
      LEFT JOIN users u ON r.reporter_id = u.id
      ORDER BY
        CASE r.status WHEN 'pending' THEN 1 ELSE 2 END ASC,
        r.created_at DESC
    `).all();

    return res.json({
      success: true,
      data: reports,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'লোড ব্যর্থ',
    });
  }
});

// PUT /api/v1/reports/:id/status
router.put('/:id/status', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = Number(req.params.id);
    const { status, admin_notes } = req.body;
    db.prepare(`
      UPDATE reports
      SET status = ?, admin_notes = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(status, admin_notes || null, id);

    logAudit(req.user!.id, 'UPDATE_REPORT_STATUS', 'report', id, { status, admin_notes }, req.ip);

    return res.json({
      success: true,
      message: 'রিপোর্ট আপডেট সম্পন্ন',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'আপডেট ব্যর্থ',
    });
  }
});

export default router;
