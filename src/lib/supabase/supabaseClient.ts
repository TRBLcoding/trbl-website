import { env } from '$env/dynamic/public'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export const supabase = createClient<Database>(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY)

export const SUPABASE_STORAGE_URL = "https://teiboeelbjhxmsiyzpsn.supabase.co/storage/v1/object/public/"

export function createSupabaseStorageUrl(bucket: string, folder: string, fileName: string) {
	return `${SUPABASE_STORAGE_URL}${bucket}/${folder}${fileName}.webp`
}

export function getSupabaseClientFromToken(jwt: string) {
	return createClient<Database>(
		 env.PUBLIC_SUPABASE_URL,
		 env.PUBLIC_SUPABASE_ANON_KEY,
		{
			global: {
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			}
		}
	)
}