'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { type Review, reviewSchema } from '@/lib/validations/apps'

/**
 * Submits a new compatibility review.
 */
export async function submitReview(data: Omit<Review, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const admin = createAdminClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Ensure profile exists using ADMIN client
  const { data: profile } = await admin.from('profiles').select('id').eq('id', user.id).maybeSingle()

  if (!profile) {
    const nickname =
      user.user_metadata?.nickname || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

    const { error: profileError } = await admin.from('profiles').insert({
      id: user.id,
      nickname: nickname,
      default_language: 'en',
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture
    })

    if (profileError) {
      console.error('Admin profile creation failed:', profileError.message)
      return { error: 'Failed to initialize user profile' }
    }
  }

  // Validate data
  const result = reviewSchema.safeParse(data)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from('reviews').insert({ ...result.data, user_id: user.id })

  if (error) {
    console.error('Error submitting review:', error.message)
    return { error: error.message }
  }

  revalidatePath('/apps', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * Updates an existing review.
 */
export async function updateReview(id: string, data: Partial<Review>) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Validate partial data
  const result = reviewSchema.partial().safeParse(data)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from('reviews').update(result.data).eq('id', id).eq('user_id', user.id)

  if (error) {
    console.error('Error updating review:', error.message)
    return { error: error.message }
  }

  revalidatePath('/apps', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * Deletes a review.
 */
export async function deleteReview(id: string) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('reviews').delete().eq('id', id).eq('user_id', user.id)

  if (error) {
    console.error('Error deleting review:', error.message)
    return { error: error.message }
  }

  revalidatePath('/apps', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}
