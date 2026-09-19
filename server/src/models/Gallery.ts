import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title?: string;
  image: string;
  category: 'food' | 'place' | 'vibe' | 'all';
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: { type: String },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ['food', 'place', 'vibe', 'all'],
      default: 'all',
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IGallery>('Gallery', gallerySchema);
