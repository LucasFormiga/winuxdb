'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deviceSchema, type Device } from '@/lib/validations/auth'
import { revalidatePath } from 'next/cache'

/**
 * Adds a new device to the user's profile.
 * @param data - The device data to add.
 */
export async function addDevice(data: Omit<Device, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const admin = createAdminClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Ensure profile exists using ADMIN client (bypasses RLS)
  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    const nickname = user.user_metadata?.nickname || 
                     user.user_metadata?.full_name || 
                     user.email?.split('@')[0] || 
                     'User'
    
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
  const result = deviceSchema.safeParse(data)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('devices')
    .insert({ ...result.data, user_id: user.id })

  if (error) {
    console.error('Add device error:', error.message)
    return { error: error.message }
  }

  revalidatePath('/[locale]/settings/devices', 'layout')
  return { success: true }
}

/**
 * Updates an existing device's information.
 * @param id - The ID of the device to update.
 * @param data - The updated device data.
 */
export async function updateDevice(id: string, data: Partial<Device>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Validate only provided data
  const result = deviceSchema.partial().safeParse(data)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('devices')
    .update(result.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Update device error:', error.message)
    return { error: error.message }
  }

  revalidatePath('/[locale]/settings/devices', 'layout')
  return { success: true }
}

/**
 * Deletes a device from the user's profile.
 * @param id - The ID of the device to delete.
 */
export async function deleteDevice(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Delete device error:', error.message)
    return { error: error.message }
  }

  revalidatePath('/[locale]/settings/devices', 'layout')
  return { success: true }
}
