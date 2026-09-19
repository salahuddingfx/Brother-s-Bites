import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    image: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

categorySchema.pre('validate', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = generateSlug(this.name);
  }
  next();
});

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = generateSlug(this.name);
  }
  next();
});

export default mongoose.model<ICategory>('Category', categorySchema);
