import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SECRET_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const JSONL_PATH = path.join(process.cwd(), 'src/lib/data/apps.jsonl')
const LOGO_DIR = path.join(process.cwd(), 'public/images/apps')

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
}

function sanitizeDate(dateStr: string) {
  if (!dateStr || dateStr === '0000-00-00') return null
  
  // Handle "YYYY-00-00" format -> YYYY-01-01
  if (dateStr.endsWith('-00-00')) {
    return `${dateStr.split('-')[0]}-01-01`
  }
  
  // Handle "YYYY-MM-00" format -> YYYY-MM-01
  if (dateStr.endsWith('-00')) {
    return `${dateStr.slice(0, -3)}-01`
  }

  // Basic validation
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null
  return dateStr
}

async function seed() {
  const content = fs.readFileSync(JSONL_PATH, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())
  
  const logoFiles = fs.readdirSync(LOGO_DIR)

  console.log(`Found ${lines.length} apps to seed.`)

  for (const line of lines) {
    try {
      const appData = JSON.parse(line)
      const slug = slugify(appData.name)
      
      // Find logo if it exists
      let logoUrl = null
      const logoMatch = logoFiles.find(f => f.startsWith(slug))
      if (logoMatch) {
        logoUrl = `/images/apps/${logoMatch}`
      }

      const releaseDate = sanitizeDate(appData.releaseDate)

      const payload = {
        name: appData.name,
        slug: slug,
        description: appData.description || null,
        logo_url: logoUrl,
        category: appData.category || 'Utility',
        version: appData.version || 'Latest',
        recommended_version: appData.recommendedVersion || null,
        author: appData.author || 'Unknown',
        license: appData.license || 'Proprietary',
        release_date: releaseDate,
        score: appData.rating || 0,
        overall_rating: appData.compatibility,
        popularity: appData.popularity || 0,
        is_verified: appData.isVerified || false
      }

      const { error } = await supabase
        .from('apps')
        .upsert(payload, { onConflict: 'slug' })

      if (error) {
        console.error(`Error seeding ${appData.name}:`, error.message)
      } else {
        process.stdout.write('.')
      }
    } catch (e) {
      console.error('Error parsing line:', e)
    }
  }
  
  console.log('\nSeeding completed.')
}

seed()
