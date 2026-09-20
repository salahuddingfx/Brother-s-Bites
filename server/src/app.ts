import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { renderServerPortalHtml } from './views/serverPortalHtml';
import { printServerBanner } from './utils/banner';

const app = express();

const allowedOrigins = [
  config.clientUrl,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://bbites.salahuddin.codes',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.salahuddin.codes') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve static files (logo, images, etc.)
app.use('/public', express.static(path.join(__dirname, '../public')));

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 2500 : 20000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development or for health & analytics pings
    if (process.env.NODE_ENV !== 'production') return true;
    return req.path.includes('/health') || req.path.includes('/analytics/track');
  },
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api', limiter);

app.get('/', (req, res) => {
  const acceptsHtml = req.accepts('html', 'json') === 'html';
  if (acceptsHtml && req.query.format !== 'json') {
    const html = renderServerPortalHtml({
      environment: config.nodeEnv,
      version: '1.0.0',
      clientUrl: config.clientUrl || 'http://localhost:3000',
      uptime: process.uptime(),
    });
    return res.type('html').send(html);
  }

  res.json({
    success: true,
    message: "🍔 Welcome to Brother's Bites API",
    name: "Brother's Bites Digital Business Portal",
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      docs: '/api-docs',
      api: '/api/v1',
    },
    routes: {
      auth: '/api/v1/auth',
      menu: '/api/v1/menu',
      categories: '/api/v1/categories',
      offers: '/api/v1/offers',
      gallery: '/api/v1/gallery',
      settings: '/api/v1/settings',
      analytics: '/api/v1/analytics/visitors',
      cart: '/api/v1/cart',
      orders: '/api/v1/orders',
      reviews: '/api/v1/reviews',
      upload: '/api/v1/upload',
    },
    status: 'running',
    environment: config.nodeEnv,
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Brother\'s Bites API is running' });
});

app.get('/api-docs', (_req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: "Brother's Bites API",
      version: '1.0.0',
      description: 'REST API for Brother\'s Bites Digital Business Portal',
    },
    servers: [{ url: '/api/v1', description: 'API v1' }],
    paths: {
      '/auth/register': { post: { summary: 'Register a new user' } },
      '/auth/login': { post: { summary: 'Login' } },
      '/auth/logout': { post: { summary: 'Logout' } },
      '/auth/me': { get: { summary: 'Get current user' } },
      '/menu': { get: { summary: 'List menu items' }, post: { summary: 'Create menu item (admin)' } },
      '/menu/{id}': { get: { summary: 'Get menu item' }, put: { summary: 'Update (admin)' }, delete: { summary: 'Delete (admin)' } },
      '/categories': { get: { summary: 'List categories' }, post: { summary: 'Create category (admin)' } },
      '/categories/{id}': { get: { summary: 'Get category' }, put: { summary: 'Update (admin)' }, delete: { summary: 'Delete (admin)' } },
      '/offers': { get: { summary: 'List offers' }, post: { summary: 'Create offer (admin)' } },
      '/offers/{id}': { get: { summary: 'Get offer' }, put: { summary: 'Update (admin)' }, delete: { summary: 'Delete (admin)' } },
      '/gallery': { get: { summary: 'List gallery images' }, post: { summary: 'Upload image (admin)' } },
      '/gallery/{id}': { delete: { summary: 'Delete image (admin)' } },
      '/settings': { get: { summary: 'Get site settings' }, put: { summary: 'Update settings (admin)' } },
      '/cart': { get: { summary: 'Get cart' }, post: { summary: 'Add to cart' }, put: { summary: 'Update cart' }, delete: { summary: 'Clear cart' } },
      '/orders': { get: { summary: 'List orders (admin)' }, post: { summary: 'Place order' } },
      '/orders/{id}': { get: { summary: 'Get order' }, put: { summary: 'Update order status (admin)' } },
      '/reviews': { get: { summary: 'List reviews' }, post: { summary: 'Submit review' } },
      '/reviews/{id}': { delete: { summary: 'Delete review (admin)' } },
      '/upload': { post: { summary: 'Upload image to Cloudinary (admin)' } },
    },
  });
});

app.use('/api/v1', routes);

app.use(errorHandler);

// Ensure DB is connected for serverless environments
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(config.port, () => {
    printServerBanner(config.port || 5000, config.nodeEnv || 'development');
  });
};

if (!process.env.VERCEL) {
  startServer();
}

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err.message);
  if (!process.env.VERCEL) process.exit(1);
});

export default app;
