<script lang="ts">
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { supabase } from "$lib/supabase/supabaseClient"

	let email: string = ""
	let password: string = ""
	let saving = false

	let errorMessage: string = ""
	let message = ""

	async function signUp() {
		saving = true
		errorMessage = ""
		try {
			authStore.signUp(email, password)
		} catch (error) {
			console.error(error)
		} finally {
			saving = false
		}
	}
	async function signIn() {
		saving = true
		errorMessage = ""
		try {
			authStore.signIn(email, password)
		} catch (error) {
			console.error(error)
		} finally {
			saving = false
		}
	}
	async function signOut() {
		saving = true
		errorMessage = ""
		try {
			authStore.signOut()
		} catch (error) {
			console.error(error)
		} finally {
			saving = false
		}
	}

	async function checkUser() {
		console.log("checking user")
		const { error, data } = await supabase.auth.getUser()
		if (error) throw error
		alert(
			data.user
				? `User is logged in: ${data.user.email}`
				: "No user is logged in"
		)
		console.log("checked user")
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Auth testing")
</script>

<h1 class="text-2xl">Auth testing</h1>
{String($authStore)}
<input
	type="email"
	placeholder="Email"
	bind:value={email}
	class="input w-full max-w-xs mb-4"
/>
<input
	type="password"
	placeholder="Password"
	bind:value={password}
	class="input w-full max-w-xs mb-4"
/>
<button class="btn btn-primary" on:click={signUp}> Sign Up New User</button>
<button class="btn btn-secondary" on:click={signIn}>
	Sign In Existing User</button
>
<button class="btn btn-secondary" on:click={signOut}>sign out</button>

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
