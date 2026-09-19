import { Response } from 'express';
import Settings from '../models/Settings';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const get = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await (Settings as any).getInstance();
    sendSuccess(res, settings);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await (Settings as any).getInstance();
    const updated = await Settings.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true,
    });
    sendSuccess(res, updated, 200, 'Settings updated');
  } catch (error) {
    sendError(res, 'Invalid data', 400);
  }
};
