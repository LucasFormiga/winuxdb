export type DistroFlavor = {
  id: string
  name: string
  desktop: string
  url: string
  screenshot: string
  tags: string[]
  distroseaUrl?: string
  isFlagship?: boolean
  weights?: Record<string, number>
}

export type Distro = {
  id: string
  name: string
  url: string
  tagline: string
  baseTags: string[]
  flavors: DistroFlavor[]
  weights: Record<string, number>
  distroseaUrl?: string
  basedOn: string
  packageManager: string
  releaseModel: 'Rolling' | 'Fixed' | 'Atomic'
}

export const DISTRO_QUESTIONS = [
  {
    id: 'activity',
    label: 'What will you do most?',
    icon: 'Activity',
    options: [
      { id: 'general', label: 'Web, Office, General use', icon: 'Globe' },
      { id: 'gaming', label: 'Gaming (Steam, Proton, Lutris)', icon: 'Gamepad2' },
      { id: 'creative', label: 'Creative Pro (Video, Audio, 3D)', icon: 'Palette' },
      { id: 'dev', label: 'Software Development', icon: 'Code2' }
    ]
  },
  {
    id: 'gpu',
    label: 'What is your GPU architecture?',
    icon: 'Cpu',
    options: [
      { id: 'nvidia', label: 'NVIDIA (Needs proprietary drivers)', icon: 'Zap' },
      { id: 'amd_intel', label: 'AMD / Intel (Open source drivers)', icon: 'Cpu' },
      { id: 'old', label: 'Old hardware / Integrated graphics', icon: 'History' }
    ]
  },
  {
    id: 'device',
    label: 'Where are you installing it?',
    icon: 'Monitor',
    options: [
      { id: 'desktop', label: 'Desktop PC', icon: 'Monitor' },
      { id: 'laptop', label: 'Laptop', icon: 'Laptop' },
      { id: 'handheld', label: 'Handheld / Console (Steam Deck)', icon: 'Smartphone' }
    ]
  },
  {
    id: 'updates',
    label: 'How do you want updates?',
    icon: 'RefreshCw',
    options: [
      { id: 'stable', label: 'Stable & Predictable (Set and forget)', icon: 'ShieldCheck' },
      { id: 'rolling', label: 'Bleeding Edge (Rolling Release)', icon: 'Rocket' },
      { id: 'atomic', label: 'Unbreakable (Immutable / Atomic)', icon: 'Lock' }
    ]
  },
  {
    id: 'ui',
    label: 'Visual Paradigm',
    icon: 'Layout',
    options: [
      { id: 'traditional', label: 'Traditional (Windows-like)', icon: 'Layout' },
      { id: 'modern', label: 'Modern / Gesture-heavy (Mac/GNOME-like)', icon: 'AppWindow' },
      { id: 'tiling', label: 'Keyboard-centric / Tiling', icon: 'Columns' },
      { id: 'any', label: 'No preference', icon: 'Sparkles' }
    ]
  },
  {
    id: 'philosophy',
    label: 'Software Freedom',
    icon: 'Heart',
    options: [
      { id: 'functionality', label: 'Functionality first (Proprietary is fine)', icon: 'Plug' },
      { id: 'foss', label: 'Strictly Open Source (FOSS purist)', icon: 'Heart' }
    ]
  },
  {
    id: 'customization',
    label: 'Customization Depth',
    icon: 'Wand2',
    options: [
      { id: 'ready', label: 'Polished & ready out of the box', icon: 'CheckCircle2' },
      { id: 'canvas', label: 'Blank canvas (I want to build it)', icon: 'Eraser' }
    ]
  },
  {
    id: 'battery',
    label: 'Power Management',
    icon: 'Battery',
    options: [
      { id: 'important', label: 'Yes, maximum battery life', icon: 'BatteryCharging' },
      { id: 'dont_care', label: 'No, performance matters more', icon: 'Zap' }
    ]
  },
  {
    id: 'rollback',
    label: 'Snapshot / Rollback Needs',
    icon: 'Undo2',
    options: [
      { id: 'essential', label: 'Essential (Instantly undo a bad update)', icon: 'History' },
      { id: 'dont_care', label: 'Nice to have, not a dealbreaker', icon: 'ThumbsUp' }
    ]
  },
  {
    id: 'software',
    label: 'Software Access',
    icon: 'Package',
    options: [
      { id: 'curated', label: 'Curated App Store / Flatpaks', icon: 'ShoppingBag' },
      { id: 'aur_wild', label: 'The "Wild West" (AUR, compile from source)', icon: 'Flame' }
    ]
  }
]

const placeholder = '/images/distro-placeholder.svg'

export const DISTROS: Distro[] = [
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    url: 'https://ubuntu.com/download/desktop',
    tagline: 'Stable and polished with massive community support.',
    baseTags: ['beginner', 'stable'],
    distroseaUrl: 'https://distrosea.com/select/ubuntu/',
    basedOn: 'Debian',
    packageManager: 'APT / Snap',
    releaseModel: 'Fixed',
    weights: {
      general: 8,
      dev: 6,
      creative: 5,
      amd_intel: 7,
      desktop: 8,
      laptop: 8,
      stable: 9,
      functionality: 7,
      ready: 8,
      dont_care: 5,
      curated: 8
    },
    flavors: [
      {
        id: 'ubuntu-gnome',
        name: 'Ubuntu',
        desktop: 'GNOME',
        url: 'https://ubuntu.com/download/desktop',
        screenshot: 'https://assets.ubuntu.com/v1/da58d382-ubuntu-flavours-25.png',
        tags: ['gnome', 'beginner'],
        distroseaUrl: 'https://distrosea.com/select/ubuntu/',
        isFlagship: true,
        weights: { modern: 8, ready: 6, general: 5 }
      },
      {
        id: 'kubuntu',
        name: 'Kubuntu',
        desktop: 'KDE Plasma',
        url: 'https://kubuntu.org/download/',
        screenshot: 'https://kubuntu.org/images/banners/home.png',
        tags: ['kde', 'classic'],
        distroseaUrl: 'https://distrosea.com/select/kubuntu/',
        weights: { traditional: 8, ready: 5 }
      },
      {
        id: 'xubuntu',
        name: 'Xubuntu',
        desktop: 'Xfce',
        url: 'https://xubuntu.org/download/',
        screenshot: placeholder,
        tags: ['classic', 'performance', 'old'],
        distroseaUrl: 'https://distrosea.com/select/xubuntu/',
        weights: { traditional: 6, old: 9 }
      },
      {
        id: 'lubuntu',
        name: 'Lubuntu',
        desktop: 'LXQt',
        url: 'https://lubuntu.me/downloads/',
        screenshot: 'https://lubuntu.me/wp-content/uploads/2018/02/laptop.png',
        tags: ['performance', 'old'],
        distroseaUrl: 'https://distrosea.com/select/lubuntu/',
        weights: { traditional: 6, old: 10 }
      },
      {
        id: 'ubuntu-mate',
        name: 'Ubuntu MATE',
        desktop: 'MATE',
        url: 'https://ubuntu-mate.org/download/',
        screenshot: 'https://ubuntu-mate.org/images/homepage/01_familiar.png',
        tags: ['classic', 'old'],
        distroseaUrl: 'https://distrosea.com/select/ubuntumate/',
        weights: { traditional: 7, old: 8 }
      },
      {
        id: 'ubuntu-budgie',
        name: 'Ubuntu Budgie',
        desktop: 'Budgie',
        url: 'https://ubuntubudgie.org/downloads/',
        screenshot: 'https://ubuntubudgie.org/wp-content/uploads/2023/11/Ubuntu-Budgie-22.04-LTS-Desktop-1200x678.jpg',
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/ubuntubudgie/',
        weights: { modern: 6, traditional: 4 }
      },
      {
        id: 'ubuntu-cinnamon',
        name: 'Ubuntu Cinnamon',
        desktop: 'Cinnamon',
        url: 'https://ubuntucinnamon.org/download/',
        screenshot: 'https://ubuntucinnamon.org/wp-content/uploads/2024/02/LivePC.png',
        tags: ['classic', 'beginner'],
        distroseaUrl: 'https://distrosea.com/select/ubuntucinnamon/',
        weights: { traditional: 8, ready: 6 }
      },
      {
        id: 'ubuntu-unity',
        name: 'Ubuntu Unity',
        desktop: 'Unity',
        url: 'https://ubuntuunity.org/downloads/',
        screenshot: 'https://ubuntuunity.org/_astro/laptopnew.7f6d1f05_22rC53.webp.webp',
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/ubuntuunity/',
        weights: { modern: 5 }
      },
      {
        id: 'ubuntu-studio',
        name: 'Ubuntu Studio',
        desktop: 'Creative',
        url: 'https://ubuntustudio.org/download/',
        screenshot: 'https://ubuntustudio.org/wp-content/uploads/2020/10/7f66/Screenshot_20201007_163530.png',
        tags: ['creative'],
        distroseaUrl: 'https://distrosea.com/select/ubuntustudio/',
        weights: { creative: 10, ready: 8 }
      },
      {
        id: 'ubuntu-kylin',
        name: 'Ubuntu Kylin',
        desktop: 'UKUI',
        url: 'https://www.ubuntukylin.com/downloads/download-en.html',
        screenshot: placeholder,
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/ubuntukylin/',
        weights: { traditional: 5 }
      },
      {
        id: 'edubuntu',
        name: 'Edubuntu',
        desktop: 'GNOME',
        url: 'https://edubuntu.org/download.html',
        screenshot: placeholder,
        tags: ['education'],
        distroseaUrl: 'https://distrosea.com/select/edubuntu/',
        weights: { general: 5, ready: 6 }
      }
    ]
  },
  {
    id: 'linux-mint',
    name: 'Linux Mint',
    url: 'https://www.linuxmint.com/download.php',
    tagline: 'Comfortable, classic, and friendly to Windows converts.',
    baseTags: ['beginner', 'classic', 'stable'],
    distroseaUrl: 'https://distrosea.com/select/linuxmint/',
    basedOn: 'Ubuntu',
    packageManager: 'APT / Flatpak',
    releaseModel: 'Fixed',
    weights: {
      general: 9,
      dev: 4,
      amd_intel: 7,
      old: 6,
      desktop: 8,
      laptop: 8,
      stable: 10,
      traditional: 10,
      functionality: 8,
      ready: 10,
      curated: 8
    },
    flavors: [
      {
        id: 'mint-cinnamon',
        name: 'Cinnamon',
        desktop: 'Cinnamon',
        url: 'https://www.linuxmint.com/download.php',
        screenshot: 'https://www.linuxmint.com/pictures/screenshots/zena/thumb_cinnamon.png',
        tags: ['classic', 'beginner'],
        isFlagship: true,
        weights: { traditional: 10, ready: 8, general: 5 }
      },
      {
        id: 'mint-xfce',
        name: 'Xfce',
        desktop: 'Xfce',
        url: 'https://www.linuxmint.com/download.php',
        screenshot: 'https://www.linuxmint.com/pictures/screenshots/zena/thumb_xfce.png',
        tags: ['performance', 'old'],
        weights: { traditional: 8, old: 10 }
      },
      {
        id: 'mint-mate',
        name: 'MATE',
        desktop: 'MATE',
        url: 'https://www.linuxmint.com/download.php',
        screenshot: 'https://www.linuxmint.com/pictures/screenshots/zena/thumb_mate.png',
        tags: ['classic', 'old'],
        weights: { traditional: 9, old: 8 }
      }
    ]
  },
  {
    id: 'fedora',
    name: 'Fedora',
    url: 'https://fedoraproject.org/workstation/',
    tagline: 'Fast, upstream, and polished with modern defaults.',
    baseTags: ['latest', 'gnome'],
    distroseaUrl: 'https://distrosea.com/select/fedora/',
    basedOn: 'Independent',
    packageManager: 'DNF / Flatpak',
    releaseModel: 'Fixed',
    weights: {
      dev: 9,
      general: 7,
      amd_intel: 9,
      desktop: 8,
      laptop: 9,
      stable: 5,
      rolling: 5,
      atomic: 3,
      modern: 8,
      foss: 8,
      ready: 7,
      important: 8,
      curated: 7
    },
    flavors: [
      {
        id: 'fedora-workstation',
        name: 'Workstation',
        desktop: 'GNOME',
        url: 'https://fedoraproject.org/workstation/',
        screenshot: 'https://fedoraproject.org/assets/images/workstation_framework.webp',
        tags: ['gnome', 'latest'],
        distroseaUrl: 'https://distrosea.com/select/fedora/',
        isFlagship: true,
        weights: { modern: 10, dev: 6 }
      },
      {
        id: 'fedora-kde',
        name: 'KDE Plasma',
        desktop: 'KDE Plasma',
        url: 'https://fedoraproject.org/kde/download/',
        screenshot: placeholder,
        tags: ['kde'],
        weights: { traditional: 6, dev: 5 }
      },
      {
        id: 'fedora-xfce',
        name: 'Xfce',
        desktop: 'Xfce',
        url: 'https://fedoraproject.org/spins/xfce/download',
        screenshot: 'https://fedoraproject.org/assets/images/spins/screenshot-xfce.jpg',
        tags: ['performance', 'old'],
        distroseaUrl: 'https://distrosea.com/select/fedora/',
        weights: { traditional: 6, old: 8 }
      },
      {
        id: 'fedora-cinnamon',
        name: 'Cinnamon',
        desktop: 'Cinnamon',
        url: 'https://fedoraproject.org/spins/cinnamon',
        screenshot: 'https://fedoraproject.org/assets/images/spins/screenshot-cinnamon.jpg',
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/',
        weights: { traditional: 8 }
      },
      {
        id: 'fedora-mate',
        name: 'MATE',
        desktop: 'MATE',
        url: 'https://fedoraproject.org/spins/mate',
        screenshot: 'https://fedoraproject.org/assets/images/spins/screenshot-mate.jpg',
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/',
        weights: { traditional: 7, old: 5 }
      },
      {
        id: 'fedora-sway',
        name: 'Sway',
        desktop: 'Sway',
        url: 'https://fedoraproject.org/spins/sway',
        screenshot: 'https://fedoraproject.org/assets/images/spins/screenshot-sway.jpg',
        tags: ['tiling'],
        distroseaUrl: 'https://distrosea.com/select/fedora/',
        weights: { tiling: 10, dev: 6 }
      },
      {
        id: 'fedora-budgie',
        name: 'Budgie',
        desktop: 'Budgie',
        url: 'https://fedoraproject.org/spins/budgie',
        screenshot: 'https://fedoraproject.org/assets/images/spins/screenshot-budgie.jpg',
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/',
        weights: { traditional: 5, modern: 5 }
      },
      {
        id: 'fedora-atomic-silverblue',
        name: 'Silverblue',
        desktop: 'GNOME (Atomic)',
        url: 'https://fedoraproject.org/atomic-desktops/silverblue/download',
        screenshot: placeholder,
        tags: ['gnome', 'atomic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/',
        weights: { atomic: 10, modern: 8, rollback: 8 }
      },
      {
        id: 'fedora-atomic-kinoite',
        name: 'Kinoite',
        desktop: 'KDE (Atomic)',
        url: 'https://fedoraproject.org/atomic-desktops/kinoite/download',
        screenshot: placeholder,
        tags: ['kde', 'atomic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/',
        weights: { atomic: 10, traditional: 6, rollback: 8 }
      },
      {
        id: 'fedora-atomic-sway',
        name: 'Sway Atomic',
        desktop: 'Sway (Atomic)',
        url: 'https://fedoraproject.org/atomic-desktops/sway/download',
        screenshot: placeholder,
        tags: ['tiling', 'atomic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/',
        weights: { atomic: 10, tiling: 10, rollback: 8 }
      }
    ]
  },
  {
    id: 'popos',
    name: 'Pop!_OS',
    url: 'https://system76.com/pop/download/',
    tagline: 'Productivity-first Ubuntu base with great hardware support.',
    baseTags: ['gaming', 'beginner', 'gnome'],
    distroseaUrl: 'https://distrosea.com/select/popos/',
    basedOn: 'Ubuntu',
    packageManager: 'APT / Flatpak',
    releaseModel: 'Fixed',
    weights: {
      gaming: 8,
      dev: 8,
      creative: 7,
      nvidia: 10,
      amd_intel: 7,
      laptop: 10,
      desktop: 8,
      stable: 7,
      modern: 8,
      tiling: 5,
      functionality: 9,
      ready: 9,
      important: 10,
      curated: 7
    },
    flavors: [
      {
        id: 'popos-cosmic',
        name: 'COSMIC',
        desktop: 'COSMIC',
        url: 'https://system76.com/pop/download/',
        screenshot:
          'https://cdn11.bigcommerce.com/s-pywjnxrcr2/images/stencil/original/image-manager/pop-hero-newr7.jpg',
        tags: ['gnome', 'performance'],
        distroseaUrl: 'https://distrosea.com/select/popos/',
        weights: { modern: 8, tiling: 6, ready: 6 }
      }
    ]
  },
  {
    id: 'arch',
    name: 'Arch Linux',
    url: 'https://archlinux.org/download/',
    tagline: 'Minimal base, total control, rolling release.',
    baseTags: ['rolling', 'advanced'],
    distroseaUrl: 'https://distrosea.com/select/archlinux/',
    basedOn: 'Independent',
    packageManager: 'Pacman / AUR',
    releaseModel: 'Rolling',
    weights: {
      dev: 8,
      gaming: 6,
      amd_intel: 8,
      nvidia: 4,
      desktop: 8,
      laptop: 6,
      rolling: 10,
      canvas: 10,
      aur_wild: 10
    },
    flavors: [
      {
        id: 'arch-base',
        name: 'Base Install',
        desktop: 'Choose your own',
        url: 'https://archlinux.org/download/',
        screenshot: placeholder,
        tags: ['rolling', 'advanced'],
        distroseaUrl: 'https://distrosea.com/select/archlinux/',
        weights: { canvas: 10, aur_wild: 10 }
      }
    ]
  },
  {
    id: 'endeavouros',
    name: 'EndeavourOS',
    url: 'https://endeavouros.com/',
    tagline: 'Arch power with an easier installer and community focus.',
    baseTags: ['rolling', 'intermediate'],
    distroseaUrl: 'https://distrosea.com/select/endeavouros/',
    basedOn: 'Arch Linux',
    packageManager: 'Pacman / AUR',
    releaseModel: 'Rolling',
    weights: {
      dev: 7,
      gaming: 7,
      amd_intel: 8,
      nvidia: 6,
      desktop: 8,
      laptop: 7,
      rolling: 9,
      canvas: 6,
      ready: 5,
      aur_wild: 9
    },
    flavors: [
      {
        id: 'endeavour-kde',
        name: 'KDE Plasma',
        desktop: 'KDE Plasma',
        url: 'https://endeavouros.com/',
        screenshot: 'https://i0.wp.com/endeavouros.com/wp-content/uploads/2022/06/slide-welcome-DEs.jpg',
        tags: ['kde'],
        distroseaUrl: 'https://distrosea.com/select/endeavouros/',
        weights: { traditional: 7, ready: 4 }
      },
      {
        id: 'endeavour-gnome',
        name: 'GNOME',
        desktop: 'GNOME',
        url: 'https://endeavouros.com/',
        screenshot: 'https://i0.wp.com/endeavouros.com/wp-content/uploads/2022/06/slide-community-DEs.jpg',
        tags: ['gnome'],
        distroseaUrl: 'https://distrosea.com/select/endeavouros/',
        weights: { modern: 8, ready: 4 }
      },
      {
        id: 'endeavour-tiling',
        name: 'i3 / Sway',
        desktop: 'Tiling',
        url: 'https://endeavouros.com/',
        screenshot: 'https://i0.wp.com/endeavouros.com/wp-content/uploads/2022/06/slide-welcome-easy-install.jpg',
        tags: ['tiling'],
        distroseaUrl: 'https://distrosea.com/select/endeavouros/',
        weights: { tiling: 10, canvas: 6 }
      }
    ]
  },
  {
    id: 'cachyos',
    name: 'CachyOS',
    url: 'https://cachyos.org/download/',
    tagline: 'Performance-tuned Arch with CPU-optimized packages.',
    baseTags: ['rolling', 'performance'],
    distroseaUrl: 'https://distrosea.com/select/cachyos/',
    basedOn: 'Arch Linux',
    packageManager: 'Pacman / AUR',
    releaseModel: 'Rolling',
    weights: {
      gaming: 9,
      dev: 7,
      amd_intel: 9,
      nvidia: 9,
      desktop: 9,
      handheld: 7,
      rolling: 9,
      functionality: 9,
      ready: 9,
      aur_wild: 9
    },
    flavors: [
      {
        id: 'cachyos-kde',
        name: 'KDE Plasma',
        desktop: 'KDE Plasma',
        url: 'https://cachyos.org/download/',
        screenshot: 'https://cachyos.org/_astro/kde.BnaypD8L_13lcLT.webp',
        tags: ['kde', 'performance'],
        distroseaUrl: 'https://distrosea.com/select/cachyos/',
        isFlagship: true,
        weights: { traditional: 6, gaming: 6 }
      },
      {
        id: 'cachyos-gnome',
        name: 'GNOME',
        desktop: 'GNOME',
        url: 'https://cachyos.org/download/',
        screenshot: 'https://cachyos.org/_astro/kde.BnaypD8L_13lcLT.webp',
        tags: ['gnome'],
        distroseaUrl: 'https://distrosea.com/select/cachyos/',
        weights: { modern: 8, gaming: 5 }
      },
      {
        id: 'cachyos-hyprland',
        name: 'Hyprland',
        desktop: 'Hyprland',
        url: 'https://cachyos.org/download/',
        screenshot: 'https://cachyos.org/_astro/kde.BnaypD8L_13lcLT.webp',
        tags: ['tiling', 'latest'],
        distroseaUrl: 'https://distrosea.com/select/cachyos/',
        weights: { tiling: 10, canvas: 5 }
      },
      {
        id: 'cachyos-cosmic',
        name: 'COSMIC',
        desktop: 'COSMIC',
        url: 'https://cachyos.org/download/',
        screenshot: 'https://cachyos.org/_astro/kde.BnaypD8L_13lcLT.webp',
        tags: ['latest'],
        distroseaUrl: 'https://distrosea.com/select/cachyos/',
        weights: { modern: 9 }
      },
      {
        id: 'cachyos-handheld',
        name: 'Handheld',
        desktop: 'KDE',
        url: 'https://cachyos.org/download/',
        screenshot: 'https://cachyos.org/_astro/handheld.DYNjpH4Q_bJDzA.webp',
        tags: ['gaming'],
        distroseaUrl: 'https://distrosea.com/select/cachyos/',
        weights: { handheld: 10, gaming: 9 }
      }
    ]
  },
  {
    id: 'bazzite',
    name: 'Bazzite',
    url: 'https://bazzite.gg/#image-picker',
    tagline: 'SteamOS-like gaming with Fedora Atomic base.',
    baseTags: ['gaming', 'atomic'],
    distroseaUrl: 'https://distrosea.com/select/bazzite/',
    basedOn: 'Fedora (Atomic)',
    packageManager: 'rpm-ostree / Flatpak',
    releaseModel: 'Atomic',
    weights: {
      gaming: 10,
      general: 5,
      amd_intel: 9,
      nvidia: 8,
      handheld: 10,
      desktop: 8,
      atomic: 10,
      functionality: 8,
      ready: 10,
      rollback: 9,
      curated: 9
    },
    flavors: [
      {
        id: 'bazzite-kde',
        name: 'KDE',
        desktop: 'KDE Plasma',
        url: 'https://bazzite.gg/#image-picker',
        screenshot: 'https://bazzite.gg/content/uploads/2025/07/kde.webp',
        tags: ['gaming', 'kde'],
        distroseaUrl: 'https://distrosea.com/select/bazzite/',
        isFlagship: true,
        weights: { traditional: 7, desktop: 6 }
      },
      {
        id: 'bazzite-gnome',
        name: 'GNOME',
        desktop: 'GNOME',
        url: 'https://bazzite.gg/#image-picker',
        screenshot: 'https://bazzite.gg/content/uploads/2025/07/gnome2.webp',
        tags: ['gaming', 'gnome'],
        distroseaUrl: 'https://distrosea.com/select/bazzite/',
        weights: { modern: 8, desktop: 6 }
      },
      {
        id: 'bazzite-steam',
        name: 'Steam Gaming Mode',
        desktop: 'Gamescope',
        url: 'https://bazzite.gg/#image-picker',
        screenshot: 'https://bazzite.gg/content/uploads/2024/03/steam.webp',
        tags: ['gaming'],
        distroseaUrl: 'https://distrosea.com/select/bazzite/',
        weights: { handheld: 10, gaming: 10 }
      }
    ]
  },
  {
    id: 'nobara',
    name: 'Nobara',
    url: 'https://nobaraproject.org/',
    tagline: 'Fedora tuned for gaming, streaming, and creators.',
    baseTags: ['gaming', 'performance'],
    distroseaUrl: 'https://distrosea.com/select/nobara/',
    basedOn: 'Fedora',
    packageManager: 'DNF / Flatpak',
    releaseModel: 'Fixed',
    weights: {
      gaming: 9,
      creative: 8,
      nvidia: 9,
      amd_intel: 8,
      desktop: 9,
      laptop: 6,
      stable: 6,
      functionality: 10,
      ready: 8,
      curated: 7
    },
    flavors: [
      {
        id: 'nobara-official',
        name: 'Official',
        desktop: 'KDE',
        url: 'https://nobaraproject.org/download.html',
        screenshot: 'https://nobaraproject.org/img/screenshots/OFFICIAL.png',
        tags: ['gaming', 'kde'],
        distroseaUrl: 'https://distrosea.com/select/nobara/',
        isFlagship: true,
        weights: { traditional: 6, ready: 8 }
      },
      {
        id: 'nobara-gnome',
        name: 'GNOME',
        desktop: 'GNOME',
        url: 'https://nobaraproject.org/download.html',
        screenshot: 'https://nobaraproject.org/img/screenshots/GNOME.png',
        tags: ['gnome'],
        distroseaUrl: 'https://distrosea.com/select/nobara/',
        weights: { modern: 8, ready: 6 }
      },
      {
        id: 'nobara-kde',
        name: 'KDE',
        desktop: 'KDE',
        url: 'https://nobaraproject.org/download.html',
        screenshot: 'https://nobaraproject.org/img/screenshots/KDE.png',
        tags: ['kde'],
        distroseaUrl: 'https://distrosea.com/select/nobara/',
        weights: { traditional: 7, ready: 6 }
      }
    ]
  },
  {
    id: 'zorin',
    name: 'Zorin OS',
    url: 'https://www.zorin.com/os/download/',
    tagline: 'Polished Windows-like experience with great defaults.',
    baseTags: ['beginner', 'classic'],
    distroseaUrl: 'https://distrosea.com/select/zorin/',
    basedOn: 'Ubuntu',
    packageManager: 'APT / Flatpak',
    releaseModel: 'Fixed',
    weights: {
      general: 9,
      creative: 5,
      amd_intel: 7,
      old: 8,
      desktop: 8,
      laptop: 8,
      stable: 9,
      traditional: 10,
      functionality: 8,
      ready: 10,
      curated: 8
    },
    flavors: [
      {
        id: 'zorin-core',
        name: 'Core',
        desktop: 'GNOME',
        url: 'https://www.zorin.com/os/download/',
        screenshot: 'https://assets.zorincdn.com/zorin.com/images/home/hero/18.png',
        tags: ['beginner'],
        distroseaUrl: 'https://distrosea.com/select/zorin/',
        isFlagship: true,
        weights: { traditional: 8, ready: 9 }
      }
    ]
  },
  {
    id: 'debian',
    name: 'Debian',
    url: 'https://www.debian.org/CD/live/',
    tagline: 'Rock-solid base with long-term stability.',
    baseTags: ['stable'],
    distroseaUrl: 'https://distrosea.com/select/debian/',
    basedOn: 'Independent',
    packageManager: 'APT',
    releaseModel: 'Fixed',
    weights: {
      general: 7,
      dev: 8,
      amd_intel: 9,
      old: 8,
      nvidia: 2,
      desktop: 8,
      laptop: 6,
      stable: 10,
      foss: 10,
      canvas: 6,
      curated: 8
    },
    flavors: [
      {
        id: 'debian-gnome',
        name: 'GNOME',
        desktop: 'GNOME',
        url: 'https://www.debian.org/CD/live/',
        screenshot: placeholder,
        tags: ['gnome', 'stable'],
        distroseaUrl: 'https://distrosea.com/select/debian/',
        weights: { modern: 8 }
      },
      {
        id: 'debian-kde',
        name: 'KDE',
        desktop: 'KDE Plasma',
        url: 'https://www.debian.org/CD/live/',
        screenshot: placeholder,
        tags: ['kde', 'stable'],
        distroseaUrl: 'https://distrosea.com/select/debian/',
        weights: { traditional: 7 }
      },
      {
        id: 'debian-xfce',
        name: 'Xfce',
        desktop: 'Xfce',
        url: 'https://www.debian.org/CD/live/',
        screenshot: placeholder,
        tags: ['performance', 'old'],
        distroseaUrl: 'https://distrosea.com/select/debian/',
        weights: { traditional: 6, old: 10 }
      },
      {
        id: 'debian-cinnamon',
        name: 'Cinnamon',
        desktop: 'Cinnamon',
        url: 'https://www.debian.org/CD/live/',
        screenshot: placeholder,
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/debian/',
        weights: { traditional: 8 }
      },
      {
        id: 'debian-mate',
        name: 'MATE',
        desktop: 'MATE',
        url: 'https://www.debian.org/CD/live/',
        screenshot: placeholder,
        tags: ['classic', 'old'],
        distroseaUrl: 'https://distrosea.com/select/debian/',
        weights: { traditional: 7, old: 8 }
      }
    ]
  },
  {
    id: 'pikaos',
    name: 'PikaOS',
    url: 'https://pika-os.com/',
    tagline: 'Ubuntu-based gaming distro tuned for low latency.',
    baseTags: ['gaming', 'latest'],
    distroseaUrl: 'https://distrosea.com/select/pikaos/',
    basedOn: 'Ubuntu',
    packageManager: 'APT / Flatpak',
    releaseModel: 'Fixed',
    weights: {
      gaming: 9,
      creative: 6,
      nvidia: 8,
      amd_intel: 8,
      desktop: 8,
      laptop: 6,
      stable: 5,
      rolling: 4,
      functionality: 9,
      ready: 8,
      curated: 7
    },
    flavors: [
      {
        id: 'pikaos-gnome',
        name: 'Default',
        desktop: 'GNOME',
        url: 'https://pika-os.com/',
        screenshot: placeholder,
        tags: ['gaming', 'gnome'],
        distroseaUrl: 'https://distrosea.com/select/pikaos/',
        weights: { modern: 8, gaming: 8 }
      }
    ]
  },
  {
    id: 'opensuse',
    name: 'openSUSE',
    url: 'https://www.opensuse.org/',
    tagline: 'The choice for sysadmins and developers with unique configuration tools.',
    baseTags: ['stable', 'rolling', 'advanced'],
    distroseaUrl: 'https://distrosea.com/select/opensuse/',
    basedOn: 'Independent',
    packageManager: 'Zypper / Flatpak',
    releaseModel: 'Rolling',
    weights: {
      dev: 9,
      general: 7,
      amd_intel: 8,
      nvidia: 5,
      desktop: 8,
      laptop: 7,
      rolling: 7,
      stable: 7,
      ready: 6,
      canvas: 5,
      rollback: 10,
      curated: 7
    },
    flavors: [
      {
        id: 'tumbleweed-kde',
        name: 'Tumbleweed (Rolling)',
        desktop: 'KDE Plasma',
        url: 'https://get.opensuse.org/tumbleweed/',
        screenshot: placeholder,
        tags: ['rolling', 'kde', 'latest'],
        distroseaUrl: 'https://distrosea.com/select/opensusetumbleweed/',
        isFlagship: true,
        weights: { traditional: 7, rolling: 9 }
      },
      {
        id: 'leap-kde',
        name: 'Leap (Stable)',
        desktop: 'KDE Plasma',
        url: 'https://get.opensuse.org/leap/',
        screenshot: placeholder,
        tags: ['fixed', 'kde', 'stability'],
        distroseaUrl: 'https://distrosea.com/select/opensuse/',
        weights: { traditional: 7, stable: 9 }
      }
    ]
  },
  {
    id: 'nixos',
    name: 'NixOS',
    url: 'https://nixos.org/',
    tagline: 'Declarative, reproducible, and unbreakable system configuration.',
    baseTags: ['atomic', 'advanced', 'latest'],
    basedOn: 'Independent',
    packageManager: 'Nix',
    releaseModel: 'Atomic',
    weights: {
      dev: 10,
      general: 4,
      amd_intel: 8,
      nvidia: 6,
      desktop: 8,
      laptop: 8,
      atomic: 10,
      canvas: 10,
      rollback: 10,
      aur_wild: 8
    },
    flavors: [
      {
        id: 'nixos-gnome',
        name: 'GNOME Edition',
        desktop: 'GNOME',
        url: 'https://nixos.org/download.html',
        screenshot: placeholder,
        tags: ['gnome', 'atomic', 'advanced'],
        weights: { modern: 8 }
      },
      {
        id: 'nixos-kde',
        name: 'KDE Edition',
        desktop: 'KDE Plasma',
        url: 'https://nixos.org/download.html',
        screenshot: placeholder,
        tags: ['kde', 'atomic', 'advanced'],
        weights: { traditional: 7 }
      }
    ]
  },
  {
    id: 'manjaro',
    name: 'Manjaro',
    url: 'https://manjaro.org/',
    tagline: 'Accessible Arch-based distro with a focus on user-friendliness.',
    baseTags: ['rolling', 'beginner', 'intermediate'],
    distroseaUrl: 'https://distrosea.com/select/manjaro/',
    basedOn: 'Arch Linux',
    packageManager: 'Pacman / Pamac',
    releaseModel: 'Rolling',
    weights: {
      general: 8,
      gaming: 7,
      dev: 6,
      nvidia: 8,
      amd_intel: 8,
      desktop: 8,
      laptop: 7,
      rolling: 8,
      functionality: 8,
      ready: 7,
      aur_wild: 8
    },
    flavors: [
      {
        id: 'manjaro-kde',
        name: 'Plasma Edition',
        desktop: 'KDE Plasma',
        url: 'https://manjaro.org/download/',
        screenshot: placeholder,
        tags: ['kde', 'rolling'],
        distroseaUrl: 'https://distrosea.com/select/manjaro/',
        isFlagship: true,
        weights: { traditional: 7 }
      },
      {
        id: 'manjaro-gnome',
        name: 'GNOME Edition',
        desktop: 'GNOME',
        url: 'https://manjaro.org/download/',
        screenshot: placeholder,
        tags: ['gnome', 'rolling'],
        distroseaUrl: 'https://distrosea.com/select/manjaro/',
        weights: { modern: 8 }
      },
      {
        id: 'manjaro-xfce',
        name: 'XFCE Edition',
        desktop: 'XFCE',
        url: 'https://manjaro.org/download/',
        screenshot: placeholder,
        tags: ['classic', 'performance', 'old'],
        distroseaUrl: 'https://distrosea.com/select/manjaro/',
        weights: { traditional: 6, old: 8 }
      }
    ]
  }
]
