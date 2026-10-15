import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { runMigrations } from './server/db/migrations.js';
import { seedInitialData } from './server/db/seed.js';
import { authMiddleware } from './server/middleware/auth.js';

// Route imports
import authRoutes from './server/routes/auth.js';
import donorRoutes from './server/routes/donors.js';
import requestRoutes from './server/routes/requests.js';
import hospitalRoutes from './server/routes/hospitals.js';
import notificationRoutes from './server/routes/notifications.js';
import reportRoutes from './server/routes/reports.js';
import adminRoutes from './server/routes/admin.js';
import aiRoutes from './server/routes/ai.js';
import cloudflareRoutes from './server/routes/cloudflare.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Database & Run Migrations & Seed Data
try {
  runMigrations();
  seedInitialData();
} catch (dbErr) {
  console.error('[DB] Initialization error:', dbErr);
}

// Basic security headers & parsing middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Auth session parser
app.use(authMiddleware);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Barishal Rokto API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes supporting both /api/v1/* and /api/* paths seamlessly
const mountApiRoutes = (prefix: string) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/donors`, donorRoutes);
  app.use(`${prefix}/requests`, requestRoutes);
  app.use(`${prefix}/hospitals`, hospitalRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
  app.use(`${prefix}/reports`, reportRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/ai`, aiRoutes);
  app.use(`${prefix}/r2`, cloudflareRoutes);
  app.use(`${prefix}/d1`, cloudflareRoutes);
  app.use(`${prefix}/cloudflare`, cloudflareRoutes);
};

mountApiRoutes('/api/v1');
mountApiRoutes('/api');

// Never return HTML for /api/* requests; return clean JSON 404
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Frontend integration: Vite middleware in dev, static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[DEV] Vite dev middleware mounted (HMR disabled).');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log(`[PROD] Serving static files from ${distPath}`);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[SERVER] Barishal Rokto running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[FATAL] Failed to start server:', err);
  process.exit(1);
});
