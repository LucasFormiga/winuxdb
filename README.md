# 🍷 WinuxDB

WinuxDB is the definitive community-driven compatibility index for Windows applications on Linux. Inspired by projects like ProtonDB, we aim to eliminate "compatibility anxiety" by providing clear, community-verified data on how productivity, creative, and utility apps behave under Wine and Proton.

**Live at:** [winuxdb.com](https://winuxdb.com)

---

## 🚀 Mission

The biggest hurdle for most users switching to Linux isn't the interface—it's the fear of losing essential tools. WinuxDB maps the landscape of non-gaming software compatibility, helping users migrate with confidence or find viable native alternatives.

- **Crowdsourced Intelligence**: Data directly from users, for users.
- **Distro Guidance**: A smart quiz to match your workflow with the right Linux distribution.
- **Multilingual**: Native support for English, Português, and Español.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 🤝 Contributing

We love contributions! WinuxDB is built by the community. Here’s how you can help:

### 1. Update App Data
The core of WinuxDB is the `src/lib/data/apps.jsonl` file.
- **To report an app**: Add or update an entry in this JSONL file via a Pull Request.
- **Format**: Ensure you follow the existing JSON structure (name, compatibility, author, etc.).
- **Criteria**: We prioritize functional accuracy. If an app has multiple reports, we keep the one reflecting the highest stable compatibility.

### 2. Code & Design
- **Setup**:
  ```bash
  npm install
  npm run dev
  ```
- **Guidelines**: We use **Biome** for linting and formatting. Run `npm run check` before submitting a PR.
- **Translations**: All strings must be added to `messages/*.json`. Never hardcode text in components.

### 3. Governance
WinuxDB follows a benevolent community model.
- **Discussions**: Use GitHub Discussions for feature requests or architectural changes.
- **Reviews**: All PRs require a peer review to maintain data integrity and code quality.

---

## 🌟 Good First Issues

Looking to get started? Try one of these:

- **[Data] Add Native Alternatives**: Many apps in `apps.jsonl` have empty `recommendedAlternatives`. Help users find Linux-native replacements!
- **[i18n] Localization Polish**: Audit `messages/*.json` for more natural phrasing in Portuguese or Spanish.
- **[UI] Responsive Refinements**: Improve the mobile experience of the Distro Quiz or the Apps Filter bar.
- **[UI] Add Missing App Icons**: Source and add missing app icons so listings feel complete and scannable.
- **[Testing] Increase Coverage**: Add unit tests for molecules or organisms in the `tests/` directory.
- **[SEO] Meta Tag Audit**: Ensure all high-value applications are accurately represented in our visually hidden SEO list in `AppsContent.tsx`.

---

## ⚖️ Legal Disclaimer

WinuxDB is an independent community project. We are not affiliated with, endorsed by, or sponsored by Microsoft Corporation, WineHQ, CodeWeavers, Valve Corporation (Proton), ProtonDB, or any software author listed in our database. Use the information provided at your own risk.

---

**Built with ❤️ for the Linux Community.**
