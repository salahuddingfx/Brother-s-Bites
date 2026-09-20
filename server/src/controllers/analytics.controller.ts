import { Request, Response } from 'express';
import crypto from 'crypto';
import Visitor from '../models/Visitor';

const parseDevice = (ua: string): 'mobile' | 'desktop' | 'tablet' | 'other' => {
  const lower = ua.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(lower)) return 'tablet';
  if (/mobile|iphone|android|blackberry|iemobile|opera mini/i.test(lower)) return 'mobile';
  if (/windows|macintosh|linux/i.test(lower)) return 'desktop';
  return 'other';
};

const parseBrowser = (ua: string): string => {
  if (/edg/i.test(ua)) return 'Edge';
  if (/chrome|crios/i.test(ua)) return 'Chrome';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) return 'Safari';
  if (/opera|opr/i.test(ua)) return 'Opera';
  return 'Other';
};

// Track a public page view (anonymized IP + fast fire and forget)
export const trackPageView = async (req: Request, res: Response): Promise<void> => {
  try {
    const { path = '/', referrer = '' } = req.body;
    
    // Anonymize IP via SHA-256 hash with date salt for privacy compliance
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
    const dateStr = new Date().toISOString().slice(0, 10);
    const ipHash = crypto.createHash('sha256').update(`${ip}-${dateStr}`).digest('hex').substring(0, 16);

    const ua = req.headers['user-agent'] || '';
    const device = parseDevice(ua);
    const browser = parseBrowser(ua);

    await Visitor.create({
      ipHash,
      path: typeof path === 'string' && path.startsWith('/') ? path : '/',
      referrer: typeof referrer === 'string' ? referrer.substring(0, 255) : '',
      userAgent: ua.substring(0, 255),
      device,
      browser,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    // Non-blocking for client
    res.status(200).json({ success: false });
  }
};

// Get Visitor Statistics with Date Filtering (Admin Only)
export const getVisitorStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = '7d' } = req.query;

    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'yesterday':
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'all':
        startDate = new Date(2020, 0, 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const filter: Record<string, any> = { createdAt: { $gte: startDate } };
    if (period === 'yesterday') {
      const yesterdayEnd = new Date(startDate);
      yesterdayEnd.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = yesterdayEnd;
    }

    // Aggregations in parallel
    const [totalPageviews, uniqueVisitors, topPages, deviceBreakdown, browserBreakdown] = await Promise.all([
      Visitor.countDocuments(filter),
      Visitor.distinct('ipHash', filter).then((arr) => arr.length),
      Visitor.aggregate([
        { $match: filter },
        { $group: { _id: '$path', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      Visitor.aggregate([
        { $match: filter },
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Visitor.aggregate([
        { $match: filter },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        period,
        totalPageviews,
        uniqueVisitors,
        topPages: topPages.map((p) => ({ path: p._id, count: p.count })),
        deviceBreakdown: deviceBreakdown.map((d) => ({ device: d._id, count: d.count })),
        browserBreakdown: browserBreakdown.map((b) => ({ browser: b._id, count: b.count })),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
