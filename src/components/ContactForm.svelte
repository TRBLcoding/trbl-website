<script lang="ts">
	import { authStore } from "$lib/stores/AuthStore"
	import {
		faCheck,
		faEnvelope,
		faExclamationTriangle,
		faUser,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export let firstName: string
	export let lastName: string
	export let emailAdress: string
	export let subject: string
	export let message: string
	export let send: () => Promise<void>

	let saving: boolean = false
	let errorText: string = ""
	let succesText: string = ""

	async function onSubmitWrapper() {
		saving = true
		errorText = ""
		succesText = ""
		try {
			await send()
			firstName = ""
			lastName = ""
			emailAdress = ""
			subject = ""
			message = ""
			succesText =
				"Bericht succesvol verzonden, we nemen zo snel mogelijk contact met je op."
		} catch (error) {
			console.error(error)
			if (error instanceof Error) errorText = error.message
			else errorText = "Unknown error occurred"
		}
		saving = false
	}

	function fillUserData() {
		if (!$authStore) return
		firstName = $authStore.firstName
		lastName = $authStore.lastName
		emailAdress = $authStore.email
	}
</script>

<div class="max-w-lg">
	<div class="flex items-center">
		<div class="text-xl font-semibold flex items-center gap-2 flex-1">
			<Fa icon={faEnvelope} />
			<span>Stuur een bericht</span>
		</div>
		{#if $authStore}
			<button
				class="btn btn-primary btn-sm"
				type="button"
				on:click={fillUserData}
			>
				<Fa icon={faUser} />
				Automatisch invullen
			</button>
		{/if}
	</div>
	<form class="flex flex-col" on:submit|preventDefault={onSubmitWrapper}>
		<div class="flex gap-6">
			<fieldset class="fieldset text-[15px] w-full">
				<legend class="fieldset-legend">Voornaam</legend>
				<input
					type="text"
					class="input"
					required
					placeholder="Voornaam"
					bind:value={firstName}
				/>
			</fieldset>
			<fieldset class="fieldset text-[15px] w-full">
				<legend class="fieldset-legend">Achternaam</legend>
				<input
					type="text"
					class="input"
					required
					placeholder="Achternaam"
					bind:value={lastName}
				/>
			</fieldset>
		</div>
		<fieldset class="fieldset text-[15px]">
			<legend class="fieldset-legend">Email</legend>
			<input
				type="email"
				class="input w-full"
				required
				placeholder="Email"
				bind:value={emailAdress}
			/>
		</fieldset>
		<fieldset class="fieldset text-[15px]">
			<legend class="fieldset-legend">Onderwerp</legend>
			<input
				type="text"
				class="input w-full"
				required
				placeholder="Onderwerp"
				bind:value={subject}
			/>
		</fieldset>
		<fieldset class="fieldset text-[15px]">
			<legend class="fieldset-legend">Boodschap</legend>
			<textarea
				class="input w-full h-70"
				required
				placeholder="Boodschap"
				bind:value={message}
			>
			</textarea>
		</fieldset>
		<button type="submit" class="btn btn-primary mt-3" disabled={saving}>
			Verstuur bericht
			<span class="loading loading-ring" class:hidden={!saving}></span>
		</button>
		{#if errorText}
			<div class="text-error flex gap-2 items-center mt-2">
				<Fa icon={faExclamationTriangle} />
				<span>{errorText}</span>
			</div>
		{/if}
		{#if succesText}
			<div class="text-success flex gap-2 items-center mt-2">
				<Fa icon={faCheck} />
				<span>{succesText}</span>
			</div>
		{/if}
	</form>
</div>
