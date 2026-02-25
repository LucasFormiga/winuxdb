export type Rating = 'BORKED' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'NATIVE'

export interface HardwareInfo {
  distro: string
  kernel: string
  cpu: string
  gpu: string
  ram: string
  de: string
}

export interface UserDevice {
  id: string
  name: string
  distro: string
  distroVersion?: string
  kernel: string
  kernelVersion?: string
  cpu: string
  gpu: string
  gpuDriver?: string
  ram: string
  de?: string
  isPrimary: boolean
}

export interface UserAccount {
  id: string
  nickname: string
  email: string
  avatarUrl?: string
  preferredLanguage: string
  devices: UserDevice[]
  is_banned?: boolean
  is_admin?: boolean
  is_verified?: boolean
}

export interface UserReview {
  id: string
  user_id: string
  user: {
    name: string
    avatar?: string
    is_admin?: boolean
    is_verified?: boolean
  }
  rating: Rating
  content: string
  date: string
  created_at?: string // Match DB
  wine_proton_version?: string // Match DB
  app_version_tested?: string // Match DB
  hardware: HardwareInfo
  compatibility: {
    engine: 'Wine' | 'Proton'
    version: string
  }
}

export interface App {
  id: string
  name: string
  slug: string
  logo_url?: string | null
  logo?: string | null // Keep legacy for compatibility during transition
  description?: string | null
  screenshots?: string[] | null
  version?: string | null
  recommendedVersion?: string | null
  recommended_version?: string | null // Match DB
  rating?: Rating | null
  overall_rating?: Rating | null // Match DB
  score: number // The 1-5 numerical rating
  category?: string | null
  license?: string | null
  author?: string | null
  releaseDate?: string | null
  release_date?: string | null // Match DB
  popularity?: number
  recommendedAlternatives?: string[] | null
  recommended_alternatives?: string[] | null // Match DB
  nativeAlternatives?: string[] | null
  native_alternatives?: string[] | null // Match DB
  isVerified?: boolean | null
  is_verified?: boolean | null // Match DB
  gpuCompatibility?: {
    directx?: string
    opengl?: string
    vulkan?: string
  }
  gpu_compatibility?: {
    directx?: string
    opengl?: string
    vulkan?: string
  } | null // Match DB
  instructions?: {
    wine?: {
      bottles?: string
      playonlinux?: string
      general?: string
    }
    proton?: {
      valve?: string
      ge?: string
      cachyos?: string
    }
  } | null
}
