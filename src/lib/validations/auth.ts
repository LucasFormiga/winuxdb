import { z } from 'zod'

export const profileSchema = z.object({
  id: z.string().uuid(),
  nickname: z.string().min(3).max(50),
  default_language: z.string().min(2).max(5),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type Profile = z.infer<typeof profileSchema>

export const deviceSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  name: z.string().min(1, 'Device name is required'),
  is_primary: z.boolean().optional().default(false),
  distro: z.string().min(1, 'Distro is required'),
  distro_version: z.string().min(1, 'Distro version is required'),
  kernel: z.string().min(1, 'Kernel is required'),
  kernel_version: z.string().min(1, 'Kernel version is required'),
  cpu: z.string().min(1, 'CPU is required'),
  gpu: z.string().nullable().optional(),
  gpu_driver: z.string().nullable().optional(),
  ram: z.string().nullable().optional(),
  de: z.string().nullable().optional(),
  steam_sys_info: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type Device = z.infer<typeof deviceSchema>

export const updateProfileSchema = profileSchema.pick({
  nickname: true,
  default_language: true,
}).partial()

export type UpdateProfile = z.infer<typeof updateProfileSchema>
