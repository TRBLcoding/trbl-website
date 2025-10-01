<script lang="ts">
	import {
		faEnvelope,
		faExclamationTriangle,
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

	async function onSubmitWrapper() {
		errorText = ""
		try {
			console.log("sending: ", subject)
			await send()
		} catch (error) {
			console.error(error)
			if (error instanceof Error) errorText = error.message
			else errorText = "Unknown error occurred"
		}
		saving = false
	}
</script>

<div class="max-w-lg">
	<div class="text-xl font-semibold mb-1 flex items-center gap-2">
		<Fa icon={faEnvelope} />
		Stuur een bericht
	</div>
	<form class="flex flex-col" on:submit={onSubmitWrapper}>
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
				class="input w-full h-30"
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
	</form>
</div>
