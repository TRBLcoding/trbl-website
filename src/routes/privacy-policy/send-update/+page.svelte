<script lang="ts">
	import { goto } from "$app/navigation"
	import Textarea from "$components/formHelpers/Textarea.svelte"
	import type { User } from "$lib/domain/User"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { supabase } from "$lib/supabase/supabaseClient"
	import { faCheck } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	let notableChanges = ""
	let loading = false
	let successMessage = ""
	let errorMessage = ""

	async function sendUpdate() {
		try {
			loading = true
			errorMessage = ""
			successMessage = ""
			const {
				data: { session },
			} = await supabase.auth.getSession()

			if (!session?.access_token) {
				console.error("No access token available")
				errorMessage = "Authenticatie mislukt. Probeer het opnieuw."
				return
			}

			const response = await fetch("/api/send-privacy-policy-update", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ notableChanges }),
			})
			if (!response.ok) {
				throw new Error(
					`Server returned ${response.status}: ${response.statusText}`
				)
			}
			successMessage = "Update succesvol verzonden naar alle gebruikers."
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = `Fout bij het verzenden van de update: ${error.message}`
			} else {
				errorMessage = "Onbekende fout bij het verzenden van de update."
			}
		}
		loading = false
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Update privacybeleid verzenden")
	// -- Authguard --
	$: if ($authStore === null || ($authStore && !($authStore as User).isAdmin()))
		goto("/")
</script>

<div class="max-w-6xl mx-auto p-6">
	<h1 class="text-4xl font-semibold mb-4">Update privacybeleid verzenden</h1>

	<div role="alert" class="alert alert-soft mb-5">
		Vul hieronder de belangrijke wijzigingen in het privacybeleid in. Deze
		informatie wordt per e-mail naar alle gebruikers gestuurd.
	</div>

	<form on:submit|preventDefault={sendUpdate}>
		<Textarea
			label="Belangrijke wijzigingen"
			bind:value={notableChanges}
			required
			placeholder="Beschrijf de belangrijkste wijzigingen in het privacybeleid..."
			size="full"
			class="mb-3"
		/>

		<button type="submit" disabled={loading} class=" btn btn-primary">
			Verzend update naar alle gebruikers
		</button>
		{#if errorMessage}
			<div class="text-error">{errorMessage}</div>
		{:else if successMessage}
			<div class="text-success flex gap-2 items-center mt-2">
				<Fa icon={faCheck} />
				<span>{successMessage}</span>
			</div>
		{/if}
	</form>
</div>
