import mongoose, { Document, Schema } from 'mongoose';

export interface IOffer extends Document {
  title: string;
  description?: string;
  discount?: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  sortOrder: number;
  isExpired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<IOffer>(
  {
    title: { type: String, required: true },
    description: { type: String },
    discount: { type: String },
    image: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

offerSchema.virtual('isExpired').get(function () {
  return this.endDate < new Date();
});

export default mongoose.model<IOffer>('Offer', offerSchema);
