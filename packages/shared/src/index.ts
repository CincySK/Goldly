import { z } from 'zod';

export const metalTypes = ['GOLD', 'SILVER'] as const;
export const itemTypes = ['BAR', 'COIN'] as const;
export const listingStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'SOLD'] as const;
export const trustedMints = ['U.S. Mint', 'PAMP', 'Royal Canadian Mint', 'Perth Mint', 'Austrian Mint'] as const;

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const toNumber = z.preprocess((v) => Number(v), z.number().positive());

export const createListingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  metalType: z.enum(metalTypes),
  itemType: z.enum(itemTypes),
  mint: z.string().min(2),
  weight: toNumber,
  weightUnit: z.string().min(1),
  askingPrice: toNumber,
  currency: z.string().default('USD')
});

export const reviewSchema = z.object({
  listingId: z.string().uuid(),
  revieweeId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(2).max(1000)
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
