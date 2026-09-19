import { z } from 'zod';

export const loginSchema = z
  .object({
    identifier: z.string().min(1, 'Username or Email is required').optional(),
    email: z.string().min(1, 'Username or Email is required').optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine((data) => data.identifier || data.email, {
    message: 'Username or Email is required',
    path: ['identifier'],
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email is required'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      area: z.string().optional(),
      landmark: z.string().optional(),
    })
    .optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  phone: z.string().optional().or(z.literal('')),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      area: z.string().optional(),
      landmark: z.string().optional(),
    })
    .optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(2, 'Username must be at least 2 characters').optional().or(z.literal('')),
  email: z.string().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['super_admin', 'admin', 'manager', 'staff', 'customer']).default('customer'),
  phone: z.string().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      area: z.string().optional(),
      landmark: z.string().optional(),
    })
    .optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  username: z.string().min(2, 'Username must be at least 2 characters').optional().or(z.literal('')),
  email: z.string().email('Valid email is required').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['super_admin', 'admin', 'manager', 'staff', 'customer']).optional(),
  phone: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      area: z.string().optional(),
      landmark: z.string().optional(),
    })
    .optional(),
});
