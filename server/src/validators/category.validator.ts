import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});
