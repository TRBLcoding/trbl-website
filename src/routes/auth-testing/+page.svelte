<script lang="ts">
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { supabase } from "$lib/supabase/supabaseClient"

	let email: string = ""
	let pass: string = "" 

	async function signUpNewUser() {
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: pass,
			options: {
				emailRedirectTo: "https://example.com/welcome",
			},
		})
		console.log("Sign up data:", data)
	}
	async function signInWithEmail() {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: pass,
		})
		console.log("Sign in data:", data)
		console.log("Error:", error)
	}

	async function checkUser() {
		const {
			data: { user },
		} = await supabase.auth.getUser()
		alert(user ? `User is logged in: ${user.email}` : "No user is logged in")
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Auth testing")
</script>

<h1 class="text-2xl">Auth testing</h1>
<input
	type="email"
	placeholder="Email"
	bind:value={email}
	class="input w-full max-w-xs mb-4"
/>
<input
	type="password"
	placeholder="Password"
	bind:value={pass}
	class="input w-full max-w-xs mb-4"
/>
<button class="btn btn-primary" on:click={signUpNewUser}>
	Sign Up New User</button
>
<button class="btn btn-secondary" on:click={signInWithEmail}>
	Sign In Existing User</button
>
<button class="btn btn-secondary" on:click={() => supabase.auth.signOut()}
	>sign out</button
>

<button class="btn btn-secondary" on:click={checkUser}
	>Check if logged in</button
>
