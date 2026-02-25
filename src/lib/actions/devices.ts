'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { type Device, deviceSchema } from '@/lib/validations/auth'

/**
 * Adds a new device to the user's profile.
 * @param data - The device data to add.
 */
export async function addDevice(data: Omit<Device, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const admin = createAdminClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Ensure profile exists using ADMIN client (bypasses RLS)
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
  const result = deviceSchema.safeParse(data)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from('devices').insert({ ...result.data, user_id: user.id })

  if (error) {
    console.error('Add device error:', error.message)
    return { error: error.message }
  }

  revalidatePath('/account', 'layout')
  revalidatePath('/apps', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * Updates an existing device's information.
 * @param id - The ID of the device to update.
 * @param data - The updated device data.
 */
export async function updateDevice(id: string, data: Partial<Device>) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Validate only provided data
  const result = deviceSchema.partial().safeParse(data)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from('devices').update(result.data).eq('id', id).eq('user_id', user.id)

  if (error) {
    console.error('Update device error:', error.message)
    return { error: error.message }
  }

  revalidatePath('/account', 'layout')
  revalidatePath('/apps', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * Deletes a device from the user's profile using soft delete.
 * If the device is primary, transfers primary status to another device if available.
 * @param id - The ID of the device to delete.
 */
export async function deleteDevice(id: string) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // 1. Fetch current devices to check primary status and find successor
  const { data: devices, error: fetchError } = await supabase
    .from('devices')
    .select('id, is_primary, deleted_at')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (fetchError || !devices) {
    console.error('Error fetching devices for deletion:', fetchError?.message)
    return { error: 'Failed to process deletion' }
  }

  const targetDevice = devices.find((d) => d.id === id)
  if (!targetDevice) {
    return { error: 'Device not found' }
  }

  // 2. Perform soft delete
  const { error: deleteError } = await supabase
    .from('devices')
    .update({ 
      deleted_at: new Date().toISOString(),
      is_primary: false 
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (deleteError) {
    console.error('Soft delete error:', deleteError.message)
    return { error: deleteError.message }
  }

  // 3. Transfer primary status if needed
  if (targetDevice.is_primary) {
    const successor = devices.find((d) => d.id !== id)
    if (successor) {
      const { error: transferError } = await supabase
        .from('devices')
        .update({ is_primary: true })
        .eq('id', successor.id)
        .eq('user_id', user.id)

      if (transferError) {
        console.error('Failed to transfer primary status:', transferError.message)
        // We don't return error here because the main delete succeeded
      }
    }
  }

  revalidatePath('/account', 'layout')
  revalidatePath('/apps', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}
