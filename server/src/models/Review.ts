import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  customerName: string;
  customerPhone?: string;
  rating: number; // 1 - 5
  comment: string;
  dishRecommended?: string;
  menuItem?: mongoose.Types.ObjectId;
  orderNumber?: string;
  isApproved: boolean;
  isFeatured: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    customerPhone: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0.5, 'Rating must be at least 0.5'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    dishRecommended: {
      type: String,
      trim: true,
      maxlength: [100, 'Dish recommendation cannot exceed 100 characters'],
    },
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: 'Menu',
    },
    orderNumber: {
      type: String,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ isApproved: 1, isFeatured: -1, createdAt: -1 });

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
