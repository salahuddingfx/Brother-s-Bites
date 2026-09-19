import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 'No image file provided', 400);
      return;
    }

    const folder = (req.query.folder as string) || 'brothers-bites';
    const result = await uploadToCloudinary(req.file.buffer, folder);

    sendSuccess(
      res,
      {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      },
      201,
      'Image uploaded successfully to Cloudinary'
    );
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    sendError(res, error.message || 'Image upload failed', 500);
  }
};

export const deleteImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      sendError(res, 'publicId is required', 400);
      return;
    }

    await deleteFromCloudinary(publicId);
    sendSuccess(res, null, 200, 'Image deleted successfully from Cloudinary');
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    sendError(res, error.message || 'Image delete failed', 500);
  }
};
