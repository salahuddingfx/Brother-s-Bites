import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'customer';

export interface IUserAddress {
  street?: string;
  city?: string;
  area?: string;
  landmark?: string;
}

export interface IUser extends Document {
  name: string;
  username?: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: IUserAddress;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, trim: true, lowercase: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'manager', 'staff', 'customer'],
      default: 'customer',
    },
    phone: { type: String, trim: true },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: "Cox's Bazar" },
      area: { type: String, default: '' },
      landmark: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);

