'use client'

import {
  Activity,
  AppWindow,
  Battery,
  BatteryCharging,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Columns,
  Cpu,
  Download,
  Eraser,
  Flame,
  Gamepad2,
  Globe,
  Heart,
  History,
  Laptop,
  Layout,
  Lock,
  Monitor,
  Palette,
  Plug,
  RefreshCw,
  Rocket,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  ThumbsUp,
  Trophy,
  Undo2,
  Wand2,
  Zap
} from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DISTRO_QUESTIONS, DISTROS } from '@/lib/data/distros'

const ICON_MAP = {
  Activity,
  AppWindow,
  Battery,
  BatteryCharging,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Columns,
  Cpu,
  Download,
  Eraser,
  Flame,
  Gamepad2,
  Globe,
  Heart,
  History,
  Laptop,
  Layout,
  Lock,
  Monitor,
  Palette,
  Plug,
  RefreshCw,
  Rocket,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  ThumbsUp,
  Trophy,
  Undo2,
  Wand2,
  Zap
}

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

  // 1. Base weights from answers with Specialist Multipliers
  for (const [key, value] of Object.entries(answers)) {
    let weight = distro.weights[value] ?? 0

    // Priority 1: Primary Activity and GPU Architecture (The Technical Core)
    if (key === 'activity' || key === 'gpu') {
      weight *= 3 // 3x impact for the "big two"
    }

    // Priority 2: Mindset and Philosophy (The User's "Soul")
    if (key === 'updates' || key === 'philosophy' || key === 'customization') {
      weight *= 2 // 2x impact for workflow and ethics
    }

    score += weight
  }

  // 2. The Specialist's "Deal-breaker" Logic (Hard Gating)

  // NVIDIA Optimization Check
  if (answers.gpu === 'nvidia') {
    if (['debian', 'arch'].includes(distro.id)) score -= 30 // Extreme penalty for manual driver pain
    if (['popos', 'bazzite', 'nobara', 'pikaos', 'cachyos'].includes(distro.id)) score += 15 // Specialist boost
  }

  // Handheld Form Factor Check
  if (answers.device === 'handheld') {
    if (['bazzite', 'cachyos'].includes(distro.id)) score += 40 // Massive boost for handheld-aware kernels
    if (['linux-mint', 'zorin', 'debian', 'ubuntu'].includes(distro.id)) score -= 40 // Distros that break on handhelds
  }

  // Snapshot/Rollback Necessity
  if (answers.rollback === 'essential') {
    if (['opensuse', 'nixos', 'bazzite', 'fedora'].includes(distro.id)) score += 20
    if (['arch', 'ubuntu', 'linux-mint'].includes(distro.id)) score -= 15 // Distros that don't snapshot by default
  }

  // FOSS Purity Check
  if (answers.philosophy === 'foss') {
    if (['debian', 'fedora'].includes(distro.id)) score += 20
    if (['popos', 'pikaos', 'nobara', 'bazzite'].includes(distro.id)) score -= 25 // Too much proprietary "magic"
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
  const [currentStep, setCurrentStep] = useState(0)

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

  const currentQuestion = DISTRO_QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / DISTRO_QUESTIONS.length) * 100

  const handleOptionSelect = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId
    }))
    if (currentStep < DISTRO_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 200)
    }
  }

  const handleReset = () => {
    setAnswers(DEFAULT_ANSWERS)
    setCurrentStep(0)
  }

  const QuestionIcon = ICON_MAP[currentQuestion.icon as keyof typeof ICON_MAP] || Activity

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      {/* Consultation Panel */}
      <div className="flex flex-col rounded-3xl border border-border/60 bg-card/60 p-5 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/80">{t('kicker')}</p>
            <h3 className="mt-2 text-2xl font-bold">{t('title')}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('reset')}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <span>{t('stepLabel', { current: currentStep + 1, total: DISTRO_QUESTIONS.length })}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border/40">
            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question Area */}
        <div className="mt-8 sm:mt-10 flex-1">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 text-primary shrink-0">
              <QuestionIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h4 className="text-lg sm:text-xl font-semibold tracking-tight leading-tight">{t(`questions.${currentQuestion.id}.label`)}</h4>
          </div>

          <div className="mt-6 sm:mt-8 grid gap-3">
            {currentQuestion.options.map((option) => {
              const active = answers[currentQuestion.id] === option.id
              const OptionIcon = ICON_MAP[option.icon as keyof typeof ICON_MAP] || Activity

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionSelect(option.id)}
                  className={`group relative flex items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-left transition-all duration-200 ${
                    active
                      ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(255,60,60,0.05)]'
                      : 'border-border/60 hover:border-primary/40 hover:bg-primary/5'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl transition-colors shrink-0 ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    }`}
                  >
                    <OptionIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-semibold leading-tight ${active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}
                    >
                      {t(`questions.${currentQuestion.id}.options.${option.id}`)}
                    </p>
                  </div>
                  {active && <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-6 gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="rounded-xl border-border/60 px-2 sm:px-3"
          >
            <ChevronLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('back')}</span>
          </Button>
          <div className="hidden xs:flex gap-1.5 sm:gap-2">
            {DISTRO_QUESTIONS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 w-2 sm:w-4 rounded-full transition-all ${
                  idx === currentStep ? 'bg-primary w-4 sm:w-8' : idx < currentStep ? 'bg-primary/40' : 'bg-border/40'
                }`}
              />
            ))}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (currentStep < DISTRO_QUESTIONS.length - 1) {
                setCurrentStep((prev) => prev + 1)
              }
            }}
            className="rounded-xl px-2 sm:px-3"
          >
            <span>{currentStep === DISTRO_QUESTIONS.length - 1 ? t('finish') : t('skip')}</span>
            <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="space-y-6 lg:max-h-[800px] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/60">{t('topMatches')}</h4>
          <span className="text-[10px] font-medium text-muted-foreground/40">{t('realTimeAnalysis')}</span>
        </div>
        {results.map(({ distro, flavor, rank }) => (
          <div
            key={distro.id}
            className={`group relative rounded-3xl border transition-all duration-500 ${
              rank === 1
                ? 'border-primary/40 bg-card p-1 sm:p-2 shadow-2xl shadow-primary/10 ring-1 ring-primary/20'
                : 'border-border/60 bg-card/40 opacity-80 hover:opacity-100'
            }`}
          >
            <div className={rank === 1 ? 'p-5 sm:p-6' : 'p-4 sm:p-5'}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${rank === 1 ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {rank === 1 ? `🏆 ${t('specialistChoice')}` : `Rank #${rank}`}
                    </span>
                  </div>
                  <h4 className={`mt-1 font-bold tracking-tight ${rank === 1 ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
                    {distro.name}
                  </h4>
                </div>
                <Badge
                  variant={rank === 1 ? 'default' : 'secondary'}
                  className="rounded-lg px-2 py-0.5 text-[10px] uppercase tracking-wider shrink-0"
                >
                  {rank === 1 ? t('bestFit') : t('alternate')}
                </Badge>
              </div>

              <p
                className={`mt-3 text-muted-foreground leading-relaxed ${rank === 1 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm line-clamp-2'}`}
              >
                {tTaglines(distro.id, { fallback: distro.tagline })}
              </p>

              {/* Enhanced Stats for Rank #1 */}
              {rank === 1 && (
                <div className="mt-6 grid grid-cols-1 xs:grid-cols-2 gap-4 border-y border-border/40 py-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {t('basedOn')}
                    </p>
                    <p className="text-sm font-semibold">{distro.basedOn}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {t('packageManager')}
                    </p>
                    <p className="text-sm font-semibold">{distro.packageManager}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {t('releaseModel')}
                    </p>
                    <div className="flex items-center gap-2">
                      <History className="h-3 w-3 text-primary" />
                      <p className="text-sm font-semibold">{t(distro.releaseModel)}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {t('targetExperience')}
                    </p>
                    <p className="text-sm font-semibold">{flavor.desktop}</p>
                  </div>
                </div>
              )}

              <div
                className={`mt-6 overflow-hidden rounded-xl sm:rounded-2xl border border-border/40 bg-black/20 ${rank === 1 ? 'h-40 sm:h-56' : 'h-24 sm:h-32'}`}
              >
                <Image
                  src={flavor.screenshot}
                  alt={`${distro.name} ${flavor.name} screenshot`}
                  width={1200}
                  height={720}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Monitor className="h-3 w-3" />
                  {flavor.desktop}
                </div>
                {distro.baseTags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[9px] uppercase tracking-tighter border-border/40">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size={rank === 1 ? 'lg' : 'sm'}
                  className={`rounded-xl font-bold ${rank === 1 ? 'flex-1' : 'px-4 text-xs'}`}
                >
                  <a href={distro.url} target="_blank" rel="noreferrer">
                    {t('visitSite')}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size={rank === 1 ? 'lg' : 'sm'}
                  className={`rounded-xl font-bold ${rank === 1 ? 'flex-1' : 'px-4 text-xs'}`}
                >
                  <a href={flavor.url} target="_blank" rel="noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    <span className="truncate">
                      {rank === 1 ? t('getFlavor', { flavor: flavor.name }) : flavor.name}
                    </span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
