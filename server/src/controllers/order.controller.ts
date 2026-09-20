import { Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import { AuthRequest } from '../middleware/auth.middleware';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator';
import { sendSuccess, sendError } from '../utils/apiResponse';
import {
  sendEmail,
  generateOrderConfirmationEmail,
  generateAdminOrderNotificationEmail,
  generateOrderStatusUpdateEmail,
} from '../utils/email';
import { renderServerThermalReceipt } from '../views/thermalReceiptHtml';

const generateOrderNumber = (): string => {
  const date = new Date();
  const prefix = 'BB';
  const datePart = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${datePart}-${random}`;
};

const getSessionId = (req: AuthRequest): string => {
  return (req.headers['x-session-id'] as string) || `guest_${Date.now()}`;
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createOrderSchema.parse(req.body);

    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryFee = data.orderType === 'delivery' ? Math.max(0, Number(data.deliveryFee) || 0) : 0;
    const totalAmount = subtotal + deliveryFee;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user?._id || undefined,
      customer: {
        name: data.customer.name,
        phone: data.customer.phone,
        email: data.customer.email || undefined,
        address: data.customer.address,
      },
      items: data.items,
      deliveryFee,
      totalAmount,
      totalItems,
      orderType: data.orderType,
      paymentMethod: data.paymentMethod,
      specialNotes: data.specialNotes,
    });

    // Clear cart
    const sessionId = getSessionId(req);
    await Cart.findOneAndDelete({ sessionId });

    // Notify admin
    const adminHtml = generateAdminOrderNotificationEmail({
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      totalAmount: order.totalAmount,
      orderType: order.orderType,
    });
    const adminEmail = process.env.BREVO_SENDER_EMAIL || '';
    if (adminEmail) {
      sendEmail({ to: adminEmail, subject: `[New Order] #${order.orderNumber} - Brother's Bites`, html: adminHtml }).catch(() => {});
    }

    sendSuccess(res, order, 201, 'Order placed successfully');
  } catch (error) {
    sendError(res, 'Invalid data', 400);
  }
};

export const trackOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rawQuery = (req.params.query || req.params.orderNumber || (req.query.q as string) || '').trim();
    if (!rawQuery) {
      sendError(res, 'Order number or phone number is required', 400);
      return;
    }

    const cleanQuery = rawQuery.replace(/[\s-]/g, '');
    const phoneDigits = rawQuery.replace(/\D/g, '');

    let matchedOrders: any[] = [];

    // 1. Try finding by exact / regex order number first
    if (rawQuery.toUpperCase().startsWith('BB-') || rawQuery.includes('-')) {
      const singleOrder = await Order.findOne({
        orderNumber: { $regex: new RegExp(`^${rawQuery}$`, 'i') },
      });
      if (singleOrder) {
        matchedOrders = [singleOrder];
      }
    }

    // 2. If no order found and has phone digits (at least 6 digits), search by phone
    if (matchedOrders.length === 0 && phoneDigits.length >= 6) {
      const lastDigits = phoneDigits.slice(-10); // Match last 10 digits for Bangladesh numbers
      matchedOrders = await Order.find({
        'customer.phone': { $regex: new RegExp(lastDigits) },
      }).sort({ createdAt: -1 }).limit(10);
    }

    // 3. Fallback: Search either orderNumber or customer.phone
    if (matchedOrders.length === 0) {
      matchedOrders = await Order.find({
        $or: [
          { orderNumber: { $regex: new RegExp(rawQuery, 'i') } },
          { 'customer.phone': { $regex: new RegExp(rawQuery, 'i') } },
        ],
      }).sort({ createdAt: -1 }).limit(10);
    }

    if (matchedOrders.length === 0) {
      sendError(res, 'No order found with this order number or phone number', 404);
      return;
    }

    sendSuccess(
      res,
      {
        order: matchedOrders[0],
        orders: matchedOrders,
        totalFound: matchedOrders.length,
      },
      200,
      'Order tracking retrieved'
    );
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);

    sendSuccess(res, { orders, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      sendError(res, 'Order not found', 404);
      return;
    }
    sendSuccess(res, order);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = updateOrderStatusSchema.parse(req.body);
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: data.status, ...(data.paymentStatus && { paymentStatus: data.paymentStatus }) },
      { new: true }
    );
    if (!order) {
      sendError(res, 'Order not found', 404);
      return;
    }

    // Only send delivery completion email when marked as delivered
    if (data.status === 'delivered' && order.customer?.email) {
      const statusHtml = generateOrderStatusUpdateEmail({
        orderNumber: order.orderNumber,
        customer: order.customer,
        status: 'delivered',
        orderType: order.orderType,
        items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
      });
      sendEmail({
        to: order.customer.email,
        subject: `🎉 Your Order #${order.orderNumber} Has Been Delivered! - Brother's Bites`,
        html: statusHtml,
      }).catch((err) => {
        console.error('Failed to send delivery email:', err);
      });
    }

    sendSuccess(res, order, 200, 'Order status updated');
  } catch (error) {
    sendError(res, 'Invalid data', 400);
  }
};

export const getOrderStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, pendingOrders, todayOrders, todayRevenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'preparing'] } }),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    sendSuccess(res, {
      totalOrders,
      pendingOrders,
      todayOrders,
      todayRevenue: todayRevenue[0]?.total || 0,
    });
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const userPhone = req.user?.phone;
    const userEmail = req.user?.email;

    if (!userId) {
      sendError(res, 'Not authorized', 401);
      return;
    }

    const queryConditions: any[] = [{ user: userId }];
    if (userPhone && userPhone.trim()) {
      const lastDigits = userPhone.replace(/\D/g, '').slice(-10);
      if (lastDigits.length >= 6) {
        queryConditions.push({ 'customer.phone': { $regex: new RegExp(lastDigits) } });
      }
    }
    if (userEmail && userEmail.trim()) {
      queryConditions.push({ 'customer.email': userEmail.toLowerCase().trim() });
    }

    const orders = await Order.find({ $or: queryConditions }).sort({ createdAt: -1 });

    sendSuccess(res, orders, 200);
  } catch (error) {
    console.error('Error in getMyOrders:', error);
    sendError(res, 'Failed to fetch customer orders', 500);
  }
};

export const getThermalReceipt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const format = req.query.format === 'mini' ? 'mini' : '2inch';
    const autoprint = req.query.autoprint === '1' || req.query.autoprint === 'true';

    let order = null;
    if (id.startsWith('BB-')) {
      order = await Order.findOne({ orderNumber: id });
    } else {
      order = await Order.findById(id);
    }

    if (!order) {
      sendError(res, 'Order not found', 404);
      return;
    }

    const acceptsHtml = req.accepts('html', 'json') === 'html';
    if (acceptsHtml && req.query.json !== 'true') {
      const html = renderServerThermalReceipt(order as any, format, autoprint);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
      return;
    }

    sendSuccess(res, order, 200);
  } catch (error: any) {
    sendError(res, error.message || 'Server error', 500);
  }
};
