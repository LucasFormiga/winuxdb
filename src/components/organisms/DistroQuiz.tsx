'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DISTRO_QUESTIONS, DISTROS } from '@/lib/data/distros'

type Answers = Record<string, string>

const DEFAULT_ANSWERS: Answers = {
  activity: 'general',
  gpu: 'amd_intel',
  device: 'desktop',
  updates: 'stable',
  ui: 'any',
  philosophy: 'functionality',
  customization: 'ready',
  battery: 'dont_care',
  rollback: 'dont_care',
  software: 'curated'
}

function scoreDistro(distro: (typeof DISTROS)[number], answers: Answers) {
  let score = 0

  // 1. Base weights from answers with Priority Multipliers
  for (const [key, value] of Object.entries(answers)) {
    let weight = distro.weights[value] ?? 0

    // Activity and GPU are critical path decisions, they get 2x impact
    if (key === 'activity' || key === 'gpu') {
      weight *= 2
    }

    score += weight
  }

  // 2. Hardware Gating (Specialist "Deal-breaker" logic)
  if (answers.gpu === 'nvidia') {
    // Strongly discourage distros where NVIDIA is historically painful out of the box
    if (['debian', 'arch'].includes(distro.id)) score -= 20
    // Boost distros with pre-baked NVIDIA drivers
    if (['popos', 'bazzite', 'nobara', 'pikaos'].includes(distro.id)) score += 10
  }

  // 3. Form Factor Awareness
  if (answers.device === 'handheld') {
    // Bazzite and CachyOS are the clear winners here
    if (['bazzite', 'cachyos'].includes(distro.id)) score += 15
    // Penalize desktop-only focused distros
    if (['linux-mint', 'zorin', 'debian'].includes(distro.id)) score -= 15
  }

  return score
}

function pickFlavor(answers: Answers, flavors: (typeof DISTROS)[number]['flavors']) {
  const preferenceMap: Record<string, string[]> = {
    modern: ['gnome'],
    traditional: ['kde', 'classic'],
    tiling: ['tiling'],
    any: ['flagship']
  }

  const preferences = preferenceMap[answers.ui] ?? []

  // If user likes specific desktop, find it
  if (answers.ui !== 'any') {
    const exactMatch = flavors.find((flavor) => preferences.some((tag) => flavor.tags.includes(tag)))
    if (exactMatch) return exactMatch
  } else {
    // If no preference, pick the flagship experience
    const flagship = flavors.find((f) => f.isFlagship)
    if (flagship) return flagship
  }

  // Fallback: If hardware is old, prioritize lightweight tags
  if (answers.gpu === 'old') {
    const lightweight = flavors.find((flavor) => ['performance', 'old'].some((tag) => flavor.tags.includes(tag)))
    if (lightweight) return lightweight
  }

  return flavors[0]
}

export default function DistroQuiz() {
  const t = useTranslations('Home.quiz')
  const tTaglines = useTranslations('DistroTaglines')
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS)

  const results = useMemo(() => {
    const scored = DISTROS.map((distro) => ({
      distro,
      score: scoreDistro(distro, answers)
    }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    return scored.map((entry, index) => ({
      ...entry,
      flavor: pickFlavor(answers, entry.distro.flavors),
      rank: index + 1
    }))
  }, [answers])

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{t('kicker')}</p>
            <h3 className="mt-3 text-2xl font-semibold">{t('title')}</h3>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setAnswers(DEFAULT_ANSWERS)}>
            {t('reset')}
          </Button>
        </div>

        <div className="mt-6 space-y-6">
          {DISTRO_QUESTIONS.map((question) => (
            <div key={question.id}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {t(`questions.${question.id}.label`)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {question.options.map((option) => {
                  const active = answers[question.id] === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: option.id
                        }))
                      }
                      className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
                        active
                          ? 'border-primary/60 bg-primary/10 dark:bg-primary/15 text-primary shadow-[0_0_18px_rgba(255,60,60,0.15)] dark:shadow-[0_0_18px_rgba(255,60,60,0.2)]'
                          : 'border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      }`}
                    >
                      {t(`questions.${question.id}.options.${option.id}`)}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {results.map(({ distro, flavor, rank }) => (
          <div key={distro.id} className="rounded-3xl border border-border/60 bg-card/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  {t('recommendationLabel', { rank })}
                </p>
                <h4 className="mt-2 text-xl font-semibold">{distro.name}</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tTaglines(distro.id, { fallback: distro.tagline })}
                </p>
              </div>
              <Badge variant={rank === 1 ? 'default' : 'secondary'}>{rank === 1 ? t('bestFit') : t('alternate')}</Badge>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-black/40">
              <Image
                src={flavor.screenshot}
                alt={`${distro.name} ${flavor.name} screenshot`}
                width={1200}
                height={720}
                className="h-44 w-full object-cover"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{flavor.desktop}</Badge>
              {distro.baseTags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t('suggestedFlavor')}</span>
              <span className="text-sm font-semibold text-foreground">{flavor.name}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {distro.flavors.slice(0, 6).map((item) => (
                <span key={item.id} className="rounded-full border border-border/60 px-2 py-1">
                  {item.name}
                </span>
              ))}
              {distro.flavors.length > 6 && (
                <span className="rounded-full border border-border/60 px-2 py-1">
                  +{distro.flavors.length - 6} more
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button asChild size="sm">
                <a href={distro.url} target="_blank" rel="noreferrer">
                  {t('visitSite')}
                </a>
              </Button>
              {(flavor.distroseaUrl ?? distro.distroseaUrl) && (
                <Button asChild variant="secondary" size="sm">
                  <a href={flavor.distroseaUrl ?? distro.distroseaUrl} target="_blank" rel="noreferrer">
                    {t('tryInBrowser')}
                  </a>
                </Button>
              )}
              <Button asChild variant="secondary" size="sm">
                <a href={flavor.url} target="_blank" rel="noreferrer">
                  {t('downloadFlavor', { flavor: flavor.name })}
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
