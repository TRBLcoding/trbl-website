<script lang="ts">
	import Input from "$components/formHelpers/Input.svelte"

	export let deliveryFirstName: string
	export let deliveryLastName: string
	export let deliveryStreetAndNumber: string
	export let deliveryPostalCode: string
	export let deliveryPlace: string
	export let deliveryCountry: string
	export let useSameAsInvoice: () => void
</script>

<div class="mt-4 p-4 bg-base-200 rounded-lg">
	<div class="flex justify-between items-center mb-3">
		<h3 class="font-semibold">Leveringsadres</h3>
		<button
			type="button"
			class="btn btn-sm btn-ghost"
			on:click={useSameAsInvoice}
		>
			Zelfde als factuuradres
		</button>
	</div>
	<div class="flex flex-col gap-2">
			<Input
		type="text"
		label="Voornaam"
		placeholder="Voornaam"
		bind:value={deliveryFirstName}
		size="full"
		required
	/>
	<Input
		type="text"
		label="Achternaam"
		placeholder="Achternaam"
		bind:value={deliveryLastName}
		size="full"
		required
	/>
		<Input
			type="text"
			label="Straat en nummer"
			placeholder="Straat en nummer"
			bind:value={deliveryStreetAndNumber}
			size="full"
			required
		/>
		<div class="flex gap-2">
			<Input
				type="text"
				label="Postcode"
				placeholder="1000"
				bind:value={deliveryPostalCode}
				size="full"
				required
			/>
			<Input
				type="text"
				label="Plaats"
				placeholder="Brussel"
				bind:value={deliveryPlace}
				size="full"
				required
			/>
		</div>
		<Input
			type="text"
			label="Land"
			placeholder="België"
			bind:value={deliveryCountry}
			size="full"
			required
		/>
	</div>
</div>
