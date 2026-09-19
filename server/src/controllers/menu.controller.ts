import { Response } from 'express';
import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem';
import Category from '../models/Category';
import { AuthRequest } from '../middleware/auth.middleware';
import { createMenuItemSchema, updateMenuItemSchema } from '../validators/menu.validator';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, search, page = '1', limit = '12' } = req.query;
    const query: any = { isAvailable: true };

    if (category && category !== 'all') {
      const catStr = category as string;
      if (mongoose.Types.ObjectId.isValid(catStr)) {
        query.category = catStr;
      } else {
        const foundCat = await Category.findOne({
          $or: [
            { slug: catStr.toLowerCase() },
            { name: new RegExp(`^${catStr}$`, 'i') },
          ],
        });
        if (foundCat) {
          query.category = foundCat._id;
        } else {
          sendSuccess(res, {
            items: [],
            pagination: {
              page: parseInt(page as string, 10),
              limit: parseInt(limit as string, 10),
              total: 0,
              pages: 0,
            },
          });
          return;
        }
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      MenuItem.find(query)
        .populate('category', 'name slug')
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      MenuItem.countDocuments(query),
    ]);

    sendSuccess(res, {
      items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error in getAll menu:', error);
    sendError(res, 'Server error', 500);
  }
};

export const getFeatured = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const items = await MenuItem.find({ isFeatured: true, isAvailable: true })
      .populate('category', 'name slug')
      .sort({ sortOrder: 1 });
    sendSuccess(res, items);
  } catch (error) {
    console.error('Error in getFeatured menu:', error);
    sendError(res, 'Server error', 500);
  }
};

export const getById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let item = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      item = await MenuItem.findById(id).populate('category', 'name slug');
    }

    if (!item) {
      item = await MenuItem.findOne({ slug: id }).populate('category', 'name slug');
    }

    if (!item) {
      sendError(res, 'Menu item not found', 404);
      return;
    }
    sendSuccess(res, item);
  } catch (error) {
    console.error('Error in getById menu:', error);
    sendError(res, 'Server error', 500);
  }
};

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createMenuItemSchema.parse(req.body);
    const item = await MenuItem.create(data);
    sendSuccess(res, item, 201, 'Menu item created');
  } catch (error) {
    sendError(res, 'Invalid data or duplicate slug', 400);
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = updateMenuItemSchema.parse(req.body);
    const item = await MenuItem.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      sendError(res, 'Menu item not found', 404);
      return;
    }
    sendSuccess(res, item, 200, 'Menu item updated');
  } catch (error) {
    sendError(res, 'Invalid data', 400);
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      sendError(res, 'Menu item not found', 404);
      return;
    }
    sendSuccess(res, null, 200, 'Menu item deleted');
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const toggleAvailability = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      sendError(res, 'Menu item not found', 404);
      return;
    }
    item.isAvailable = !item.isAvailable;
    await item.save();
    sendSuccess(res, item, 200, `Menu item is now ${item.isAvailable ? 'available' : 'unavailable'}`);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const toggleFeatured = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      sendError(res, 'Menu item not found', 404);
      return;
    }
    item.isFeatured = !item.isFeatured;
    await item.save();
    sendSuccess(res, item, 200, `Menu item is now ${item.isFeatured ? 'featured' : 'unfeatured'}`);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};
