import fs from 'node:fs'
import path from 'node:path'
import type { App } from '../types'

const logoDir = path.join(process.cwd(), 'public/images/apps')

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[+]/g, 'plus')
    .replace(/[/.]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const getLogoMap = () => {
  if (!fs.existsSync(logoDir)) return new Map<string, string>()
  const entries = fs
    .readdirSync(logoDir)
    .filter((file) => !file.startsWith('.') && /\.(svg|png|jpg|jpeg|webp)$/.test(file))
  const map = new Map<string, string>()
  for (const file of entries) {
    const base = file.replace(/\.[^.]+$/, '')
    if (!map.has(base)) map.set(base, file)
  }
  return map
}

export function getApps(): App[] {
  const filePath = path.join(process.cwd(), 'src/lib/data/apps.jsonl')
  const content = fs.readFileSync(filePath, 'utf8')
  const logos = getLogoMap()

  return content
    .trim()
    .split('\n')
    .map((line) => {
      const data = JSON.parse(line)
      const logoSlug = slugify(data.name)
      const logoFile = logos.get(logoSlug)

      return {
        id: data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: data.name,
        logo: logoFile ? `/images/apps/${logoFile}` : undefined,
        description: data.description,
        screenshots: data.screenshots,
        version: data.version,
        recommendedVersion: data.recommendedVersion,
        rating: data.compatibility,
        score: data.rating,
        category: data.category,
        license: data.license,
        author: data.author,
        releaseDate: data.releaseDate,
        popularity: data.popularity,
        recommendedAlternatives: data.recommendedAlternatives || [],
        nativeAlternatives: data.nativeAlternatives || [],
        isVerified: data.isVerified ?? false,
        gpuCompatibility: data.gpuCompatibility,
        instructions: data.instructions
      }
    })
}

export function getApp(id: string): App | undefined {
  return getApps().find((app) => app.id === id)
}
