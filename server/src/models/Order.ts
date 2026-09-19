import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  specialInstructions?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: {
      street: string;
      city: string;
      area?: string;
      landmark?: string;
    };
  };
  items: IOrderItem[];
  deliveryFee?: number;
  totalAmount: number;
  totalItems: number;
  orderType: 'delivery' | 'pickup';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'counter';
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  specialNotes?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
  specialInstructions: { type: String, default: '' },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        area: { type: String },
        landmark: { type: String },
      },
    },
    items: [orderItemSchema],
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    orderType: { type: String, enum: ['delivery', 'pickup'], required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['cash', 'counter'], default: 'cash' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
    specialNotes: { type: String },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customer.phone': 1 });

export default mongoose.model<IOrder>('Order', orderSchema);
