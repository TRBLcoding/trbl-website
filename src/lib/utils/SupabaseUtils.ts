import { PostgrestError } from "@supabase/supabase-js"

export function createPostgrestErrorFromObject(error: { message: string, code: string, hint: string, details: string }) {
	const message = error.message
	const code = error.code
	const hint = error.hint
	const details = error.message
	return new PostgrestError({ message, code, hint, details })
}