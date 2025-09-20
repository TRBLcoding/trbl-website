<script lang="ts">
	import { authStore } from "$lib/stores/AuthStore"

	export let loginModalID: string

	let firstName: string
	let lastName: string
	let email: string
	let password: string
	let loginError: string

	let showModal = false

	async function submitLogin() {
		loginError = ""
		try {
			await authStore.signIn(email, password)
			showModal = false
			email = ""
			password = ""
		} catch (error) {
			loginError = "error occured"
			console.error(error)
		}
	}
	async function submitRegister() {
		loginError = ""
		try {
			await authStore.signUp(email, password, firstName, lastName)
			showModal = false
			email = ""
			password = ""
		} catch (error) {
			loginError = "error occured"
			console.error(error)
		}
	}

	let showLogin = true
	function setLogin(event: MouseEvent, value: boolean) {
		showLogin = value
	}
</script>

<input
	type="checkbox"
	id={loginModalID}
	bind:checked={showModal}
	class="modal-toggle"
/>
<div class="modal" role="dialog">
	<div class="modal-box custom-width w-11/12 max-w-2xl">
		<label
			for={loginModalID}
			class="btn btn-sm btn-circle absolute right-2 top-2 btn-ghost">✕</label
		>
		<div class="flex flex-row">
			<div class="w-96 my-auto hidden sm:block">
				<!-- <PegaIcon /> -->
				<img src="/TRBL_Logo.avif" alt="TRBL logo" class="pr-6" />
			</div>

			{#if showLogin}
				<!-- Login Form -->
				<div class="w-full">
					<div class="mb-4">
						<h1 class="font-bold text-xl">Inloggen</h1>
						<h2 class="text-sm text-gray-400">Welkom terug</h2>
					</div>
					<form on:submit={submitLogin} class="mb-5 flex flex-col gap-3">
						<input
							type="text"
							placeholder="Email"
							bind:value={email}
							class="input input-bordered w-full"
							class:input-error={loginError}
							required
						/>
						<input
							type="password"
							placeholder="Wachtwoord"
							bind:value={password}
							class="input input-bordered w-full"
							class:input-error={loginError}
							required
						/>
						<button class="btn btn-primary mt-2">Inloggen</button>
						{#if loginError}
							<div class="text-center text-error">{loginError}</div>
						{/if}
					</form>
					<div class="w-full flex items-center justify-center">
						<button
							class="link link-hover text-sm text-gray-400"
							on:click={(e) => (showLogin = false)}
						>
							Nog geen account? Registreer hier
						</button>
					</div>
				</div>
			{:else}
				<!-- Register form -->
				<div class="w-full">
					<div class="mb-4">
						<h1 class="font-bold text-xl">Registreren</h1>
						<h2 class="text-sm text-gray-400">Welkom</h2>
					</div>
					<form on:submit={submitRegister} class="mb-5 flex flex-col gap-3">
						<input
							type="text"
							placeholder="Voornaam"
							bind:value={firstName}
							class="input input-bordered w-full"
							class:input-error={loginError}
							required
						/>
						<input
							type="text"
							placeholder="Achternaam"
							bind:value={lastName}
							class="input input-bordered w-full"
							class:input-error={loginError}
							required
						/>
						<input
							type="text"
							placeholder="Email"
							bind:value={email}
							class="input input-bordered w-full"
							class:input-error={loginError}
							required
						/>
						<input
							type="password"
							placeholder="Wachtwoord"
							bind:value={password}
							class="input input-bordered w-full"
							class:input-error={loginError}
							required
						/>
						<button class="btn btn-primary mt-2">Registreren</button>
						{#if loginError}
							<div class="text-center text-error">{loginError}</div>
						{/if}
					</form>
					<div class="w-full flex items-center justify-center">
						<button
							class="link link-hover text-sm text-gray-400"
							on:click={() => (showLogin = true)}
						>
							Al een account? Log hier in
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<label class="modal-backdrop" for={loginModalID}>Close</label>
</div>
