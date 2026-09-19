import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  category: mongoose.Types.ObjectId;
  servingSize?: string;
  image?: string;
  images?: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    servingSize: { type: String },
    image: { type: String },
    images: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ isFeatured: 1 });

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

menuItemSchema.pre('validate', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = generateSlug(this.name);
  }
  next();
});

menuItemSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = generateSlug(this.name);
  }
  next();
});

export default mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
