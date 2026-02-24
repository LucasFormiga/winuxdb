export type Rating = 'BORKED' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'NATIVE'

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
