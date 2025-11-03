<script lang="ts">
	import Input from "$components/formHelpers/Input.svelte"
	import Select from "$components/formHelpers/Select.svelte"
	import { authStore } from "$lib/stores/AuthStore"

	export let deliveryFirstName: string
	export let deliveryLastName: string
	export let deliveryStreetAndNumber: string
	export let deliveryPostalCode: string
	export let deliveryPlace: string
	export let deliveryCountry: string
	export let useSameAsInvoice: () => void
	export let invoiceSelected: boolean
</script>

<div class="mt-4 p-4 bg-base-200 rounded-lg">
	<div class="flex justify-between items-center mb-3">
		<h3 class="font-semibold">Leveringsadres</h3>
		<div
			class:tooltip={!invoiceSelected}
			class="tooltip-bottom"
			data-tip={$authStore
				? "Selecteer eerst een factuuradres"
				: "Vul eerst de factuurgegevens in"}
		>
			<button
				type="button"
				class="btn btn-sm btn-ghost"
				on:click={useSameAsInvoice}
			>
				Zelfde als factuuradres
			</button>
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<div class="flex flex-col xs:flex-row gap-2">
			<Input
				type="text"
				label="Voornaam"
				placeholder="Voornaam"
				bind:value={deliveryFirstName}
				size="full"
				required
				autocomplete="given-name"
			/>
			<Input
				type="text"
				label="Achternaam"
				placeholder="Achternaam"
				bind:value={deliveryLastName}
				size="full"
				required
				autocomplete="family-name"
			/>
		</div>
		<Input
			type="text"
			label="Straat en nummer"
			placeholder="Straat en nummer"
			bind:value={deliveryStreetAndNumber}
			size="full"
			required
			autocomplete="street-address"
		/>
		<div class="flex flex-col xs:flex-row gap-2">
			<Input
				type="text"
				label="Postcode"
				placeholder="Postcode"
				bind:value={deliveryPostalCode}
				size="full"
				required
			/>
			<Input
				type="text"
				label="Plaats"
				placeholder="Plaats"
				bind:value={deliveryPlace}
				size="full"
				required
				autocomplete="address-level2"
			/>
		</div>
		<Select
			label="Land"
			bind:value={deliveryCountry}
			required
			size="full"
			autocomplete="country-name"
		>
			<option value="BE">Belgie</option>
			<option value="NL">Nederland</option>
		</Select>
	</div>
</div>
