import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

export const SUPABASE_STORAGE_URL = "https://teiboeelbjhxmsiyzpsn.supabase.co/storage/v1/object/public/"

export function createSupabaseStorageUrl(bucket: string, folder: string, fileName: string) {
	return `${SUPABASE_STORAGE_URL}${bucket}/${folder}${fileName}.webp`
}
