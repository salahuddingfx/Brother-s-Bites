import { Response } from 'express';
import Gallery from '../models/Gallery';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const query: any = { isActive: true };
    if (category) query.category = category;

    const images = await Gallery.find(query).sort({ sortOrder: 1 });
    sendSuccess(res, images);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const getAllAdmin = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const images = await Gallery.find().sort({ sortOrder: 1 });
    sendSuccess(res, images);
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};

export const upload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let imageUrl = req.body.image;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'brothers-bites/gallery');
      imageUrl = result.secure_url;
    }

    if (!imageUrl) {
      sendError(res, 'No image file or URL provided', 400);
      return;
    }

    const gallery = await Gallery.create({
      title: req.body.title || '',
      image: imageUrl,
      category: req.body.category || 'all',
      isActive: req.body.isActive !== undefined ? req.body.isActive === true || req.body.isActive === 'true' : true,
      sortOrder: parseInt(req.body.sortOrder || '0', 10),
    });

    sendSuccess(res, gallery, 201, 'Image uploaded');
  } catch (error: any) {
    sendError(res, error.message || 'Upload failed', 500);
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updateData: any = {
      title: req.body.title,
      category: req.body.category,
      isActive: req.body.isActive,
      sortOrder: req.body.sortOrder,
    };

    if (req.body.image) {
      updateData.image = req.body.image;
    }

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!gallery) {
      sendError(res, 'Gallery item not found', 404);
      return;
    }
    sendSuccess(res, gallery, 200, 'Gallery item updated');
  } catch (error) {
    sendError(res, 'Invalid data', 400);
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) {
      sendError(res, 'Gallery item not found', 404);
      return;
    }

    if (gallery.image) {
      try {
        const parts = gallery.image.split('/');
        const filename = parts[parts.length - 1].split('.')[0];
        const folderIndex = parts.indexOf('upload');
        const folder = parts.slice(folderIndex + 1, -1).join('/');
        await deleteFromCloudinary(`${folder}/${filename}`);
      } catch {
        // Ignore cloudinary delete errors
      }
    }

    sendSuccess(res, null, 200, 'Gallery item deleted');
  } catch (error) {
    sendError(res, 'Server error', 500);
  }
};
