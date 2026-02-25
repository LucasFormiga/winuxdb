'use server'

import { DISTROS } from '@/lib/data/distros'
import { createClient, createPublicClient } from '@/lib/supabase/server'
import { calculateOverallRating } from '@/lib/utils/ratings'
import type { App } from '@/lib/validations/apps'

/**
 * Searches for applications by name and applies filters.
 */
export async function getApps({
  search = '',
  category = '',
  rating = '',
  license = '',
  sortBy = 'rating',
  order = 'desc',
  limit = 50,
  offset = 0,
  forceFresh = false
}: {
  search?: string
  category?: string
  rating?: string
  license?: string
  sortBy?: 'popularity' | 'release_date' | 'score' | 'name' | 'rating'
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
  forceFresh?: boolean
} = {}) {
  const supabase = forceFresh ? await createClient() : createPublicClient()

  let query = supabase.from('apps').select('*, reviews(rating)', { count: 'exact' })

  if (search) {
    query = query.or(`name.ilike.%${search}%,author.ilike.%${search}%`)
  }

  if (category && category !== 'ALL') {
    query = query.eq('category', category)
  }

  if (license && license !== 'ALL') {
    query = query.eq('license', license)
  }

  // Database Sorting (as a first pass)
  if (sortBy === 'rating') {
    // Enum order is usually correct in SQL if defined correctly,
    // but we'll re-sort in JS to be 100% sure with community ratings
    query = query.order('overall_rating', { ascending: order === 'asc', nullsFirst: false })
    query = query.order('popularity', { ascending: false })
    query = query.order('name', { ascending: true })
  } else if (sortBy === 'popularity') {
    query = query.order('popularity', { ascending: order === 'asc' })
    query = query.order('overall_rating', { ascending: false })
    query = query.order('name', { ascending: true })
  } else if (sortBy === 'name') {
    query = query.order('name', { ascending: order === 'asc' })
    query = query.order('overall_rating', { ascending: false })
    query = query.order('popularity', { ascending: false })
  } else {
    query = query.order(sortBy, { ascending: order === 'asc', nullsFirst: false })
    query = query.order('name', { ascending: true })
  }

  // To ensure community-driven logic (average of reviews) works across the whole list,
  // we fetch a larger set and process it in JS.
  query = query.limit(1000)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching apps:', error.message)
    return { error: error.message }
  }

  // 1. Calculate community-driven ratings
  let apps = (data as any[]).map((app) => ({
    ...app,
    overall_rating: calculateOverallRating(app.overall_rating, app.reviews)
  }))

  // 2. Filter by calculated rating
  if (rating && rating !== 'ALL') {
    apps = apps.filter((app) => app.overall_rating === rating)
  }

  // 3. Sort correctly with community ratings
  const RATING_ORDER: Record<string, number> = {
    NATIVE: 6,
    PLATINUM: 5,
    GOLD: 4,
    SILVER: 3,
    BRONZE: 2,
    BORKED: 1
  }

  apps.sort((a, b) => {
    if (sortBy === 'rating') {
      const valA = RATING_ORDER[a.overall_rating] ?? 0
      const valB = RATING_ORDER[b.overall_rating] ?? 0
      if (valA !== valB) return order === 'desc' ? valB - valA : valA - valB

      const popA = a.popularity ?? 0
      const popB = b.popularity ?? 0
      if (popA !== popB) return popB - popA

      return a.name.localeCompare(b.name)
    }

    if (sortBy === 'popularity') {
      const popA = a.popularity ?? 0
      const popB = b.popularity ?? 0
      if (popA !== popB) return order === 'desc' ? popB - popA : popA - popB

      const valA = RATING_ORDER[a.overall_rating] ?? 0
      const valB = RATING_ORDER[b.overall_rating] ?? 0
      if (valA !== valB) return valB - valA

      return a.name.localeCompare(b.name)
    }

    if (sortBy === 'name') {
      const nameCompare = a.name.localeCompare(b.name)
      if (nameCompare !== 0) return order === 'desc' ? -nameCompare : nameCompare

      const valA = RATING_ORDER[a.overall_rating] ?? 0
      const valB = RATING_ORDER[b.overall_rating] ?? 0
      return valB - valA
    }

    if (sortBy === 'release_date') {
      const dateA = new Date(a.release_date || 0).getTime()
      const dateB = new Date(b.release_date || 0).getTime()
      if (dateA !== dateB) return order === 'desc' ? dateB - dateA : dateA - dateB
      return a.name.localeCompare(b.name)
    }

    return a.name.localeCompare(b.name)
  })

  // 4. Paginate in JS
  const paginatedApps = apps.slice(offset, offset + limit)

  return { apps: paginatedApps as App[], count: apps.length }
}

/**
 * Gets a single application by its slug or ID.
 */
export async function getAppBySlug(identifier: string, forceFresh = false) {
  const supabase = forceFresh ? await createClient() : createPublicClient()

  // Try slug first (most common for SEO)
  const query = supabase
    .from('apps')
    .select('*, reviews(*, profiles(nickname, avatar_url, is_admin, is_verified), devices:device_id(*))')
    .eq('slug', identifier)

  const { data: slugData, error: slugError } = await query.maybeSingle()

  if (slugData) {
    return {
      ...slugData,
      overall_rating: calculateOverallRating(slugData.overall_rating, slugData.reviews)
    }
  }

  // Fallback to ID if not found by slug and identifier looks like a UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)
  
  if (isUuid) {
    const { data: idData } = await supabase
      .from('apps')
      .select('*, reviews(*, profiles(nickname, avatar_url, is_admin, is_verified), devices:device_id(*))')
      .eq('id', identifier)
      .maybeSingle()

    if (idData) {
      return {
        ...idData,
        overall_rating: calculateOverallRating(idData.overall_rating, idData.reviews)
      }
    }
  }

  if (slugError) console.error('Error fetching app by slug:', slugError.message)
  
  return null
}

/**
 * Gets global statistics for the database.
 */
export async function getStats(forceFresh = false) {
  const supabase = forceFresh ? await createClient() : createPublicClient()

  const [appsRes, reviewsRes] = await Promise.all([
    supabase.from('apps').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true })
  ])

  return {
    appsCount: appsRes.count || 0,
    reviewsCount: reviewsRes.count || 0,
    distrosCount: DISTROS.length
  }
}
