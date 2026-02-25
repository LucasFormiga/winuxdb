import type { UserReview } from '../types'

export const MOCK_REVIEWS: Record<string, UserReview[]> = {
  discord: [
    {
      id: '1',
      user_id: 'mock-user-1',
      user: { name: 'Lucas Pinheiro', avatar: 'https://github.com/lucaspinheiro.png' },
      rating: 'NATIVE',
      content:
        'Works perfectly on my CachyOS setup. The native client is stable and fast. Screen sharing works with Wayland after some tweaks.',
      date: '2026-02-20',
      hardware: {
        distro: 'CachyOS',
        kernel: '6.13.2-cachyos',
        cpu: 'AMD Ryzen 7 5800X',
        gpu: 'NVIDIA RTX 3080',
        ram: '32GB',
        de: 'KDE Plasma 6.0'
      },
      compatibility: {
        engine: 'Proton', // Just for mock variety, even if it's native
        version: '9.0-1'
      }
    },
    {
      id: '2',
      user_id: 'mock-user-2',
      user: { name: 'OpenSourceFan' },
      rating: 'PLATINUM',
      content:
        'Running the flatpak version. Everything works as expected. Using it for daily communication and gaming calls.',
      date: '2026-02-15',
      hardware: {
        distro: 'Fedora 41',
        kernel: '6.12.0-fedora',
        cpu: 'Intel i5-12400',
        gpu: 'AMD RX 6600',
        ram: '16GB',
        de: 'GNOME 47'
      },
      compatibility: {
        engine: 'Wine',
        version: 'Stable 9.0'
      }
    }
  ],
  'photoshop-cc': [
    {
      id: '3',
      user_id: 'mock-user-3',
      user: { name: 'CreativeLinux' },
      rating: 'SILVER',
      content:
        "Installation was tricky. Performance is okay, but some UI flickers happen occasionally. Useful for quick edits but wouldn't use it for heavy work yet.",
      date: '2026-01-10',
      hardware: {
        distro: 'Arch Linux',
        kernel: '6.13.0-arch',
        cpu: 'AMD Ryzen 9 5950X',
        gpu: 'NVIDIA RTX 4090',
        ram: '64GB',
        de: 'Hyprland'
      },
      compatibility: {
        engine: 'Wine',
        version: 'Staging 9.5'
      }
    }
  ]
}

export function getAppReviews(appId: string): UserReview[] {
  return MOCK_REVIEWS[appId] || []
}
