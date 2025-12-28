import { browser } from '$app/environment'
import { User } from '$lib/domain/User'
import type { Database } from '$lib/supabase/database.types'
import { supabase } from '$lib/supabase/supabaseClient'
import { handleSupabaseDeleteError, handleSupabaseUpdateError } from '$lib/utils/SupabaseUtils'
import { get, writable } from 'svelte/store'

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
							const user = User.fromJSON(data)
							update(() => user)
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
		const { data, error } = await supabase.auth.signUp({
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
		// -- Sign in user --
		// Acutal user data will be set by the onAuthStateChange listener
		const { data, error } = await supabase.auth.signInWithPassword({
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

	async function requestEmailChange(newEmail: string) {
		const existingUser = get(innerStore)
		if (!existingUser) throw new Error("No user logged in")

		// -- Update user --
		const { data, error } = await supabase.auth.updateUser({
			email: newEmail
		})
		handleSupabaseUpdateError(error, data, "user")
	}

	async function updateProfile(newFirstName: string, newLastName: string) {
		const existingUser = get(innerStore)
		if (!existingUser) throw new Error("No user logged in")

		// -- Update user --
		const { data, error } = await supabase
			.from('users')
			.update({
				first_name: newFirstName,
				last_name: newLastName,
			} as Database['public']['Tables']['users']['Update'])
			.eq('id', existingUser.id)
			.select('id')
		handleSupabaseUpdateError(error, data, "user")

		// -- Update store --
		existingUser.firstName = newFirstName
		existingUser.lastName = newLastName
		update(() => existingUser.clone())
	}

	async function updatePassword(newPassword: string) {
		const existingUser = get(innerStore)
		if (!existingUser) throw new Error("No user logged in")

		// -- Update user --
		const { data, error } = await supabase.auth.updateUser({
			password: newPassword
		})
		handleSupabaseUpdateError(error, data, "user")
	}

	async function deleteProfile() {
		const existingUser = get(innerStore)
		if (!existingUser) throw new Error("No user logged in")

		const { error, count } = await supabase
			.from('users')
			.delete({ count: 'exact' })
			.eq('id', existingUser.id)
		handleSupabaseDeleteError(error, count, "user")
	}

	return {
		subscribe,
		signUp,
		signIn,
		signOut,
		requestPasswordReset,
		requestEmailChange,
		updateProfile,
		updatePassword,
		deleteProfile
	}
}

export const authStore = createAuthStore()
