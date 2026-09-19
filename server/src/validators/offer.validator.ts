import { z } from 'zod';

export const createOfferSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  discount: z.string().optional(),
  image: z.string().optional(),
  startDate: z.coerce.date({ required_error: 'Start date is required' }),
  endDate: z.coerce.date({ required_error: 'End date is required' }),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
});

export const updateOfferSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  discount: z.string().optional(),
  image: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});
