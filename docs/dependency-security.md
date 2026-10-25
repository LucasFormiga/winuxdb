# Dependency security upgrade

## Audit baseline (2026-10-24)

The committed dependency tree had 20 npm audit findings: 2 critical, 11 high,
and 7 moderate. Five affected the production dependency tree. An advisory match
does not establish that every vulnerable feature is reachable in the application.

| Scope | Affected packages | Mitigation |
| --- | --- | --- |
| Production | Next.js, sharp | Upgrade Next.js to 16.4.3 and refresh sharp to a patched release. Restrict remote image optimization to the exact HTTPS hosts used by the image catalog. |
| Production | Zod, source-map-js, baseline-browser-mapping | Upgrade Zod and refresh compatible transitive dependencies. |
| Development | @modelcontextprotocol/sdk, body-parser, brace-expansion, browserslist, fast-uri, hono, ip-address, proxy-addr, qs, shadcn, undici | Upgrade shadcn and refresh its dependency tree to patched releases. |
| Development | Vitest, @vitest/mocker, @vitest/coverage-v8, Vite | Upgrade Vitest and its coverage provider together to 5.0.5, with the Vite 8-compatible React plugin. |

The production advisories include conditional image-processing RCE, SSRF, and
resource-exhaustion vulnerabilities. Several development advisories require
exposing a development server or using features the application does not use;
they are still included in remediation.

## Compatibility-preserving plan

1. Use Node 24.22.1 (the latest LTS security release on the audit date) locally and
   in CI through `.nvmrc`. Require that patched Node 24 line in `engines`; keep
   `@types/node` on its latest 24.x release rather than targeting Node 26 APIs.
2. Upgrade every direct npm dependency to its latest stable release, pairing
   React with React DOM and Vitest with its coverage provider. Migrate tooling
   configuration and application APIs where required by major upgrades.
3. Refresh the lockfile using npm on Node 24. Keep transitive fixes within their
   parents' supported ranges; do not force unrelated major versions through
   overrides. Update existing PostCSS and esbuild overrides to secure patches.
4. Preserve local images and every current remote screenshot source while
   removing unrestricted HTTP/HTTPS image optimization. Add regression checks
   for catalog coverage and rejection of untrusted origins.
   Database-sourced remote app logos and screenshots render directly in the
   browser (`unoptimized`) so arbitrary existing catalog hosts do not break and
   cannot cause server-side image fetches. Local app images remain optimized.
5. Verify a reproducible clean install, full-tree and production-only audits,
   lint, type checking, component/unit tests, production build, and HTTP smoke
   checks. Do not suppress advisories or bypass peer dependency compatibility.
6. Review open PRs after verification. Incorporate useful updates; close
   superseded updates only once their replacements are committed and pushed.

## Ongoing maintenance

- The planned CI hardening audits the complete lockfile, including development
  dependencies, and fails on any reported severity. Publishing that separate
  workflow change requires a credential with GitHub `workflows` permission.
  A clean audit describes known advisories at the time of the check, not a
  guarantee that no undiscovered vulnerabilities exist.
- Dependabot checks npm and GitHub Actions weekly. React, Vitest, and Tailwind
  dependency families are grouped so paired packages can move together.
  The known-incompatible resolver 6.0.0 release is excluded, and Node type major
  upgrades are left to an explicit runtime migration.
- Before changing the Node LTS line, check Next.js, jsdom, Vite, Vitest, and
  Supabase engine requirements, update `.nvmrc` and `engines` together, and repeat
  the compatibility checks above.
- New remote screenshot origins must be added explicitly to `next.config.ts`;
  never restore wildcard hosts or enable local-IP optimization.

## Stable-release compatibility exception

`@hookform/resolvers` uses 5.9.2, the newest compatible stable 5.x release.
Version 6.0.0 fails npm 11.19.1 peer resolution both against the existing
lockfile and in a clean manifest-only install: its optional Effect 4 peer
conflicts with the Effect 3 adapters reached through `@typeschema/main`.
The application uses the Zod resolver, not those adapters. Do not bypass
the conflict with `--force` or `--legacy-peer-deps`; revisit 6.x when its
published peer dependency tree can be installed cleanly.

## Related migrations

- Vitest configuration is explicitly ESM (`vitest.config.mts`), and DOM
  matchers use the Vitest-specific Testing Library entry point.
- Lucide 1.x no longer exports `Chrome` or `Github`. Login keeps its provider
  labels and OAuth actions, using the supported `Globe` and `CodeXml` icons.
- The Next.js request interceptor uses the current `proxy.ts` convention,
  preserving session refresh, locale routing, and cookie forwarding.
- Saira, Saira Condensed, and IBM Plex Mono retain their weights, Latin subsets,
  CSS variables, swap behavior, and Next.js font optimization. Their WOFF2 files
  now come from locked Fontsource packages through `next/font/local`, so
  production builds do not depend on live Google Fonts DNS or HTTP access.

## Verification and limits

On Node 24.22.1 with npm 11.19.1, a clean `npm ci`, full-tree and production-only
`npm audit`, `npm ls --all`, lint, all 69 tests, the production build, and
`npm run typecheck` passed. Both audits reported zero known vulnerabilities.
The upgraded V8 coverage provider also ran successfully.

Production HTTP checks covered English, Portuguese, and Spanish login pages,
home, app listing, about, robots, sitemap, the unauthenticated account redirect,
default-locale canonicalization, blocked untrusted optimizer requests, working
local image optimization, and all nine bundled font weights. A browser check
confirmed login hydration without console errors and working local fonts.

Build and HTTP checks used placeholder Supabase configuration, matching the CI
approach. Expected backend-fetch and missing sitemap service-key errors remain
visible in that environment. Live database contents, authenticated sessions,
and external OAuth provider round trips require deployment credentials and were
not validated. Existing lint warnings were not suppressed.

## Open PR review

Dependency PR #30 was the only open PR at review time. Its update intent was
useful, but its CI failed during `npm ci` because it upgraded Vitest to 5.0.2
while leaving `@vitest/coverage-v8` on 4.1.9.

This upgrade incorporates all five proposed fixes at newer patched versions:
`@vitest/mocker` 5.0.5, `baseline-browser-mapping` 2.11.32, `browserslist` 4.29.4,
`fast-uri` 3.1.9, and `ip-address` 10.7.4. Vitest and its coverage provider move
together to 5.0.5. The old PR is superseded rather than safe to merge as-is.
