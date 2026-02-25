'use server'

import { createClient } from '@/lib/supabase/server'
import { appSchema, type App } from '@/lib/validations/apps'

/**
 * Searches for applications by name and applies filters.
 */
export async function getApps({
  search = '',
  category = '',
  sortBy = 'popularity',
  order = 'desc',
  limit = 20,
  offset = 0
}: {
  search?: string
  category?: string
  sortBy?: 'popularity' | 'release_date' | 'score' | 'name'
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
} = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('apps')
    .select('*', { count: 'exact' })

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  if (category) {
    query = query.eq('category', category)
  }

  query = query.order(sortBy, { ascending: order === 'asc' })
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching apps:', error.message)
    return { error: error.message }
  }

  return { apps: data as App[], count }
}

/**
 * Gets a single application by its slug or ID.
 */
export async function getAppBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('apps')
    .select('*, reviews(*, profiles(nickname, avatar_url), devices(*))')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching app:', error.message)
    return null
  }

  return data
}
