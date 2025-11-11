<script lang="ts">
	import { page } from "$app/state"
	import { authStore } from "$lib/stores/AuthStore"
	import {
		loginModalOpenStore,
		loginModalStateStore,
		type ModalState,
	} from "$lib/stores/LoginmodalStore"
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
	import Input from "./formHelpers/Input.svelte"

	export let loginModalID: string

	const minimumPasswordLength = 6

	let firstName: string
	let lastName: string
	let email: string
	let password: string
	let loginError: string

	let loading = false
	let formSubmitted = false

	function handleAuthError(error: unknown) {
		console.error(error)
		if (error instanceof Error) {
			if (error.message === "Invalid login credentials")
				return "Ongeldige login gegevens"
			if (error.message === "Email not confirmed")
				return "Account nog niet geverifierd, check email om uw account te activeren"
			if (error.message === "Failed to fetch")
				return "Netwerkprobleem, bent u verbonden met het internet?"
			if (error.message === "Database error granting user")
				return "Server error, probeer het later opnieuw"
			const emailMatch = error.message.match(/Email address "(.*)" is invalid/)
			if (emailMatch) return `Email adres "${emailMatch}" is ongeldig`
			const securityMatch = error.message.match(
				/For security purposes, you can only request this after (.*) seconds\./
			)
			if (securityMatch)
				return `U kunt dit om veiligheidsredenen pas na ${securityMatch[1]} seconden opnieuw aanvragen.`
			const passwordLengthMatch = error.message.match(
				/Password should be at least (.*) characters./
			)
			if (passwordLengthMatch)
				return `Wachtwoord moet minstens ${passwordLengthMatch[1]} tekens lang zijn`
			if (
				error.message ===
				"New password should be different from the old password."
			)
				return "Nieuw wachtwoord moet anders zijn dan vorige wachtwoord"
		}
		return "Unknown error occurred"
	}

	async function submitLogin() {
		loading = true
		loginError = ""
		try {
			await authStore.signIn(email, password)
			$loginModalOpenStore = false
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
			await authStore.updatePassword(password)
			email = ""
			password = ""
			formSubmitted = true
		} catch (error) {
			loginError = handleAuthError(error)
		}
		loading = false
	}

	function switchState(newState: ModalState) {
		loading = false
		loginError = ""
		$loginModalStateStore = newState
		formSubmitted = false
	}

	const configmMessage =
		"Confirmation link accepted. Please proceed to confirm link sent to the other email"
	// -- Reset link Check --
	const hashParams = new URLSearchParams(page.url.hash.substring(1))
	onMount(() => {
		if (hashParams.get("error") === "access_denied") {
			window.history.replaceState({}, document.title, location.origin)
			pushCreatedToast("Wachtwoord reset link is ongeldig of vervalen")
			console.error("Password reset link invalid or expired")
		} else if (hashParams.get("type") === "email_change") {
			$loginModalStateStore = "Email2"
			$loginModalOpenStore = true
		} else if (hashParams.get("message") === configmMessage) {
			$loginModalStateStore = "Email1"
			$loginModalOpenStore = true
		} else if (page.url.searchParams.get("action") === "reset") {
			$loginModalStateStore = "Reset"
			$loginModalOpenStore = true
		} else if (page.url.searchParams.get("action") === "confirm") {
			$loginModalStateStore = "Confirm"
			$loginModalOpenStore = true
		}
	})

	$: resetModal($loginModalOpenStore)
	async function resetModal(state: boolean) {
		if (
			!state &&
			($loginModalStateStore === "Confirm" ||
				$loginModalStateStore === "Reset" ||
				$loginModalStateStore === "Email1" ||
				$loginModalStateStore === "Email2")
		) {
			await sleep(300)
			if (!$loginModalOpenStore) $loginModalStateStore = "Login"
		}
	}
</script>

<input
	type="checkbox"
	id={loginModalID}
	bind:checked={$loginModalOpenStore}
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

			{#if $loginModalStateStore === "Login"}
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
						<Input
							type="email"
							placeholder="Email"
							bind:value={email}
							size="full"
							required
							autocomplete="email"
							iconLeft={faEnvelope}
						/>
						<Input
							type="password"
							placeholder="Wachtwoord"
							bind:value={password}
							size="full"
							required
							autocomplete="current-password"
							iconLeft={faKey}
						/>
						<button
							class="btn btn-primary mt-2"
							type="submit"
							disabled={loading}
						>
							Inloggen
							<span class="loading loading-ring" class:hidden={!loading}></span>
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
			{:else if $loginModalStateStore === "Register"}
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
							<Input
								type="text"
								placeholder="Voornaam"
								bind:value={firstName}
								size="full"
								required
								autocomplete="given-name"
								iconLeft={faUser}
							/>
							<Input
								type="text"
								placeholder="Achternaam"
								bind:value={lastName}
								size="full"
								required
								autocomplete="family-name"
								iconLeft={faUser}
							/>
							<Input
								type="email"
								placeholder="Email"
								bind:value={email}
								size="full"
								required
								autocomplete="email"
								iconLeft={faEnvelope}
							/>
							<Input
								type="password"
								placeholder="Wachtwoord"
								bind:value={password}
								size="full"
								required
								autocomplete="new-password"
								iconLeft={faKey}
							/>
							<button
								class="btn btn-primary mt-2"
								type="submit"
								disabled={loading}
							>
								Registreren
								<span class="loading loading-ring" class:hidden={!loading}>
								</span>
							</button>
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
			{:else if $loginModalStateStore === "RequestReset"}
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
							<Input
								type="email"
								placeholder="Email"
								bind:value={email}
								size="full"
								required
								autocomplete="email"
								iconLeft={faEnvelope}
							/>
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
			{:else if $loginModalStateStore === "Reset"}
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
							<Input
								type="password"
								placeholder="Nieuw wachtwoord"
								bind:value={password}
								size="full"
								required
								autocomplete="new-password"
								iconLeft={faKey}
							/>
							<button
								class="btn btn-primary mt-2"
								type="submit"
								disabled={loading}
								>Wachtwoord veranderen <span
									class="loading loading-ring"
									class:hidden={!loading}
								></span>
							</button>
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
			{:else if $loginModalStateStore === "Email1"}
				<div class="w-full">
					<div class="mb-4">
						<h1 class="font-bold text-xl flex items-center gap-2">
							<Fa icon={faCircleCheck} class="text-success" /> Email 1 bevestigd
						</h1>
						<h2 class="text-sm text-gray-400">
							Bevestig nu ook uw andere email adres
						</h2>
					</div>
					<div class="mb-5 flex flex-col gap-3">
						<p>
							Om veiligheidsredenen moet een verandering van email zowel op het
							oude als het nieuwe adres bevestigd worden.
						</p>
						<button
							class="btn btn-primary mt-2"
							type="button"
							on:click={() => ($loginModalOpenStore = false)}>Ok</button
						>
					</div>
				</div>
			{:else if $loginModalStateStore === "Email2"}
				<div class="w-full">
					<div class="mb-4">
						<h1 class="font-bold text-xl flex items-center gap-2">
							<Fa icon={faCircleCheck} class="text-success" /> Email 2 bevestigd
						</h1>
						<h2 class="text-sm text-gray-400">
							Email adres succesvol veranderd
						</h2>
					</div>
					<div class="mb-5 flex flex-col gap-3">
						<p>
							Uw email adres is succesvol veranderd, vanaf nu moet u met dit
							nieuwe adres inloggen.
						</p>
						<button
							class="btn btn-primary mt-2"
							type="button"
							on:click={() => ($loginModalOpenStore = false)}>Ok</button
						>
					</div>
				</div>
			{:else if $loginModalStateStore === "Confirm"}
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
							on:click={() => ($loginModalOpenStore = false)}>Ok</button
						>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<label class="modal-backdrop" for={loginModalID}>Close</label>
</div>
