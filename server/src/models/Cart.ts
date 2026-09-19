import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  specialInstructions?: string;
}

export interface ICart extends Document {
  sessionId: string;
  items: ICartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  image: { type: String },
  specialInstructions: { type: String, default: '' },
});

const cartSchema = new Schema<ICart>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.pre('save', function (next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

export default mongoose.model<ICart>('Cart', cartSchema);
