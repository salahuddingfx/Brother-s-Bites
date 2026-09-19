import { Response } from 'express';
import mongoose from 'mongoose';
import Category from '../models/Category';
import { AuthRequest } from '../middleware/auth.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAll = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    sendSuccess(res, categories);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const getById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let category = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await Category.findById(id);
    }

    if (!category) {
      category = await Category.findOne({ slug: id.toLowerCase() });
    }

    if (!category) {
      sendError(res, 'Category not found', 404);
      return;
    }
    sendSuccess(res, category);
  } catch (error) {
    console.error('Error in getById category:', error);
    sendError(res, 'Server error', 500);
  }
};

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createCategorySchema.parse(req.body);
    const category = await Category.create(data);
    sendSuccess(res, category, 201, 'Category created');
  } catch (error) {
    sendError(res, 'Invalid data or duplicate slug', 400);
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = updateCategorySchema.parse(req.body);
    const category = await Category.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      sendError(res, 'Category not found', 404);
      return;
    }
    sendSuccess(res, category, 200, 'Category updated');
  } catch (error) {
    sendError(res, 'Invalid data', 400);
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      sendError(res, 'Category not found', 404);
      return;
    }
    sendSuccess(res, null, 200, 'Category deleted');
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};
