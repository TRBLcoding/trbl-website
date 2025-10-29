<script lang="ts">
	import { authStore } from "$lib/stores/AuthStore"
	import {
		faCheck,
		faEnvelope,
		faExclamationTriangle,
		faUser,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import Input from "./formHelpers/Input.svelte"
	import Textarea from "./formHelpers/Textarea.svelte"

	export let firstName: string
	export let lastName: string
	export let email: string
	export let subject: string
	export let message: string
	export let send: () => Promise<void>

	let saving: boolean = false
	let errorText: string = ""
	let successText: string = ""

	async function onSubmitWrapper() {
		saving = true
		errorText = ""
		successText = ""
		try {
			await send()
			firstName = ""
			lastName = ""
			email = ""
			subject = ""
			message = ""
			successText =
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
		email = $authStore.email
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
	<form
		class="flex flex-col gap-2 mt-2"
		on:submit|preventDefault={onSubmitWrapper}
	>
		<div class="flex gap-6">
			<Input
				label="Voornaam"
				type="text"
				placeholder="Voornaam"
				bind:value={firstName}
				size="full"
				required
				autocomplete="given-name"
				labelClass="text-base-content font-semibold mb-1"
			/>
			<Input
				label="Achternaam"
				type="text"
				placeholder="Achternaam"
				bind:value={lastName}
				size="full"
				required
				autocomplete="family-name"
				labelClass="text-base-content font-semibold mb-1"
			/>
		</div>
		<Input
			label="Email"
			type="email"
			placeholder="Email"
			bind:value={email}
			size="full"
			required
			autocomplete="email"
			labelClass="text-base-content font-semibold mb-1"
		/>
		<Input
			label="Onderwerp"
			type="text"
			placeholder="Onderwerp"
			bind:value={subject}
			size="full"
			required
			labelClass="text-base-content font-semibold mb-1"
		/>
		<Textarea
			label="Boodschap"
			placeholder="Boodschap"
			bind:value={message}
			size="full"
			required
			labelClass="text-base-content font-semibold mb-1"
		/>
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
		{#if successText}
			<div class="text-success flex gap-2 items-center mt-2">
				<Fa icon={faCheck} />
				<span>{successText}</span>
			</div>
		{/if}
	</form>
</div>
