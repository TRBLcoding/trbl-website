import { PostgrestError } from "@supabase/supabase-js"

export function createPostgrestErrorFromObject(error: { message: string, code: string, hint: string, details: string }) {
	console.error(error)
	const message = error.message +( error.details ? `. Details: ${error.details}` : "")
	const code = error.code
	const hint = error.hint
	const details = error.details
	return new PostgrestError({ message, code, hint, details })
}