# 🍷 WinuxDB

WinuxDB is the definitive community-driven compatibility index for Windows applications on Linux. Inspired by projects like ProtonDB, we aim to eliminate "compatibility anxiety" by providing clear, community-verified data on how productivity, creative, and utility apps behave under Wine and Proton.

**Live at:** [winuxdb.com](https://winuxdb.com)

---

## 🚀 Key Features

WinuxDB helps users migrate to Linux with confidence by mapping the landscape of non-gaming software compatibility.

- **Real-time Reporting**: Sign in, create a hardware profile, and share your app compatibility experiences instantly.
- **Hardware Profiles**: Save your system specs (Distro, Kernel, DE, GPU) once and reuse them for fast, accurate reporting.
- **Crowdsourced Intelligence**: Data directly from users, processed into meaningful compatibility ratings.
- **Distro Guidance**: A smart, technical quiz to match your workflow with the right Linux distribution.
- **Community Safety**: Comprehensive guidelines and active moderation to maintain a safe, accurate, and helpful environment.
- **Multilingual**: Native support for English, Português, and Español.
- **Modern Stack**: Built for speed and accessibility with Next.js 16, TypeScript, and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js 24 LTS](https://nodejs.org/) (exact version in `.nvmrc`) and npm 11.19.1 or newer
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database/Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS + GoTrue)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Virtualization**: [TanStack Virtual v3](https://tanstack.com/virtual)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 🤝 Contributing

We love contributions! WinuxDB is built by the community. Here’s how you can help:

### 1. Submit Reports
The fastest way to contribute is by reporting how apps run on your system.
- Sign in to WinuxDB.
- Add your hardware profile in the **Account** section.
- Search for any app and click **Write a Review**.

### 2. Code & Design
- **Setup**:
  ```bash
  nvm install
  nvm use
  npm ci
  npm run dev
  ```
- **Security**: Run `npm run audit` for both production and development dependencies. See [the dependency security upgrade plan](docs/dependency-security.md) for the upgrade baseline and maintenance policy.
- **Guidelines**: We use **Biome** for linting and formatting. Run `npm run lint` before submitting a PR.
- **Translations**: All strings must be added to `messages/*.json`. We support English, Spanish, and Portuguese.

### 3. Report Issues
Found a bug or incorrect data? Use our [Bug Report Form](https://forms.gle/hySiJzrRHsmCySrW7).

---

## 🛡️ Community & Safety

We are committed to maintaining a high-quality, inclusive resource. Please review our:
- [Community Guidelines](https://winuxdb.com/guidelines)
- [Privacy Policy](https://winuxdb.com/privacy)
- [Terms of Service](https://winuxdb.com/terms)

---

## ⚖️ Legal Disclaimer

WinuxDB is an independent community project. We are not affiliated with, endorsed by, or sponsored by Microsoft Corporation, WineHQ, CodeWeavers, Valve Corporation (Proton), or any software author listed in our database. Use the information provided at your own risk.

---

**Built with ❤️ for the Linux Community.**
