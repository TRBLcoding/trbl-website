import { persisted } from 'svelte-persisted-store'

// Persists to localStorage
export const preferencesStore = persisted('preferences', {
	autoPlay: true
})
