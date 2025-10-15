<script lang="ts">
	import Input from "$components/formHelpers/Input.svelte"
	import Select from "$components/formHelpers/Select.svelte"
	import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export let firstName: string
	export let lastName: string
	export let emailAddress: string
	export let phoneNumber: string
	export let companyName: string
	export let btwNumber: string | null
	export let streetAndNumber: string
	export let postalCode: string
	export let place: string
	export let country: string

	export let errorMessage = ""
	export let submitLabel: string | null = null
	export let onSave: () => Promise<void>

	let saving = false

	async function onSubmitWrapper(event: SubmitEvent) {
		saving = true
		errorMessage = ""
		try {
			await onSave()
		} catch (error) {
			console.error(error)
			if (error instanceof Error) {
				errorMessage = error.toString()
			} else {
				errorMessage = "An unknown error occurred"
			}
		}
		saving = false
	}

	export let invoiceFormElement: HTMLFormElement
</script>

<form
	bind:this={invoiceFormElement}
	class="flex flex-col gap-1"
	on:submit|preventDefault={onSubmitWrapper}
>
	<div class="flex flex-col xs:flex-row gap-2">
		<Input
			type="text"
			label="Voornaam"
			placeholder="Voornaam"
			bind:value={firstName}
			size="full"
			required
			autocomplete="given-name"
		/>
		<Input
			type="text"
			label="Achternaam"
			placeholder="Achternaam"
			bind:value={lastName}
			size="full"
			required
			autocomplete="family-name"
		/>
	</div>
	<Input
		type="email"
		label="Emailadres"
		placeholder="Emailadres"
		bind:value={emailAddress}
		size="full"
		required
	/>
	<Input
		type="text"
		label="Telefoonnummer"
		placeholder="Telefoonnummer"
		bind:value={phoneNumber}
		size="full"
		required
	/>
	<Input
		type="text"
		label="Bedrijfsnaam / Naam organisatie"
		placeholder="Naam"
		bind:value={companyName}
		size="full"
		required
	/>
	<Input
		type="text"
		label="BTW-nummer (Optioneel)"
		placeholder="BTW nummer"
		bind:value={btwNumber}
		size="full"
	/>
	<Input
		type="text"
		label="Straatnaam en huisnummer"
		placeholder="Straatnaam en huisnummer"
		bind:value={streetAndNumber}
		size="full"
		required
		autocomplete="street-address"
	/>
	<div class="flex flex-col xs:flex-row gap-2">
		<Input
			type="text"
			label="Postcode"
			placeholder="Postcode"
			bind:value={postalCode}
			size="full"
			required
			autocomplete="postal-code"
		/>
		<Input
			type="text"
			label="Plaats"
			placeholder="Plaats"
			bind:value={place}
			size="full"
			required
			autocomplete="address-level2"
		/>
	</div>
	<Select
		label="Land"
		bind:value={country}
		required
		size="full"
		autocomplete="country-name"
	>
		<option value="BE">Belgie</option>
		<option value="NL">Nederland</option>
	</Select>
	{#if submitLabel}
		<button class="btn btn-primary mt-4 mb-1" type="submit" disabled={saving}>
			{submitLabel}
			<span class="loading loading-ring" class:hidden={!saving}></span>
		</button>
	{/if}

	{#if errorMessage}
		<div class="text-error flex gap-2 items-center">
			<Fa icon={faExclamationTriangle} />
			{errorMessage}
		</div>
	{/if}
</form>
