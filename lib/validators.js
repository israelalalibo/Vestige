import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(200),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional().or(z.literal('')),
  body: z.string().trim().min(3, 'Review is too short').max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
});

export const couponValidateSchema = z.object({
  code: z.string().trim().min(1),
  subtotalCents: z.coerce.number().int().nonnegative(),
});

export const productSchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and dashes only'),
  description: z.string().trim().min(1),
  priceCents: z.coerce.number().int().positive(),
  category: z.string().trim().min(1),
  featured: z.coerce.boolean().optional().default(false),
  isNew: z.coerce.boolean().optional().default(false),
  active: z.coerce.boolean().optional().default(true),
  details: z.array(z.string()).optional().default([]),
  images: z.array(z.string().url()).min(1, 'At least one image'),
  variants: z
    .array(
      z.object({
        size: z.string().trim().min(1),
        color: z.string().trim().min(1),
        stock: z.coerce.number().int().nonnegative(),
        sku: z.string().trim().optional(),
      })
    )
    .default([]),
});

export const couponSchema = z.object({
  code: z.string().trim().toUpperCase().min(2).max(40),
  type: z.enum(['PERCENT', 'FIXED']),
  value: z.coerce.number().int().positive(),
  minSubtotalCents: z.coerce.number().int().nonnegative().default(0),
  maxUses: z.coerce.number().int().positive().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  active: z.coerce.boolean().default(true),
});

export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
});
