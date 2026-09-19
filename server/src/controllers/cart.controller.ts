import { Response } from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/apiResponse';

const getSessionId = (req: AuthRequest): string => {
  let sessionId = req.headers['x-session-id'] as string;
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
  return sessionId;
};

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessionId = getSessionId(req);
    let cart = await Cart.findOne({ sessionId }).populate('items.menuItem', 'name price image isAvailable');
    if (!cart) {
      cart = await Cart.create({ sessionId, items: [] });
    }
    sendSuccess(res, cart);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const addItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessionId = getSessionId(req);
    const { menuItem, name, price, quantity = 1, image, specialInstructions } = req.body;

    if (!menuItem || !name || price === undefined) {
      sendError(res, 'menuItem, name, and price are required', 400);
      return;
    }

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => (item.menuItem as mongoose.Types.ObjectId).toString() === menuItem && item.specialInstructions === (specialInstructions || '')
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ menuItem, name, price, quantity, image, specialInstructions });
    }

    await cart.save();
    sendSuccess(res, cart, 200, 'Item added to cart');
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const updateItemQuantity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessionId = getSessionId(req);
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      sendError(res, 'Valid quantity is required', 400);
      return;
    }

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      sendError(res, 'Cart not found', 404);
      return;
    }

    if (quantity === 0) {
      cart.items = cart.items.filter((item) => (item as any)._id.toString() !== itemId);
    } else {
      const idx = cart.items.findIndex((item) => (item as any)._id.toString() === itemId);
      if (idx > -1) {
        cart.items[idx].quantity = quantity;
      }
    }

    await cart.save();
    sendSuccess(res, cart);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const removeItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessionId = getSessionId(req);
    const { itemId } = req.params;

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      sendError(res, 'Cart not found', 404);
      return;
    }

    cart.items = cart.items.filter((item) => (item as any)._id.toString() !== itemId);
    await cart.save();
    sendSuccess(res, cart);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessionId = getSessionId(req);
    const cart = await Cart.findOne({ sessionId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    sendSuccess(res, cart || { items: [], totalAmount: 0, totalItems: 0 });
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};
