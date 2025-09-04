<script lang="ts">
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { supabase } from "$lib/supabase/supabaseClient"

	let email: string = ""
	let pass: string = ""
	let saving = false

	let errorMessage: string = ""
	let message = ""

	async function signUpNewUser() {
		saving = true
		message = ""
		errorMessage = ""
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: pass,
			options: {
				emailRedirectTo: "https://example.com/welcome",
			},
		})
		if (error) {
			errorMessage = error.message
			console.error(error)
		} else {
			message = "SIgned up"
			console.log("Sign up data:", data)
		}
		saving = false
	}
	async function signInWithEmail() {
		saving = true
		errorMessage = ""
		message = ""
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: pass,
		})
		if (error) {
			errorMessage = error.message
			console.error(error)
		} else {
			console.log("Sign in data:", data)
			message = `Signed in ${data.user.email} (${data.user.role})`
		}
		saving = false
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

<span class="loading loading-ring" class:hidden={!saving}></span>

{#if errorMessage}
	<div class="text-error m-2">{errorMessage}</div>
{/if}

{#if message}
	<div class="text-success m-2">{message}</div>
{/if}
