import { z } from 'zod'

export const compatibilityLevelSchema = z.enum(['BORKED', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'NATIVE'])

export type CompatibilityLevel = z.infer<typeof compatibilityLevelSchema>

export const appSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable().optional(),
  logo_url: z.string().url().nullable().optional(),
  category: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
  recommended_version: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  license: z.string().nullable().optional(),
  release_date: z.string().nullable().optional(),
  score: z.number().min(1).max(5).default(0),
  overall_rating: compatibilityLevelSchema.nullable().optional(),
  popularity: z.number().default(0),
  is_verified: z.boolean().default(false),
  native_alternatives: z.array(z.string()).default([]),
  recommended_alternatives: z.array(z.string()).default([]),
  gpu_compatibility: z.record(z.string(), z.string()).nullable().optional(),
  instructions: z.record(z.string(), z.any()).nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

export type App = z.infer<typeof appSchema>

export const reviewSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  app_id: z.string().uuid(),
  device_id: z.string().uuid(),
  rating: compatibilityLevelSchema,
  numerical_score: z.number().min(1).max(5),
  stability: z.string().optional(),
  performance: z.string().optional(),
  installation: z.string().optional(),
  tinker_steps: z.array(z.string()).optional(),
  content: z.string().min(10, 'Review content must be at least 10 characters'),
  app_version_tested: z.string().min(1, 'App version tested is required'),
  wine_proton_version: z.string().min(1, 'Wine/Proton version is required'),
  is_verified_report: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

export type Review = z.infer<typeof reviewSchema>
