export type Rating = 'BORKED' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'NATIVE'

export interface HardwareInfo {
  distro: string
  kernel: string
  cpu: string
  gpu: string
  ram: string
  de: string
}

export interface UserReview {
  id: string
  user: {
    name: string
    avatar?: string
  }
  rating: Rating
  content: string
  date: string
  hardware: HardwareInfo
  compatibility: {
    engine: 'Wine' | 'Proton'
    version: string
  }
}

export interface App {
  id: string
  name: string
  logo?: string
  description?: string
  screenshots?: string[]
  version: string
  recommendedVersion: string
  rating: Rating
  score: number // The 1-5 numerical rating
  category: string
  license: string
  author: string
  releaseDate: string
  popularity: number
  recommendedAlternatives: string[]
  nativeAlternatives: string[]
  isVerified: boolean
  gpuCompatibility?: {
    directx?: string
    opengl?: string
    vulkan?: string
  }
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
  }
}
