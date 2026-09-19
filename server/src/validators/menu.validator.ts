import { z } from 'zod';

export const createMenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  servingSize: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  sortOrder: z.number().optional().default(0),
});

export const updateMenuItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  category: z.string().min(1).optional(),
  servingSize: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().optional(),
});
