import { z } from 'zod';
import { PrimaryCategory, DanceFamily } from '@/types';

// Create enum-like schemas from const objects
const PrimaryCategoryValues = Object.values(PrimaryCategory) as [string, ...string[]];
const DanceFamilyValues = Object.values(DanceFamily) as [string, ...string[]];

export const tempoRangeSchema = z
  .object({
    min: z.number().min(20).max(300),
    max: z.number().min(20).max(300),
    sweet: z.number().min(20).max(300).optional(),
  })
  .refine((data) => data.max >= data.min, {
    message: 'Max tempo must be >= min tempo',
  })
  .refine((data) => !data.sweet || (data.sweet >= data.min && data.sweet <= data.max), {
    message: 'Sweet spot must be within tempo range',
  });

export const danceStyleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  variant: z.string().max(30).optional(),
  parentStyleId: z.string().optional(),

  primaryCategory: z.enum(PrimaryCategoryValues),
  families: z.array(z.enum(DanceFamilyValues)).min(1),

  timeSignature: z.enum(['2/4', '3/4', '4/4', '6/8']),
  tempoRange: tempoRangeSchema,

  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),

  isSystemStyle: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type DanceStyleInput = z.input<typeof danceStyleSchema>;
export type DanceStyleOutput = z.output<typeof danceStyleSchema>;
