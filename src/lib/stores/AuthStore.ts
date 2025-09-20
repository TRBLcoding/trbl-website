import { browser } from '$app/environment'
import { User } from '$lib/domain/User'
import { supabase } from '$lib/supabase/supabaseClient'
import { get, writable } from 'svelte/store'

function createAuthStore() {
	const innerStore = writable<User | null>(undefined, () => {
		let unsubscribe = () => { }

		function init() {
			if (!browser) return
			const { data } = supabase.auth.onAuthStateChange((event, session) => {
				if (event === 'SIGNED_IN' && session && session.user) {
					const user = get(innerStore)
					if (!user || user.id !== session.user.id) {
						// Using an immediately invoked async function, because the onAuthStateChange callback doesnt execute when async
						(async () => {
							const { error, data } = await supabase.from("users")
								.select()
								.eq("auth_id", session.user.id)
								.single()
							if (error)
								throw error
							const newUser = new User(session.user.id, session.user.email!, data.role)
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
				emailRedirectTo: `${location.href}?action=confirm`,
				data: { first_name: firstName, last_name: lastName }
			},
		})
		if (error) {
			throw error
		}
		console.log("Sign up data:", data)
		console.log(`Signed up ${data.user?.email} (${data.user?.role})`)
	}

	async function signIn(email: string, password: string) {
		const { error, data } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		})
		if (error) {
			throw error
		}
		console.log("Sign in data:", data)
		console.log(`Signed in ${data.user.email} (${data.user.role})`)
	}

	async function signOut() {
		const { error } = await supabase.auth.signOut()
		if (error) {
			throw error
		}
		console.log(`Signed out current user`)
	}

	async function requestPasswordReset(email: string) {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${location.href}?action=reset`
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

	// async function updateCurrentUserEmail(email: string) {
	// 	if (!auth.currentUser) return

	// 	// -- Update authUser --
	// 	const { updateEmail } = await import('firebase/auth')

	// 	await updateEmail(auth.currentUser, email)

	// 	// -- Update dbUser --
	// 	const { firebaseApp } = await import('$lib/firebase/Firebase')
	// 	const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
	// 	const firestore = getFirestore(firebaseApp)

	// 	const userRef = doc(firestore, Collections.USERS, auth.currentUser.uid)
	// 	await updateDoc(userRef, { email: email })
	// }

	// async function updateCurrentUserPassword(password: string) {
	// 	if (!auth.currentUser) return

	// 	// -- Update authUser --
	// 	const { updatePassword } = await import('firebase/auth')
	// 	await updatePassword(auth.currentUser, password)
	// }

	// async function updateCurrentUserName(displayName: string) {
	// 	if (!auth.currentUser) return

	// 	// -- Update authUser --
	// 	const { updateProfile } = await import('firebase/auth')
	// 	await updateProfile(auth.currentUser, { displayName: displayName })

	// 	// -- Update dbUser --
	// 	const { firebaseApp } = await import('$lib/firebase/Firebase')
	// 	const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
	// 	const firestore = getFirestore(firebaseApp)

	// 	const userRef = doc(firestore, Collections.USERS, auth.currentUser.uid)
	// 	await updateDoc(userRef, { displayName: displayName })
	// }

	return {
		subscribe,
		signUp,
		signIn,
		signOut,
		requestPasswordReset,
		resetPassword,
		// updateCurrentUserEmail,
		// updateCurrentUserPassword,
		// updateCurrentUserName
	}
}

export const authStore = createAuthStore()
