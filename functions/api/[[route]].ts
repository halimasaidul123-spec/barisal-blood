// Cloudflare Pages Functions Edge Handler for Cloudflare D1 & R2
// Automatically invoked by Cloudflare Pages on /api/* requests

interface Env {
  DB: any; // Cloudflare D1 Database Binding
  R2_BUCKET?: any; // Cloudflare R2 Storage Binding
  APP_NAME?: string;
  ENVIRONMENT?: string;
}

interface EventContext {
  request: Request;
  env: Env;
  params: {
    route: string | string[];
  };
  waitUntil: (promise: Promise<any>) => void;
  next: () => Promise<Response>;
}

function jsonResponse(data: any, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      ...headers,
    },
  });
}

export async function onRequest(context: EventContext): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  let pathname = url.pathname;
  // Normalize /api/... to /api/v1/... (e.g. /api/donors -> /api/v1/donors)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/v1/') && pathname !== '/api/health') {
    pathname = pathname.replace(/^\/api\//, '/api/v1/');
  }

  // 1. Health check
  if (pathname === '/api/health') {
    let d1Status = 'unbound';
    let d1Version = 'unknown';
    if (env.DB) {
      try {
        const query = await env.DB.prepare("SELECT sqlite_version() as version, count(*) as tables FROM sqlite_master WHERE type='table'").first();
        d1Status = 'connected';
        d1Version = query?.version || '3.45.0';
      } catch (err: any) {
        d1Status = `error: ${err.message}`;
      }
    }

    return jsonResponse({
      status: 'ok',
      app: env.APP_NAME || 'বরিশাল রক্ত (Barishal Rokto)',
      platform: 'Cloudflare Pages & Cloudflare D1',
      version: '1.0.0',
      d1_status: d1Status,
      d1_sqlite_version: d1Version,
      environment: env.ENVIRONMENT || 'production',
      edge_timestamp: new Date().toISOString(),
    });
  }

  // Provide status even if D1 is not bound yet to guide user during first setup
  if (pathname === '/api/v1/d1/status' && !env.DB) {
    return jsonResponse({
      success: true,
      data: {
        database_name: 'barishal-rokto-d1',
        region: 'apac-sgp (South East Asia / Dhaka)',
        version: 'Pending D1 Binding',
        tables_count: 0,
        total_records: 0,
        storage_size_kb: 0,
        read_latency_ms: 0,
        write_latency_ms: 0,
        sync_state: 'binding_needed',
        setup_instructions: 'Run `npx wrangler d1 create barishal-rokto-d1` and paste database_id into wrangler.jsonc or link it in Cloudflare Pages Dashboard.',
        r2_binding: {
          bucket: 'barishal-rokto-media',
          total_objects: 0,
          storage_mb: 0,
          egress_cost_usd: 0,
          cdn_cache_hit_rate: 100,
        },
      },
    });
  }

  // Ensure Cloudflare D1 database binding exists for data queries
  if (!env.DB) {
    return jsonResponse(
      {
        success: false,
        error: 'Cloudflare D1 Database binding "DB" is not bound yet. Please run `npx wrangler d1 create barishal-rokto-d1` and bind "DB" in Cloudflare Pages dashboard or wrangler.jsonc.',
      },
      503
    );
  }

  try {
    // 2. Auth Endpoints
    if (pathname === '/api/v1/auth/send-otp' && method === 'POST') {
      const body: any = await request.json().catch(() => ({}));
      const phone = body.phone?.trim();
      return jsonResponse({
        success: true,
        message: 'OTP পাঠানো হয়েছে (ডেমো কোড: 123456)',
        data: { devDemoOtp: '123456', phone },
      });
    }

    if (pathname === '/api/v1/auth/verify-otp' && method === 'POST') {
      const body: any = await request.json().catch(() => ({}));
      const isCorrect = body.otp === '123456';
      if (!isCorrect) {
        return jsonResponse({ success: false, error: 'ভুল ওটিপি কোড' }, 400);
      }
      return jsonResponse({ success: true, message: 'OTP যাচাই সম্পন্ন হয়েছে' });
    }

    if (pathname === '/api/v1/auth/login' && method === 'POST') {
      const body: any = await request.json().catch(() => ({}));
      const { phone, password } = body;
      const user = await env.DB.prepare(
        'SELECT * FROM users WHERE phone = ? LIMIT 1'
      ).bind(phone).first();

      if (!user) {
        return jsonResponse({ success: false, error: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি' }, 404);
      }

      const token = `cf_token_${user.id}_${Date.now()}`;
      await env.DB.prepare(
        'INSERT OR REPLACE INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime("now", "+30 days"))'
      ).bind(token, user.id).run();

      return jsonResponse({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            status: user.status,
          },
        },
      });
    }

    if (pathname === '/api/v1/auth/admin-login' && method === 'POST') {
      const body: any = await request.json().catch(() => ({}));
      const { username } = body;
      const user = await env.DB.prepare(
        'SELECT * FROM users WHERE username = ? OR phone = ? LIMIT 1'
      ).bind(username, username).first();

      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return jsonResponse({ success: false, error: 'এডমিন একাউন্ট পাওয়া যায়নি' }, 403);
      }

      const token = `cf_admin_token_${user.id}_${Date.now()}`;
      await env.DB.prepare(
        'INSERT OR REPLACE INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime("now", "+30 days"))'
      ).bind(token, user.id).run();

      return jsonResponse({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
          },
        },
      });
    }

    if (pathname === '/api/v1/auth/me' && method === 'GET') {
      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '');
      if (!token) {
        return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
      }
      const session = await env.DB.prepare(
        'SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime("now")'
      ).bind(token).first();

      if (!session) {
        return jsonResponse({ success: false, error: 'Invalid or expired session' }, 401);
      }

      const user = await env.DB.prepare(
        'SELECT id, phone, username, role, name, avatar, status FROM users WHERE id = ?'
      ).bind(session.user_id).first();

      const donor = await env.DB.prepare(
        'SELECT * FROM donors WHERE user_id = ?'
      ).bind(session.user_id).first();

      return jsonResponse({
        success: true,
        data: {
          ...user,
          donor_profile: donor || null,
        },
      });
    }

    // 3. Donors Endpoints
    if (pathname === '/api/v1/donors' && method === 'GET') {
      const bloodGroup = url.searchParams.get('blood_group');
      const district = url.searchParams.get('district');
      const upazila = url.searchParams.get('upazila');
      const query = url.searchParams.get('query');

      let sql = `
        SELECT 
          d.id, d.user_id, d.blood_group, d.gender, d.age, d.district, d.upazila, 
          d.area, d.address, d.last_donation_date, d.total_donations, 
          d.is_available, d.is_verified,
          u.name, u.phone, u.avatar
        FROM donors d
        JOIN users u ON d.user_id = u.id
        WHERE u.status = 'active'
      `;
      const binds: any[] = [];

      if (bloodGroup && bloodGroup !== 'all') {
        sql += ' AND d.blood_group = ?';
        binds.push(bloodGroup);
      }
      if (district && district !== 'all') {
        sql += ' AND d.district = ?';
        binds.push(district);
      }
      if (upazila && upazila !== 'all') {
        sql += ' AND d.upazila = ?';
        binds.push(upazila);
      }
      if (query) {
        sql += ' AND (u.name LIKE ? OR d.area LIKE ? OR d.upazila LIKE ?)';
        binds.push(`%${query}%`, `%${query}%`, `%${query}%`);
      }

      sql += ' ORDER BY d.is_available DESC, d.last_donation_date ASC LIMIT 100';

      const results = await env.DB.prepare(sql).bind(...binds).all();
      return jsonResponse({
        success: true,
        data: {
          donors: results.results || [],
          pagination: { total: results.results?.length || 0 },
        },
      });
    }

    if (pathname === '/api/v1/donors/toggle-availability' && method === 'POST') {
      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '');
      const session = await env.DB.prepare('SELECT user_id FROM sessions WHERE token = ?').bind(token).first();
      const userId = session?.user_id || 3;

      const current = await env.DB.prepare('SELECT is_available FROM donors WHERE user_id = ?').bind(userId).first();
      const nextState = current?.is_available === 1 ? 0 : 1;

      await env.DB.prepare('UPDATE donors SET is_available = ?, updated_at = datetime("now") WHERE user_id = ?').bind(nextState, userId).run();

      return jsonResponse({
        success: true,
        data: { is_available: nextState },
        message: nextState === 1 ? 'রক্তদানের জন্য প্রস্তুত হিসেবে চিহ্নিত' : 'বিশ্রামে চিহ্নিত',
      });
    }

    // 4. Blood Requests Endpoints
    if (pathname === '/api/v1/requests' && method === 'GET') {
      const bloodGroup = url.searchParams.get('blood_group');
      const district = url.searchParams.get('district');
      const status = url.searchParams.get('status');

      let sql = 'SELECT * FROM blood_requests WHERE 1=1';
      const binds: any[] = [];

      if (bloodGroup && bloodGroup !== 'all') {
        sql += ' AND blood_group = ?';
        binds.push(bloodGroup);
      }
      if (district && district !== 'all') {
        sql += ' AND district = ?';
        binds.push(district);
      }
      if (status && status !== 'all') {
        sql += ' AND status = ?';
        binds.push(status);
      }

      sql += ' ORDER BY CASE emergency_level WHEN "critical" THEN 1 WHEN "emergency" THEN 2 ELSE 3 END, created_at DESC LIMIT 50';

      const results = await env.DB.prepare(sql).bind(...binds).all();
      return jsonResponse({
        success: true,
        data: {
          requests: results.results || [],
          pagination: { total: results.results?.length || 0 },
        },
      });
    }

    if (pathname === '/api/v1/requests' && method === 'POST') {
      const body: any = await request.json().catch(() => ({}));
      const {
        patient_name,
        blood_group,
        units_needed,
        hospital_name,
        district,
        upazila,
        location_details,
        needed_date,
        needed_time,
        contact_phone,
        emergency_level,
        case_info,
        additional_notes,
      } = body;

      const res = await env.DB.prepare(`
        INSERT INTO blood_requests (
          user_id, patient_name, blood_group, units_needed, hospital_name,
          district, upazila, location_details, needed_date, needed_time,
          contact_phone, emergency_level, case_info, additional_notes, status
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `).bind(
        patient_name || 'নাম প্রকাশে অনিচ্ছুক',
        blood_group || 'O+',
        units_needed || 1,
        hospital_name || 'বরিশাল সদর হাসপাতাল',
        district || 'বরিশাল',
        upazila || 'বরিশাল সদর',
        location_details || '',
        needed_date || new Date().toISOString().split('T')[0],
        needed_time || 'এখনই',
        contact_phone || '01700000000',
        emergency_level || 'urgent',
        case_info || '',
        additional_notes || ''
      ).run();

      return jsonResponse({
        success: true,
        message: 'জরুরি রক্তের অনুরোধ সফলভাবে প্রকাশিত হয়েছে',
        data: { id: res.meta?.last_row_id || Date.now() },
      }, 201);
    }

    // 5. Hospitals Endpoints
    if (pathname === '/api/v1/hospitals' && method === 'GET') {
      const results = await env.DB.prepare('SELECT * FROM hospitals ORDER BY district, name').all();
      return jsonResponse({
        success: true,
        data: results.results || [],
      });
    }

    if (pathname === '/api/v1/hospitals/stocks' && method === 'GET') {
      const results = await env.DB.prepare(`
        SELECT s.*, h.name as hospital_name, h.district, h.phone
        FROM blood_stocks s
        JOIN hospitals h ON s.hospital_id = h.id
        ORDER BY h.name, s.blood_group
      `).all();
      return jsonResponse({
        success: true,
        data: results.results || [],
      });
    }

    // 6. Cloudflare D1 Storage & Management Endpoints
    if (pathname === '/api/v1/d1/status' && method === 'GET') {
      const [tableCount, donorCount, requestCount, d1Instances] = await Promise.all([
        env.DB.prepare("SELECT count(*) as total FROM sqlite_master WHERE type='table'").first(),
        env.DB.prepare("SELECT count(*) as total FROM donors").first().catch(() => ({ total: 0 })),
        env.DB.prepare("SELECT count(*) as total FROM blood_requests").first().catch(() => ({ total: 0 })),
        env.DB.prepare("SELECT * FROM d1_database_instances ORDER BY is_primary DESC").all().catch(() => ({ results: [] })),
      ]);

      return jsonResponse({
        success: true,
        data: {
          storage_engine: 'Cloudflare D1 Serverless SQL',
          edge_provider: 'Cloudflare Edge Workers / Pages Functions',
          status: 'online',
          d1_primary_instance: 'barishal-rokto-prod-d1',
          binding: 'DB',
          total_tables: tableCount?.total || 23,
          registered_donors: donorCount?.total || 0,
          active_requests: requestCount?.total || 0,
          instances: d1Instances.results || [],
          serverless_region: 'APAC (Edge Singapore / Dhaka Local)',
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (pathname === '/api/v1/d1/instances' && method === 'GET') {
      const instances = await env.DB.prepare('SELECT * FROM d1_database_instances ORDER BY is_primary DESC, created_at ASC').all();
      return jsonResponse({ success: true, data: instances.results || [] });
    }

    if (pathname === '/api/v1/d1/query' && method === 'POST') {
      const body: any = await request.json().catch(() => ({}));
      const query = (body.query || '').trim();
      if (!query) {
        return jsonResponse({ success: false, error: 'SQL query required' }, 400);
      }

      const lower = query.toLowerCase();
      if (lower.startsWith('drop table') && (lower.includes('users') || lower.includes('blood_requests'))) {
        return jsonResponse({ success: false, error: 'Protected core tables cannot be dropped' }, 403);
      }

      const startTime = Date.now();
      const isSelect = lower.startsWith('select') || lower.startsWith('pragma') || lower.startsWith('explain');

      if (isSelect) {
        const result = await env.DB.prepare(query).all();
        const duration = Date.now() - startTime;
        const rows = result.results || [];
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        return jsonResponse({
          success: true,
          data: {
            columns,
            rows: rows.slice(0, 100),
            changes: 0,
            executionTimeMs: duration,
            query,
          },
        });
      } else {
        const result = await env.DB.prepare(query).run();
        const duration = Date.now() - startTime;
        return jsonResponse({
          success: true,
          data: {
            columns: [],
            rows: [],
            changes: result.meta?.changes || 0,
            executionTimeMs: duration,
            query,
          },
        });
      }
    }

    // Default 404 for unmatched API route
    return jsonResponse(
      {
        success: false,
        error: `API Route not found: ${method} ${pathname}`,
      },
      404
    );
  } catch (error: any) {
    console.error('[Cloudflare Edge Error]:', error);
    return jsonResponse(
      {
        success: false,
        error: error.message || 'Internal Cloudflare Edge D1 Error',
      },
      500
    );
  }
}
