import { z } from 'zod';
import { FSA_ALLERGENS } from './allergens';
import { DIETARY_TAGS, ORDER_STATUSES } from './constants';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
  modifierIds: z.array(z.string().uuid()).default([]),
});

export const addToCartSchema = cartItemSchema;

export const checkoutQuoteSchema = z.object({
  orderType: z.enum(['delivery', 'collection']),
  postcode: z.string().optional(),
  items: z.array(cartItemSchema).min(1),
});

export const createOrderSchema = z.object({
  orderType: z.enum(['delivery', 'collection']),
  paymentMethod: z.enum(['card', 'cash']),
  guestEmail: z.string().email().optional(),
  allergenAcknowledged: z.literal(true),
  deliveryAddress: z
    .object({
      line1: z.string().min(1),
      line2: z.string().optional(),
      city: z.string().min(1),
      postcode: z.string().min(1),
    })
    .optional(),
  scheduledFor: z.string().datetime().optional(),
  items: z.array(cartItemSchema).min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export const productAllergensSchema = z.array(z.enum(FSA_ALLERGENS));
export const dietaryTagsSchema = z.array(z.enum(DIETARY_TAGS));
