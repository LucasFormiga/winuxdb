# AI Guide for winuxdb

This file defines how agents should work in this codebase. Keep changes consistent with the conventions below.

## Stack
- Next.js 16 (App Router) with SSR
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui (components live in src/components/ui)
- Vitest + Testing Library
- Biome for linting/formatting

## Architecture (Atomic Design)
- Components live under src/components
- Use these layers:
  - atoms: basic UI primitives and small reusable pieces
  - molecules: simple compositions of atoms
  - organisms: sections or complex UI blocks
  - templates: page-level layouts without data fetching
- App Router pages remain in src/app
- shadcn/ui components must stay in src/components/ui

## Styling
- Use Tailwind CSS classes where possible
- Prefer CSS variables defined in src/app/globals.css
- Avoid inline styles unless required

## Testing
- Use Vitest for unit and component tests
- Use React Testing Library for rendering and assertions
- Test setup lives in tests/setup.ts

## Linting and formatting
- Use Biome scripts from package.json
- Prefer single quotes and no semicolons (Biome defaults)

## Conventions
- Keep imports using @/* alias
- Do not introduce ESLint, Prettier, or Jest
- Keep files under src/ unless there is a clear reason
