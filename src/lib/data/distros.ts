export type DistroFlavor = {
  id: string
  name: string
  desktop: string
  url: string
  screenshot: string
  tags: string[]
  distroseaUrl?: string
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
}

export const DISTRO_QUESTIONS = [
  {
    id: 'priority',
    label: 'What matters most right now?',
    options: [
      { id: 'stability', label: 'Stability and long-term support' },
      { id: 'gaming', label: 'Gaming performance' },
      { id: 'latest', label: 'Latest features' },
      { id: 'performance', label: 'Speed on any hardware' }
    ]
  },
  {
    id: 'experience',
    label: 'How comfortable are you with Linux?',
    options: [
      { id: 'beginner', label: 'New here' },
      { id: 'intermediate', label: 'Comfortable' },
      { id: 'advanced', label: 'Power user' }
    ]
  },
  {
    id: 'desktop',
    label: 'Preferred desktop style',
    options: [
      { id: 'gnome', label: 'Clean and focused (GNOME)' },
      { id: 'kde', label: 'Flexible and familiar (KDE)' },
      { id: 'tiling', label: 'Tiling / keyboard-driven' },
      { id: 'classic', label: 'Traditional layout' },
      { id: 'any', label: 'No preference' }
    ]
  },
  {
    id: 'hardware',
    label: 'How old is your hardware?',
    options: [
      { id: 'new', label: 'New or high-end' },
      { id: 'mid', label: 'Mid-range' },
      { id: 'old', label: 'Older or low-power' }
    ]
  },
  {
    id: 'rolling',
    label: 'Update style',
    options: [
      { id: 'fixed', label: 'Predictable releases' },
      { id: 'rolling', label: 'Rolling / always fresh' },
      { id: 'atomic', label: 'Immutable / atomic' }
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
    weights: {
      stability: 6,
      beginner: 6,
      fixed: 5,
      gnome: 4,
      classic: 3,
      performance: 2
    },
    flavors: [
      {
        id: 'ubuntu-gnome',
        name: 'Ubuntu',
        desktop: 'GNOME',
        url: 'https://ubuntu.com/download/desktop',
        screenshot: 'https://assets.ubuntu.com/v1/da58d382-ubuntu-flavours-25.png',
        tags: ['gnome', 'beginner'],
        distroseaUrl: 'https://distrosea.com/select/ubuntu/'
      },
      {
        id: 'kubuntu',
        name: 'Kubuntu',
        desktop: 'KDE Plasma',
        url: 'https://kubuntu.org/download/',
        screenshot: 'https://kubuntu.org/images/banners/home.png',
        tags: ['kde', 'classic'],
        distroseaUrl: 'https://distrosea.com/select/kubuntu/'
      },
      {
        id: 'xubuntu',
        name: 'Xubuntu',
        desktop: 'Xfce',
        url: 'https://xubuntu.org/download/',
        screenshot: placeholder,
        tags: ['classic', 'performance', 'old'],
        distroseaUrl: 'https://distrosea.com/select/xubuntu/'
      },
      {
        id: 'lubuntu',
        name: 'Lubuntu',
        desktop: 'LXQt',
        url: 'https://lubuntu.me/downloads/',
        screenshot: 'https://lubuntu.me/wp-content/uploads/2018/02/laptop.png',
        tags: ['performance', 'old'],
        distroseaUrl: 'https://distrosea.com/select/lubuntu/'
      },
      {
        id: 'ubuntu-mate',
        name: 'Ubuntu MATE',
        desktop: 'MATE',
        url: 'https://ubuntu-mate.org/download/',
        screenshot: 'https://ubuntu-mate.org/images/homepage/01_familiar.png',
        tags: ['classic', 'old'],
        distroseaUrl: 'https://distrosea.com/select/ubuntumate/'
      },
      {
        id: 'ubuntu-budgie',
        name: 'Ubuntu Budgie',
        desktop: 'Budgie',
        url: 'https://ubuntubudgie.org/downloads/',
        screenshot: 'https://ubuntubudgie.org/wp-content/uploads/2023/11/Ubuntu-Budgie-22.04-LTS-Desktop-1200x678.jpg',
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/ubuntubudgie/'
      },
      {
        id: 'ubuntu-cinnamon',
        name: 'Ubuntu Cinnamon',
        desktop: 'Cinnamon',
        url: 'https://ubuntucinnamon.org/download/',
        screenshot: 'https://ubuntucinnamon.org/wp-content/uploads/2024/02/LivePC.png',
        tags: ['classic', 'beginner'],
        distroseaUrl: 'https://distrosea.com/select/ubuntucinnamon/'
      },
      {
        id: 'ubuntu-unity',
        name: 'Ubuntu Unity',
        desktop: 'Unity',
        url: 'https://ubuntuunity.org/downloads/',
        screenshot: 'https://ubuntuunity.org/_astro/laptopnew.7f6d1f05_22rC53.webp.webp',
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/ubuntuunity/'
      },
      {
        id: 'ubuntu-studio',
        name: 'Ubuntu Studio',
        desktop: 'Creative',
        url: 'https://ubuntustudio.org/download/',
        screenshot: 'https://ubuntustudio.org/wp-content/uploads/2020/10/7f66/Screenshot_20201007_163530.png',
        tags: ['creative'],
        distroseaUrl: 'https://distrosea.com/select/ubuntustudio/'
      },
      {
        id: 'ubuntu-kylin',
        name: 'Ubuntu Kylin',
        desktop: 'UKUI',
        url: 'https://www.ubuntukylin.com/downloads/download-en.html',
        screenshot: placeholder,
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/ubuntukylin/'
      },
      {
        id: 'edubuntu',
        name: 'Edubuntu',
        desktop: 'GNOME',
        url: 'https://edubuntu.org/download.html',
        screenshot: placeholder,
        tags: ['education'],
        distroseaUrl: 'https://distrosea.com/select/edubuntu/'
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
    weights: {
      stability: 7,
      beginner: 6,
      classic: 5,
      fixed: 5,
      old: 4,
      performance: 2
    },
    flavors: [
      {
        id: 'mint-cinnamon',
        name: 'Cinnamon',
        desktop: 'Cinnamon',
        url: 'https://www.linuxmint.com/download.php',
        screenshot: 'https://www.linuxmint.com/pictures/screenshots/zena/thumb_cinnamon.png',
        tags: ['classic', 'beginner']
      },
      {
        id: 'mint-xfce',
        name: 'Xfce',
        desktop: 'Xfce',
        url: 'https://www.linuxmint.com/download.php',
        screenshot: 'https://www.linuxmint.com/pictures/screenshots/zena/thumb_xfce.png',
        tags: ['performance', 'old']
      },
      {
        id: 'mint-mate',
        name: 'MATE',
        desktop: 'MATE',
        url: 'https://www.linuxmint.com/download.php',
        screenshot: 'https://www.linuxmint.com/pictures/screenshots/zena/thumb_mate.png',
        tags: ['classic', 'old']
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
    weights: {
      latest: 6,
      gnome: 5,
      fixed: 3,
      intermediate: 4,
      stability: 3,
      gaming: 3,
      performance: 3
    },
    flavors: [
      {
        id: 'fedora-workstation',
        name: 'Workstation',
        desktop: 'GNOME',
        url: 'https://fedoraproject.org/workstation/',
        screenshot: 'https://fedoraproject.org/assets/images/workstation_framework.webp',
        tags: ['gnome', 'latest'],
        distroseaUrl: 'https://distrosea.com/select/fedora/'
      },
      {
        id: 'fedora-kde',
        name: 'KDE Plasma',
        desktop: 'KDE Plasma',
        url: 'https://fedoraproject.org/kde/download/',
        screenshot: placeholder,
        tags: ['kde']
      },
      {
        id: 'fedora-xfce',
        name: 'Xfce',
        desktop: 'Xfce',
        url: 'https://fedoraproject.org/spins/xfce/download',
        screenshot: 'https://fedoraproject.org/assets/images/spins/screenshot-xfce.jpg',
        tags: ['performance', 'old'],
        distroseaUrl: 'https://distrosea.com/select/fedora/'
      },
      {
        id: 'fedora-cinnamon',
        name: 'Cinnamon',
        desktop: 'Cinnamon',
        url: 'https://fedoraproject.org/spins/cinnamon',
        screenshot: 'https://fedoraproject.org/assets/images/spins/screenshot-cinnamon.jpg',
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/'
      },
      {
        id: 'fedora-mate',
        name: 'MATE',
        desktop: 'MATE',
        url: 'https://fedoraproject.org/spins/mate',
        screenshot: 'https://fedoraproject.org/assets/images/spins/screenshot-mate.jpg',
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/'
      },
      {
        id: 'fedora-sway',
        name: 'Sway',
        desktop: 'Sway',
        url: 'https://fedoraproject.org/spins/sway',
        screenshot: 'https://fedoraproject.org/assets/images/spins/screenshot-sway.jpg',
        tags: ['tiling'],
        distroseaUrl: 'https://distrosea.com/select/fedora/'
      },
      {
        id: 'fedora-budgie',
        name: 'Budgie',
        desktop: 'Budgie',
        url: 'https://fedoraproject.org/spins/budgie',
        screenshot: 'https://fedoraproject.org/assets/images/spins/screenshot-budgie.jpg',
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/'
      },
      {
        id: 'fedora-atomic-silverblue',
        name: 'Silverblue',
        desktop: 'GNOME (Atomic)',
        url: 'https://fedoraproject.org/atomic-desktops/silverblue/download',
        screenshot: placeholder,
        tags: ['gnome', 'atomic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/'
      },
      {
        id: 'fedora-atomic-kinoite',
        name: 'Kinoite',
        desktop: 'KDE (Atomic)',
        url: 'https://fedoraproject.org/atomic-desktops/kinoite/download',
        screenshot: placeholder,
        tags: ['kde', 'atomic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/'
      },
      {
        id: 'fedora-atomic-sway',
        name: 'Sway Atomic',
        desktop: 'Sway (Atomic)',
        url: 'https://fedoraproject.org/atomic-desktops/sway/download',
        screenshot: placeholder,
        tags: ['tiling', 'atomic'],
        distroseaUrl: 'https://distrosea.com/select/fedora/'
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
    weights: {
      gaming: 6,
      beginner: 5,
      gnome: 4,
      performance: 4,
      fixed: 3,
      latest: 3
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
        distroseaUrl: 'https://distrosea.com/select/popos/'
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
    weights: {
      rolling: 7,
      advanced: 7,
      latest: 5,
      performance: 5,
      tiling: 2
    },
    flavors: [
      {
        id: 'arch-base',
        name: 'Base Install',
        desktop: 'Choose your own',
        url: 'https://archlinux.org/download/',
        screenshot: placeholder,
        tags: ['rolling', 'advanced'],
        distroseaUrl: 'https://distrosea.com/select/archlinux/'
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
    weights: {
      rolling: 6,
      intermediate: 5,
      tiling: 3,
      latest: 4,
      performance: 3
    },
    flavors: [
      {
        id: 'endeavour-kde',
        name: 'KDE Plasma',
        desktop: 'KDE Plasma',
        url: 'https://endeavouros.com/',
        screenshot: 'https://i0.wp.com/endeavouros.com/wp-content/uploads/2022/06/slide-welcome-DEs.jpg',
        tags: ['kde'],
        distroseaUrl: 'https://distrosea.com/select/endeavouros/'
      },
      {
        id: 'endeavour-gnome',
        name: 'GNOME',
        desktop: 'GNOME',
        url: 'https://endeavouros.com/',
        screenshot: 'https://i0.wp.com/endeavouros.com/wp-content/uploads/2022/06/slide-community-DEs.jpg',
        tags: ['gnome'],
        distroseaUrl: 'https://distrosea.com/select/endeavouros/'
      },
      {
        id: 'endeavour-tiling',
        name: 'i3 / Sway',
        desktop: 'Tiling',
        url: 'https://endeavouros.com/',
        screenshot: 'https://i0.wp.com/endeavouros.com/wp-content/uploads/2022/06/slide-welcome-easy-install.jpg',
        tags: ['tiling'],
        distroseaUrl: 'https://distrosea.com/select/endeavouros/'
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
    weights: {
      performance: 7,
      rolling: 6,
      latest: 5,
      gaming: 3,
      advanced: 3
    },
    flavors: [
      {
        id: 'cachyos-kde',
        name: 'KDE Plasma',
        desktop: 'KDE Plasma',
        url: 'https://cachyos.org/download/',
        screenshot: 'https://cachyos.org/_astro/kde.BnaypD8L_13lcLT.webp',
        tags: ['kde', 'performance'],
        distroseaUrl: 'https://distrosea.com/select/cachyos/'
      },
      {
        id: 'cachyos-gnome',
        name: 'GNOME',
        desktop: 'GNOME',
        url: 'https://cachyos.org/download/',
        screenshot: 'https://cachyos.org/_astro/kde.BnaypD8L_13lcLT.webp',
        tags: ['gnome'],
        distroseaUrl: 'https://distrosea.com/select/cachyos/'
      },
      {
        id: 'cachyos-hyprland',
        name: 'Hyprland',
        desktop: 'Hyprland',
        url: 'https://cachyos.org/download/',
        screenshot: 'https://cachyos.org/_astro/kde.BnaypD8L_13lcLT.webp',
        tags: ['tiling', 'latest'],
        distroseaUrl: 'https://distrosea.com/select/cachyos/'
      },
      {
        id: 'cachyos-cosmic',
        name: 'COSMIC',
        desktop: 'COSMIC',
        url: 'https://cachyos.org/download/',
        screenshot: 'https://cachyos.org/_astro/kde.BnaypD8L_13lcLT.webp',
        tags: ['latest'],
        distroseaUrl: 'https://distrosea.com/select/cachyos/'
      },
      {
        id: 'cachyos-handheld',
        name: 'Handheld',
        desktop: 'KDE',
        url: 'https://cachyos.org/download/',
        screenshot: 'https://cachyos.org/_astro/handheld.DYNjpH4Q_bJDzA.webp',
        tags: ['gaming'],
        distroseaUrl: 'https://distrosea.com/select/cachyos/'
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
    weights: {
      gaming: 9,
      atomic: 7,
      performance: 5,
      kde: 4,
      gnome: 4,
      beginner: 4
    },
    flavors: [
      {
        id: 'bazzite-kde',
        name: 'KDE',
        desktop: 'KDE Plasma',
        url: 'https://bazzite.gg/#image-picker',
        screenshot: 'https://bazzite.gg/content/uploads/2025/07/kde.webp',
        tags: ['gaming', 'kde'],
        distroseaUrl: 'https://distrosea.com/select/bazzite/'
      },
      {
        id: 'bazzite-gnome',
        name: 'GNOME',
        desktop: 'GNOME',
        url: 'https://bazzite.gg/#image-picker',
        screenshot: 'https://bazzite.gg/content/uploads/2025/07/gnome2.webp',
        tags: ['gaming', 'gnome'],
        distroseaUrl: 'https://distrosea.com/select/bazzite/'
      },
      {
        id: 'bazzite-steam',
        name: 'Steam Gaming Mode',
        desktop: 'Gamescope',
        url: 'https://bazzite.gg/#image-picker',
        screenshot: 'https://bazzite.gg/content/uploads/2024/03/steam.webp',
        tags: ['gaming'],
        distroseaUrl: 'https://distrosea.com/select/bazzite/'
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
    weights: {
      gaming: 7,
      performance: 4,
      latest: 4,
      intermediate: 2,
      fixed: 1,
      kde: 2
    },
    flavors: [
      {
        id: 'nobara-official',
        name: 'Official',
        desktop: 'KDE',
        url: 'https://nobaraproject.org/download.html',
        screenshot: 'https://nobaraproject.org/img/screenshots/OFFICIAL.png',
        tags: ['gaming', 'kde'],
        distroseaUrl: 'https://distrosea.com/select/nobara/'
      },
      {
        id: 'nobara-gnome',
        name: 'GNOME',
        desktop: 'GNOME',
        url: 'https://nobaraproject.org/download.html',
        screenshot: 'https://nobaraproject.org/img/screenshots/GNOME.png',
        tags: ['gnome'],
        distroseaUrl: 'https://distrosea.com/select/nobara/'
      },
      {
        id: 'nobara-kde',
        name: 'KDE',
        desktop: 'KDE',
        url: 'https://nobaraproject.org/download.html',
        screenshot: 'https://nobaraproject.org/img/screenshots/KDE.png',
        tags: ['kde'],
        distroseaUrl: 'https://distrosea.com/select/nobara/'
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
    weights: {
      beginner: 6,
      classic: 4,
      stability: 4,
      fixed: 4,
      performance: 1
    },
    flavors: [
      {
        id: 'zorin-core',
        name: 'Core',
        desktop: 'GNOME',
        url: 'https://www.zorin.com/os/download/',
        screenshot: 'https://assets.zorincdn.com/zorin.com/images/home/hero/18.png',
        tags: ['beginner'],
        distroseaUrl: 'https://distrosea.com/select/zorin/'
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
    weights: {
      stability: 8,
      fixed: 7,
      old: 4,
      performance: 1
    },
    flavors: [
      {
        id: 'debian-gnome',
        name: 'GNOME',
        desktop: 'GNOME',
        url: 'https://www.debian.org/CD/live/',
        screenshot: placeholder,
        tags: ['gnome', 'stable'],
        distroseaUrl: 'https://distrosea.com/select/debian/'
      },
      {
        id: 'debian-kde',
        name: 'KDE',
        desktop: 'KDE Plasma',
        url: 'https://www.debian.org/CD/live/',
        screenshot: placeholder,
        tags: ['kde', 'stable'],
        distroseaUrl: 'https://distrosea.com/select/debian/'
      },
      {
        id: 'debian-xfce',
        name: 'Xfce',
        desktop: 'Xfce',
        url: 'https://www.debian.org/CD/live/',
        screenshot: placeholder,
        tags: ['performance', 'old'],
        distroseaUrl: 'https://distrosea.com/select/debian/'
      },
      {
        id: 'debian-cinnamon',
        name: 'Cinnamon',
        desktop: 'Cinnamon',
        url: 'https://www.debian.org/CD/live/',
        screenshot: placeholder,
        tags: ['classic'],
        distroseaUrl: 'https://distrosea.com/select/debian/'
      },
      {
        id: 'debian-mate',
        name: 'MATE',
        desktop: 'MATE',
        url: 'https://www.debian.org/CD/live/',
        screenshot: placeholder,
        tags: ['classic', 'old'],
        distroseaUrl: 'https://distrosea.com/select/debian/'
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
    weights: {
      gaming: 6,
      performance: 4,
      latest: 4,
      gnome: 3,
      fixed: 2
    },
    flavors: [
      {
        id: 'pikaos-gnome',
        name: 'Default',
        desktop: 'GNOME',
        url: 'https://pika-os.com/',
        screenshot: placeholder,
        tags: ['gaming', 'gnome'],
        distroseaUrl: 'https://distrosea.com/select/pikaos/'
      }
    ]
  }
]
