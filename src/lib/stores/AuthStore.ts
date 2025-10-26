import { browser } from '$app/environment'
import { User } from '$lib/domain/User'
import { supabase } from '$lib/supabase/supabaseClient'
import { get, writable } from 'svelte/store'
import { handleSupabaseError } from './ProductStore'
import type { Database } from '$lib/supabase/database.types'
import { createPostgrestErrorFromObject } from '$lib/utils/SupabaseUtils'

function createAuthStore() {
	// Value can be: undefined (not known yet), null (not logged in) or User (logged in)
	const innerStore = writable<User | null | undefined>(undefined, () => {
		let unsubscribe = () => { }

		function init() {
			if (!browser) return
			const { data } = supabase.auth.onAuthStateChange((event, session) => {
				if (event === 'SIGNED_IN' && session && session.user) {
					const user = get(innerStore)
					if (!user || user.auth_id !== session.user.id) {
						// Using an immediately invoked async function, because the onAuthStateChange callback doesnt execute when async
						(async () => {
							const { error, data } = await supabase.from("users")
								.select()
								.eq("auth_id", session.user.id)
								.single()
							if (error)
								throw error
							const newUser = new User(data.id, session.user.id, session.user.email!, data.role, data.first_name, data.last_name)
							update(() => newUser)
						})()
					}
				} else if (event === 'SIGNED_OUT' || !session) {
					update(() => null)
				}
			})
			unsubscribe = data.subscription.unsubscribe
		}
		init()
		return unsubscribe
	})
	const { subscribe, update } = innerStore

	async function signUp(email: string, password: string, firstName: string, lastName: string) {
		const { error, data } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				emailRedirectTo: `${location.origin}${location.pathname}?action=confirm`,
				data: { first_name: firstName, last_name: lastName }
			},
		})
		if (error) {
			throw error
		}
	}

	async function signIn(email: string, password: string) {
		const { error, data } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		})
		if (error) {
			throw error
		}
	}

	async function signOut() {
		const { error } = await supabase.auth.signOut()
		if (error) {
			throw error
		}
	}

	async function requestPasswordReset(email: string) {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${location.origin}${location.pathname}?action=reset`
		})
		if (error) {
			throw error
		}
	}

	async function resetPassword(password: string) {
		const { data, error } = await supabase.auth.updateUser({ password })
		if (error) {
			throw error
		}
	}

	async function updateProfile(firstName: string, lastName: string) {
		const user = get(innerStore)
		if (!user) throw new Error("No user logged in")
		// -- Update user --
		const { data, error } = await supabase
			.from('users')
			.update({
				first_name: firstName,
				last_name: lastName,
			} as Database['public']['Tables']['users']['Update'])
			.eq('id', user.id)
			.select('id')
		handleSupabaseError(error, data, "user")

		// -- Update store --
		update((user) => user)
	}

	async function updateEmail(newEmail: string) {
		const user = get(innerStore)
		if (!user) throw new Error("No user logged in")
		// -- Update user --
		const { data, error } = await supabase.auth.updateUser({
			email: newEmail
		})
		handleSupabaseError(error, data, "user")

		// -- Update store --
		update((user) => user)
	}

	async function updatePassword(newPassword: string) {
		const user = get(innerStore)
		if (!user) throw new Error("No user logged in")
		// -- Update user --
		const { data, error } = await supabase.auth.updateUser({
			password: newPassword
		})
		handleSupabaseError(error, data, "user")

		// -- Update store --
		update((user) => user)
	}

	async function deleteProfile() {
		const user = get(innerStore)
		if (!user) throw new Error("No user logged in")

		const { error, count } = await supabase
			.from('users')
			.delete({ count: 'exact' })
			.eq('id', user.id)
		if (error) {
			if (error instanceof Error)
				throw error
			throw createPostgrestErrorFromObject(error)
		}
		else if (!count || count === 0) {
			throw new Error(`No user deleted. Possible causes: unverrified account, insufficient permissions, incorrect RLS policies, ...`)
		}
		else if (count > 1) {
			throw new Error(`Multiple (${count}) users deleted. This should not happen because user ID is unique`)
		}

		// -- Update user --
		// supabase.functions.invoke("a")
		// handleSupabaseError(error, data, "user")

		// -- Update store --
		update((user) => user)
	}

	return {
		subscribe,
		signUp,
		signIn,
		signOut,
		requestPasswordReset,
		resetPassword,
		updateProfile,
		updateEmail,
		updatePassword,
		deleteProfile
	}
}

export const authStore = createAuthStore()
