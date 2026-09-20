import mongoose, { Document, Schema } from 'mongoose';

export interface IVisitor extends Document {
  ipHash: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  device: 'mobile' | 'desktop' | 'tablet' | 'other';
  browser?: string;
  os?: string;
  createdAt: Date;
}

const visitorSchema = new Schema<IVisitor>(
  {
    ipHash: { type: String, required: true, index: true },
    path: { type: String, required: true, index: true },
    referrer: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    device: {
      type: String,
      enum: ['mobile', 'desktop', 'tablet', 'other'],
      default: 'desktop',
    },
    browser: { type: String, default: 'Unknown' },
    os: { type: String, default: 'Unknown' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Index for fast analytics date range queries
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ path: 1, createdAt: -1 });

export default mongoose.model<IVisitor>('Visitor', visitorSchema);
