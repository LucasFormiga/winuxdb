import fs from 'node:fs'
import path from 'node:path'
import type { App } from '../types'

export function getApps(): App[] {
  const filePath = path.join(process.cwd(), 'src/lib/data/apps.jsonl')
  const content = fs.readFileSync(filePath, 'utf8')
  
  return content
    .trim()
    .split('\n')
    .map((line) => {
      const data = JSON.parse(line)
      return {
        id: data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: data.name,
        version: data.version,
        recommendedVersion: data.recommendedVersion,
        rating: data.compatibility,
        score: data.rating,
        category: data.category,
        license: data.license,
        author: data.author,
        releaseDate: data.releaseDate,
        popularity: data.popularity,
        recommendedAlternatives: data.recommendedAlternatives || []
      }
    })
}
