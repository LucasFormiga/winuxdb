import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ubuntubudgie.org" },
      { protocol: "https", hostname: "ubuntucinnamon.org" },
      { protocol: "https", hostname: "ubuntuunity.org" },
      { protocol: "https", hostname: "ubuntustudio.org" },
      { protocol: "https", hostname: "assets.ubuntu.com" },
      { protocol: "https", hostname: "kubuntu.org" },
      { protocol: "https", hostname: "lubuntu.me" },
      { protocol: "https", hostname: "ubuntu-mate.org" },
      { protocol: "https", hostname: "www.linuxmint.com" },
      { protocol: "https", hostname: "fedoraproject.org" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "cachyos.org" },
      { protocol: "https", hostname: "bazzite.gg" },
      { protocol: "https", hostname: "nobaraproject.org" },
      { protocol: "https", hostname: "assets.zorincdn.com" },
      { protocol: "https", hostname: "cdn11.bigcommerce.com" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
