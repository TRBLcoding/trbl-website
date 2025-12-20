import { PostgrestError } from "@supabase/supabase-js"

export function createPostgrestErrorFromObject(error: { message: string, code: string, hint: string, details: string }) {
	console.error(error)
	const message = error.message + (error.details ? `. Details: ${error.details}` : "")
	const code = error.code
	const hint = error.hint
	const details = error.details
	return new PostgrestError({ message, code, hint, details })
}

export function handleSupabaseUpdateError(error: any, data: any, type: string) {
	if (error) {
		console.error(error)
		if (error.message === "TypeError: Failed to fetch")
			throw new Error(`Network error while updating ${type}: ${error?.message}`)
		throw new Error(`Error updating ${type}: ${error?.message}`)
	}
	else if (!data || data.length === 0) {
		throw new Error(`No ${type} items updated. Possible causes: unverrified account, insufficient permissions, incorrect RLS policies, ...`)
	}
	else if (data.length > 1) {
		throw new Error(`Multiple (${data.length}) ${type} items updated. This should not happen because ID is unique`)
	}
}

export function handleSupabaseDeleteError(error: any, count: number | null, type: string, singleDelete: boolean = true) {
	if (error) {
		console.error(error)
		if (error instanceof Error)
			throw error
		throw createPostgrestErrorFromObject(error)
	}
	else if (!count || count === 0) {
		throw new Error(`No ${type} items deleted. Possible causes: unverrified account, insufficient permissions, incorrect RLS policies, ...`)
	}
	else if (singleDelete && count > 1) {
		throw new Error(`Multiple (${count}) ${type} items deleted. This should not happen because ID is unique`)
	}
}