import { z } from 'zod';

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    address: z
      .object({
        street: z.string().min(1, 'Street address is required'),
        city: z.string().min(1, 'City is required'),
        area: z.string().optional(),
        landmark: z.string().optional(),
      })
      .optional(),
  }),
  items: z
    .array(
      z.object({
        menuItem: z.string().min(1),
        name: z.string().min(1),
        price: z.number().min(0),
        quantity: z.number().min(1),
        image: z.string().optional(),
        specialInstructions: z.string().optional(),
      })
    )
    .min(1, 'At least one item is required'),
  orderType: z.enum(['delivery', 'pickup']),
  deliveryFee: z.number().min(0).optional(),
  paymentMethod: z.enum(['cash', 'counter']).default('cash'),
  specialNotes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']),
  paymentStatus: z.enum(['pending', 'paid', 'cancelled']).optional(),
  estimatedDelivery: z.string().optional(),
});
