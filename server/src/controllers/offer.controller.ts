import { Response } from 'express';
import mongoose from 'mongoose';
import Offer from '../models/Offer';
import { AuthRequest } from '../middleware/auth.middleware';
import { createOfferSchema, updateOfferSchema } from '../validators/offer.validator';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getActive = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      endDate: { $gte: now },
      startDate: { $lte: now },
    }).sort({ sortOrder: 1 });
    sendSuccess(res, offers);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const getAll = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const offers = await Offer.find().sort({ sortOrder: 1 });
    sendSuccess(res, offers);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const getById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendError(res, 'Offer not found', 404);
      return;
    }
    const offer = await Offer.findById(id);
    if (!offer) {
      sendError(res, 'Offer not found', 404);
      return;
    }
    sendSuccess(res, offer);
  } catch (error) {
    console.error('Error in getById offer:', error);
    sendError(res, 'Server error', 500);
  }
};

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createOfferSchema.parse(req.body);
    const offer = await Offer.create(data);
    sendSuccess(res, offer, 201, 'Offer created');
  } catch (error) {
    sendError(res, 'Invalid data', 400);
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = updateOfferSchema.parse(req.body);
    const offer = await Offer.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!offer) {
      sendError(res, 'Offer not found', 404);
      return;
    }
    sendSuccess(res, offer, 200, 'Offer updated');
  } catch (error) {
    sendError(res, 'Invalid data', 400);
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      sendError(res, 'Offer not found', 404);
      return;
    }
    sendSuccess(res, null, 200, 'Offer deleted');
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};
