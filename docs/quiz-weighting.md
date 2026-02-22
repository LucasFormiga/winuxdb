# Distro Quiz Weighting Guide

This guide explains how to assign quiz weights to distros and their desktop flavors in `src/lib/data/distros.ts`. It is written for AI agents and should be followed for future additions.

## Goal
Produce consistent, explainable weights that reflect community sentiment, official positioning, and real-world benchmarks. The weights drive the client-side quiz matching on the Home page.

## Weight Dimensions
Each distro has a `weights` object that maps quiz answer IDs to numeric scores:
- `stability`
- `gaming`
- `latest`
- `performance`
- `beginner`
- `intermediate`
- `advanced`
- `rolling`
- `fixed`
- `atomic`
- `gnome`
- `kde`
- `tiling`
- `classic`

These IDs must match the quiz answers in `DISTRO_QUESTIONS`.

## Evidence Inputs
Use at least 2 sources per distro when possible:
1) Official docs (distro website, download page, editions/spins)
2) Community sentiment (Reddit, forums) for pros/cons
3) Benchmarks or trusted performance comparisons

Document the key signals you find. Avoid overfitting to single posts.

## Scoring Framework
Use the following scale per dimension:
- 0 = neutral or not a focus
- 1–2 = mild signal
- 3–4 = strong signal
- 5–7 = dominant signal

Apply this simple formula:

`weight = base + community + benchmarks + official`

Where each term is a small integer (0–3). Keep totals between 0–9. The max score should be rare and only used when the distro is strongly associated with that dimension (e.g., Bazzite for `gaming`, Debian for `stability`).

### Base Scoring
Start with a base score from the distro's known positioning:
- Stable, long-term release distros: `stability +4`, `fixed +4`
- Rolling-release distros: `rolling +4`, `latest +3`
- Gaming-first distros: `gaming +4`, `performance +3`
- Beginner-focused distros: `beginner +4`, `classic +2`
- Performance-tuned distros: `performance +4`

### Community Sentiment Modifier
Add or subtract based on recurring community themes:
- +1 to +2 for consistent positive feedback in multiple threads
- -1 to -2 for recurring issues (e.g., instability, driver pain)

### Benchmark Modifier
Add up to +2 when reputable benchmarks show notable gains (performance or gaming). Keep this conservative.

### Official Docs Modifier
Add +1 or +2 if the distro explicitly markets a strength (e.g., gaming, stability, rolling).

## Desktop Flavor Mapping
Each flavor has tags that influence the flavor choice logic:
- `gnome`, `kde`, `tiling`, `classic`, `performance`, `old`, `gaming`

Rules:
- Use the desktop environment as the primary tag (`gnome`, `kde`, `tiling`, `classic`).
- Add `performance` or `old` for lightweight desktops (Xfce, LXQt, MATE).
- Add `gaming` for handheld/game-centric flavors.

## Example: Debian (Base Distro)
Signals:
- Official docs emphasize stability and long-term support.
- Community sentiment: strong stability reputation; freshness tradeoff.

Weights:
- `stability`: base 4 + docs 2 + community 2 = 8
- `fixed`: base 4 + docs 2 + community 1 = 7
- `old`: base 2 + community 2 = 4
- `performance`: base 0 + benchmarks 1 = 1

## Example: Bazzite (Base Distro)
Signals:
- Official docs emphasize gaming/SteamOS-like experience.
- Community sentiment: "just works" for gaming, especially NVIDIA.
- Benchmarks: often good gaming performance.

Weights:
- `gaming`: base 4 + docs 2 + community 2 + benchmarks 1 = 9
- `atomic`: base 3 + docs 2 + community 2 = 7
- `performance`: base 3 + benchmarks 2 = 5
- `beginner`: base 1 + community 2 = 3

## Guardrails
- Keep weights consistent across similar distros.
- Do not inflate scores without evidence.
- If evidence is mixed, keep the weight modest (1–3).
- Favor stability for enterprise-focused distros and performance for tuned ones.
- Update weights when community sentiment shifts or major releases change direction.

## Workflow Checklist
1) Gather sources (official + community + benchmarks).
2) Summarize 3–6 signals.
3) Assign base scores.
4) Apply modifiers and cap at 9.
5) Add flavor tags and screenshots.
6) Record changes in commit summary.
