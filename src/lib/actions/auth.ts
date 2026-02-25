'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { type Provider } from '@supabase/supabase-js'
import { updateProfileSchema, type UpdateProfile } from '@/lib/validations/auth'
import { revalidatePath } from 'next/cache'

/**
 * Initiates social login with a given provider.
 * @param provider - The social login provider (e.g., 'google', 'github', 'discord').
 * @param redirectTo - The URL to redirect to after successful login.
 */
export async function signInWithSocial(provider: Provider, redirectTo?: string) {
  const supabase = await createClient()
  
  // Use the provided redirectTo or fall back to the default site URL + callback
  // We point to /auth/callback WITHOUT locale, and middleware will handle it
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const finalRedirectTo = redirectTo || `${siteUrl}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: finalRedirectTo,
    },
  })

  if (error) {
    console.error('Login error:', error.message)
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

/**
 * Signs out the current user.
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/')
}

/**
 * Updates the user's profile information.
 * @param data - The profile data to update.
 */
export async function updateProfile(data: UpdateProfile) {
  const supabase = await createClient()
  
  // Validate data
  const result = updateProfileSchema.safeParse(data)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('profiles')
    .update(result.data)
    .eq('id', user.id)

  if (error) {
    console.error('Profile update error:', error.message)
    return { error: error.message }
  }

  revalidatePath('/[locale]/settings', 'layout')
  return { success: true }
}

/**
 * Gets the current authenticated user's profile and devices.
 */
export async function getUserData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, devices(*)')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    console.error('Error fetching user profile:', profileError.message)
  }

  // If profile is missing but user is authenticated, return fallback info from auth user metadata
  if (!profile) {
    return {
      id: user.id,
      nickname: user.user_metadata?.nickname || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      default_language: 'en',
      devices: []
    }
  }

  // Include email from the auth user object
  return { ...profile, email: user.email }
}
