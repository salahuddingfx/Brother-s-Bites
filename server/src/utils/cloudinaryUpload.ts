import cloudinary from '../config/cloudinary';

interface UploadResult {
  public_id: string;
  secure_url: string;
  [key: string]: any;
}

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed'));
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
