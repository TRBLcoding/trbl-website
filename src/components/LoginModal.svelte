<script lang="ts">
	import { page } from "$app/state"
	import { authStore } from "$lib/stores/AuthStore"
	import { pushCreatedToast } from "$lib/utils/Toast"
	import { sleep } from "$lib/utils/Utils"
	import {
		faCircleCheck,
		faEnvelope,
		faKey,
		faUser,
	} from "@fortawesome/free-solid-svg-icons"
	import { onMount } from "svelte"
	import Fa from "svelte-fa"

	export let loginModalID: string

	const minimumPasswordLength = 6

	let firstName: string
	let lastName: string
	let email: string
	let password: string
	let loginError: string

	let showModal = false
	let loading = false
	let formSubmitted = false

	function handleAuthError(error: unknown) {
		console.error(error)
		if (error instanceof Error) {
			console.error(error.message)
			if (error.message === "Invalid login credentials")
				return "Ongeldige login gegevens"
			if (error.message === "Email not confirmed")
				return "Account nog niet geverifierd, check email om uw account te activeren"
			const emailMatch = error.message.match(/Email address "(.*)" is invalid/)
			if (emailMatch) return `Email adres "${emailMatch}" is ongeldig`
			const securityMatch = error.message.match(
				/For security purposes, you can only request this after (.*) seconds\./
			)
			if (securityMatch)
				return `U kunt dit om veiligheidsredenen pas na ${securityMatch[1]} seconden opnieuw aanvragen.`
			if (
				error.message ===
				"New password should be different from the old password."
			)
				return "Nieuw wachtwoord moet anders zijn dan voriger wachtwoord"
		}
		return "Unkown error occured"
	}

	async function submitLogin() {
		loading = true
		loginError = ""
		try {
			await authStore.signIn(email, password)
			showModal = false
			email = ""
			password = ""
		} catch (error) {
			loginError = handleAuthError(error)
		}
		loading = false
	}
	async function submitRegister() {
		loading = true
		loginError = ""
		try {
			await authStore.signUp(email, password, firstName, lastName)
			alertEmailBuffer = email
			email = ""
			password = ""
			firstName = ""
			lastName = ""
			formSubmitted = true
		} catch (error) {
			loginError = handleAuthError(error)
		}
		loading = false
	}
	async function submitRequestPasswordReset() {
		loading = true
		loginError = ""
		try {
			await authStore.requestPasswordReset(email)
			alertEmailBuffer = email
			email = ""
			password = ""
			formSubmitted = true
		} catch (error) {
			loginError = handleAuthError(error)
		}
		loading = false
	}
	let alertEmailBuffer = "" // Stores email after form is submitted for use in alert, because input field values needs to be cleared
	async function submitResetPassword() {
		loading = true
		loginError = ""
		try {
			await authStore.resetPassword(password)
			email = ""
			password = ""
			formSubmitted = true
		} catch (error) {
			loginError = handleAuthError(error)
		}
		loading = false
	}

	type ModalState = "Login" | "Register" | "RequestReset" | "Reset" | "Confirm"
	let modalState: ModalState = "Login"
	function switchState(newState: ModalState) {
		loading = false
		loginError = ""
		modalState = newState
		formSubmitted = false
	}

	// -- Reset link Check --
	onMount(() => {
		const hashParams = new URLSearchParams(page.url.hash.substring(1))
		if (hashParams.get("error") === "access_denied") {
			window.history.replaceState({}, document.title, location.origin)
			pushCreatedToast("Wachtwoord reset link is ongeldig of vervalen")
			console.error("Password reset link invalid or expired")
		} else if (page.url.searchParams.get("action") === "reset") {
			modalState = "Reset"
			showModal = true
		} else if (page.url.searchParams.get("action") === "confirm") {
			modalState = "Confirm"
			showModal = true
		}
	})

	$: resetModal(showModal)
	async function resetModal(state: boolean) {
		if (!state && (modalState === "Confirm" || modalState === "Reset")) {
			console.log(state)
			await sleep(300)
			modalState = "Login"
		}
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

			{#if modalState === "Login"}
				<!-- Login Form -->
				<div class="w-full">
					<div class="mb-4">
						<h1 class="font-bold text-xl">Inloggen</h1>
						<h2 class="text-sm text-gray-400">Welkom terug</h2>
					</div>
					<form
						on:submit|preventDefault={submitLogin}
						class="mb-3 flex flex-col gap-3"
					>
						<div>
							<label class="input w-full">
								<Fa icon={faEnvelope} class="h-[1em] opacity-50" />
								<input
									type="email"
									placeholder="Email"
									bind:value={email}
									class:input-error={loginError}
									required
									autocomplete="email"
								/>
							</label>
						</div>
						<div>
							<label class="input w-full">
								<Fa icon={faKey} class="h-[1em] opacity-50" />
								<input
									type="password"
									placeholder="Wachtwoord"
									bind:value={password}
									class:input-error={loginError}
									required
								/>
							</label>
						</div>
						<button
							class="btn btn-primary mt-2"
							type="submit"
							disabled={loading}
						>
							Inloggen <span
								class="loading loading-ring"
								class:hidden={!loading}
							></span>
						</button>
						{#if loginError}
							<div class="text-center text-error">{loginError}</div>
						{/if}
					</form>
					<div class="w-full flex flex-col items-center gap-1">
						<button
							class="link link-hover text-sm text-gray-400"
							on:click={() => switchState("RequestReset")}
						>
							Wachtwoord vergeten?
						</button>
						<button
							class="link link-hover text-sm text-gray-400"
							on:click={() => switchState("Register")}
						>
							Nog geen account? Registreer hier
						</button>
					</div>
				</div>
			{:else if modalState === "Register"}
				<!-- Register form -->
				<div class="w-full">
					<div class="mb-4">
						<h1 class="font-bold text-xl">Registreren</h1>
						<h2 class="text-sm text-gray-400">Welkom</h2>
					</div>
					{#if !formSubmitted}
						<form
							on:submit|preventDefault={submitRegister}
							class="mb-5 flex flex-col gap-3"
						>
							<div>
								<label class="input w-full">
									<Fa icon={faUser} class="h-[1em] opacity-50" />
									<input
										type="text"
										placeholder="Voornaam"
										bind:value={firstName}
										class:input-error={loginError}
										required
									/>
								</label>
							</div>
							<div>
								<label class="input w-full">
									<Fa icon={faUser} class="h-[1em] opacity-50" />
									<input
										type="text"
										placeholder="Achternaam"
										bind:value={lastName}
										class:input-error={loginError}
										required
									/>
								</label>
							</div>
							<div>
								<label class="input w-full">
									<Fa icon={faEnvelope} class="h-[1em] opacity-50" />
									<input
										type="email"
										placeholder="Email"
										bind:value={email}
										class:input-error={loginError}
										required
									/>
								</label>
							</div>
							<div>
								<label class="input w-full">
									<Fa icon={faKey} class="h-[1em] opacity-50" />
									<input
										type="password"
										placeholder="Wachtwoord"
										bind:value={password}
										class:input-error={loginError}
										required
										minlength={minimumPasswordLength}
									/>
								</label>
							</div>

							<button
								class="btn btn-primary mt-2"
								type="submit"
								disabled={loading}
								>Registreren <span
									class="loading loading-ring"
									class:hidden={!loading}
								></span></button
							>
							{#if loginError}
								<div class="text-center text-error">{loginError}</div>
							{/if}
						</form>
					{:else}
						<div role="alert" class="alert alert-success mb-2">
							<Fa icon={faCircleCheck} size="lg" />
							<span>
								Uw account is succesvol aangemaakt! Een bevestigingsmail is
								verstuurd naar <a
									href={"mailto:" + alertEmailBuffer}
									class="link">{alertEmailBuffer}</a
								>. Klik op de link in de e-mail om uw account te activeren.
							</span>
						</div>
					{/if}
					<div class="w-full flex items-center justify-center">
						<button
							class="link link-hover text-sm text-gray-400"
							on:click={() => switchState("Login")}
						>
							Al een account? Log hier in
						</button>
					</div>
				</div>
			{:else if modalState === "RequestReset"}
				<!-- Request password reset form -->
				<div class="w-full">
					<div class="mb-4">
						<h1 class="font-bold text-xl">Wachtwoord resetten</h1>
						<h2 class="text-sm text-gray-400">Email aanvragen</h2>
					</div>
					{#if !formSubmitted}
						<form
							on:submit|preventDefault={submitRequestPasswordReset}
							class="mb-5 flex flex-col gap-3"
						>
							<div>
								<label class="input w-full">
									<Fa icon={faEnvelope} class="h-[1em] opacity-50" />
									<input
										type="email"
										placeholder="Email"
										bind:value={email}
										class:input-error={loginError}
										required
									/>
								</label>
							</div>
							<button
								class="btn btn-primary mt-2"
								type="submit"
								disabled={loading}
								>Wachtwoord resetten <span
									class="loading loading-ring"
									class:hidden={!loading}
								></span></button
							>
							{#if loginError}
								<div class="text-center text-error">{loginError}</div>
							{/if}
						</form>
					{:else}
						<div role="alert" class="alert alert-success mb-2">
							<Fa icon={faCircleCheck} size="lg" />
							<span>
								Er is een wachtwoord reset link verzonden naar <a
									href={"mailto:" + alertEmailBuffer}
									class="link">{alertEmailBuffer}</a
								>, mits er een account bestaat met dit emailadres.
							</span>
						</div>
					{/if}

					<div class="w-full flex flex-col items-center gap-1">
						<button
							class="link link-hover text-sm text-gray-400"
							on:click={() => switchState("Login")}
						>
							Al een account? Log hier in
						</button>
						<button
							class="link link-hover text-sm text-gray-400"
							on:click={() => switchState("Register")}
						>
							Nog geen account? Registreer hier
						</button>
					</div>
				</div>
			{:else if modalState === "Reset"}
				<!-- Reset form -->
				<div class="w-full">
					<div class="mb-4">
						<h1 class="font-bold text-xl">Wachtwoord veranderen</h1>
						<h2 class="text-sm text-gray-400">Kies een nieuw wachtwoord</h2>
					</div>
					{#if !formSubmitted}
						<form
							on:submit|preventDefault={submitResetPassword}
							class="mb-5 flex flex-col gap-3"
						>
							<div>
								<label class="input w-full">
									<Fa icon={faEnvelope} class="h-[1em] opacity-50" />
									<input
										type="password"
										placeholder="Nieuw wachtwoord"
										bind:value={password}
										class:input-error={loginError}
										required
									/>
								</label>
							</div>
							<button
								class="btn btn-primary mt-2"
								type="submit"
								disabled={loading}
								>Wachtwoord veranderen <span
									class="loading loading-ring"
									class:hidden={!loading}
								></span></button
							>
							{#if loginError}
								<div class="text-center text-error">{loginError}</div>
							{/if}
						</form>
					{:else}
						<div role="alert" class="alert alert-success mb-2">
							<Fa icon={faCircleCheck} size="lg" />
							<span> Uw wachtwoord is succesvol veranderd </span>
						</div>
					{/if}
				</div>
			{:else if modalState === "Confirm"}
				<!-- Confirm -->
				<div class="w-full">
					<div class="mb-4">
						<h1 class="font-bold text-xl">Account geactiveerd</h1>
						<h2 class="text-sm text-gray-400">Lets go</h2>
					</div>
					<div class="mb-5 flex flex-col gap-2">
						<div role="alert" class="alert alert-success">
							<Fa icon={faCircleCheck} size="lg" />
							<span>
								Uw account is nu geactiveerd 🎉. U bent ook automatisch ingelogd
							</span>
						</div>
						<button
							class="btn btn-primary mt-2"
							type="button"
							on:click={() => (showModal = false)}>Ok</button
						>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<label class="modal-backdrop" for={loginModalID}>Close</label>
</div>
