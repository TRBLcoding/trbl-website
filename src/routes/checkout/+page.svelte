<script lang="ts">
	import Checkbox from "$components/formHelpers/Checkbox.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import Select from "$components/formHelpers/Select.svelte"
	import InvoiceDetailsForm from "$components/invoice/InvoiceDetailsForm.svelte"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"

	let firstName = ""
	let lastName = ""
	let emailAddress = ""
	let phoneNumber = ""
	let todo = "" 
	let visible = false

	// -- Page title --
	pageHeadStore.updatePageTitle("Algemene Voorwaarden")
</script>

<div class="xl:max-w-2/3 mx-auto mt-4 mb-8">
	<div class="flex flex-row gap-3 items-center mb-1">
		<h1 class="text-2xl font-bold">Offerte aanvragen</h1>
	</div>

	<form action="" class="flex flex-col md:flex-row w-full">
		<div class="flex-1">
			<!-- Invoice details -->
			<InvoiceDetailsForm></InvoiceDetailsForm>
			<!-- Rental information -->
			<div class="flex flex-col gap-1 max-w-sm mt-4">
				<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-1">
					Verhuurgegevens
				</h2>
				<Input
					type="text"
					label="Type evenement"
					placeholder="Type evenement"
					bind:value={firstName}
					required
				/>
				<Input
					type="text"
					label="Huur periode"
					placeholder="Van waneer tot wanneer"
					bind:value={firstName}
					required
				/>
			</div>
			<!-- Shipping -->
		</div>
		<div class="flex-1">
			<!-- Your order -->

			<!-- Payment -->
			<div class="flex flex-col gap-1 max-w-sm mt-4">
				<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-1">
					Betaling
				</h2>
				<Checkbox label="Betaling op factuur" bind:value={visible} />
				<Checkbox label="Betaling bij levering" bind:value={visible} />
				<Input
					type="text"
					label="Coupon"
					placeholder="Van waneer tot wanneer"
					bind:value={firstName}
					required
				/>
			</div>
			<!-- Confirm -->
			<div class="flex flex-col gap-1 max-w-sm mt-4">
				<span class="text-sm">
					Uw data wordt enkel gebruikt voor het verbeteren van de site en voor
					administratieve doeleinden. Lees meer in ons
					<a class="link" href="/tos">privacybeleid</a>
					.
				</span>
				<Checkbox
					label="Ik heb de algemene voorwaarden van de website gelezen en ga hiermee akkoord *"
					bind:value={visible}
				/>

				<button class="btn btn-primary mt-3">Offerte aanvragen</button>
			</div>
		</div>
	</form>
</div>
