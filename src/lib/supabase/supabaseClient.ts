import { env } from '$env/dynamic/public'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const SUPABASE_URL = env.PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_STORAGE_URL =env.PUBLIC_SUPABASE_ANON_KEY + "/storage/v1/object/public/"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

export function createSupabaseStorageUrl(bucket: string, folder: string, fileName: string) {
	return `${SUPABASE_STORAGE_URL}${bucket}/${folder}${fileName}.webp`
}

export function getSupabaseClientFromToken(jwt: string) {
	return createClient<Database>(
		SUPABASE_URL,
		SUPABASE_ANON_KEY,
		{
			global: {
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			}
		}
	)
}