<script lang="ts">
	import Checkbox from "$components/formHelpers/Checkbox.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import InvoiceDetailsComponent from "$components/invoice/InvoiceDetailsComponent.svelte"
	import OrderComponent from "$components/invoice/OrderComponent.svelte"
	import type { InvoiceDetails } from "$lib/domain/InvoiceDetails"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import {
		faTicket
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	let firstName = "Lorin"
	let lastName = "Speybrouck"
	let emailAddress = "lorin.speybrouck@proximus.be"
	let phoneNumber = "+32 473 23 45 67"
	let companyName = "TBRL 2"
	let btwNumber: string | null = ""
	let streetAndNumber = "Spiedamstraat 25"
	let postalCode = "1899"
	let place = "Gent"
	let country = "Belgie"

	// Shipping address fields
	let shippingName = ""
	let shippingStreetAndNumber = ""
	let shippingPostalCode = ""
	let shippingPlace = ""
	let shippingCountry = ""

	let eventType = ""
	let rentPeriod = ""
	let todo = ""
	let visible = false
	let showCoupon = false

	let saving = false
	let form2: HTMLFormElement
	let form3: HTMLFormElement
	async function onSubmitWrapper() {
		// -- Validate forms(reverse order) --
		form3.reportValidity()
		form2.reportValidity()
		invoiceFormElement.reportValidity()

		if (
			!invoiceFormElement.checkValidity() ||
			!form2.checkValidity() ||
			!form3.checkValidity()
		)
			return

		saving = true
		const body = {}
		const response = await fetch("/api/invoice-request", {
			method: "POST",
			body: JSON.stringify(body),
		})
		const responseJson = await response.json()
		console.log(responseJson)
		saving = false
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Algemene Voorwaarden")

	let invoiceFormElement: HTMLFormElement
	let selectedInvoiceDetails: InvoiceDetails

	function coupon() {}
	let paymentMethod = "invoice"
	let deliveryMethod = "pickup"

	function useSameAsInvoice() {
		shippingName = `${firstName} ${lastName}`
		shippingStreetAndNumber = streetAndNumber
		shippingPostalCode = postalCode
		shippingPlace = place
		shippingCountry = country
	}
</script>

<div class="xl:max-w-2/3 mx-auto mt-4 mb-8">
	<h1 class="text-2xl font-bold mb-1">Offerte aanvragen</h1>

	<div class="flex gap-20 flex-col md:flex-row w-full">
		<div class="flex-1">
			<!-- Invoice details -->
			<InvoiceDetailsComponent
				bind:invoiceFormElement
				bind:selectedInvoiceDetails
				bind:firstName
				bind:lastName
				bind:emailAddress
				bind:phoneNumber
				bind:companyName
				bind:btwNumber
				bind:streetAndNumber
				bind:postalCode
				bind:place
				bind:country
			></InvoiceDetailsComponent>
			<!-- Rental information -->
			<div class="flex flex-col gap-1 mt-4">
				<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-1">
					Verhuurgegevens
				</h2>
				<form bind:this={form2}>
					<Input
						type="text"
						label="Type evenement"
						placeholder="Type evenement"
						bind:value={eventType}
						size="full"
						required
					/>
					<Input
						type="text"
						label="Huur periode"
						placeholder="Van waneer tot wanneer"
						bind:value={rentPeriod}
						size="full"
						required
					/>
				</form>
			</div>
			<!-- Shipping -->
			<div class="mt-4">
				<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-1">
					Levering
				</h2>

				<label
					class="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-base-200"
				>
					<input
						type="radio"
						name="delivery"
						class="radio radio-primary mt-0.5"
						value="pickup"
						bind:group={deliveryMethod}
					/>
					<span class="flex-1">
						<span class="font-medium"> Afhalen in Gent </span>
						<span class="block text-sm text-base-content/70 mt-1">
							Adres: Nederpolder 4 9000 Gent. Opgepast LEZ(Lage Emissie Zone)!
						</span>
					</span>
				</label>

				<label
					class="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-base-200"
				>
					<input
						type="radio"
						name="delivery"
						class="radio radio-primary mt-0.5"
						value="delivery"
						bind:group={deliveryMethod}
					/>
					<span class="flex-1">
						<span class="font-medium">Laten Leveren</span>
						<span class="block text-sm text-base-content/70 mt-1">
							Verzendkosten worden berekend bij opmaken van Offerte, afhankelijk
							van materiaal en afstand
						</span>
					</span>
				</label>

				{#if deliveryMethod === "delivery"}
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
								label="Naam ontvanger"
								placeholder="Volledige naam"
								bind:value={shippingName}
								size="full"
								required
							/>
							<Input
								type="text"
								label="Straat en nummer"
								placeholder="Straat en nummer"
								bind:value={shippingStreetAndNumber}
								size="full"
								required
							/>
							<div class="flex gap-2">
								<Input
									type="text"
									label="Postcode"
									placeholder="1000"
									bind:value={shippingPostalCode}
									size="half"
									required
								/>
								<Input
									type="text"
									label="Plaats"
									placeholder="Brussel"
									bind:value={shippingPlace}
									size="half"
									required
								/>
							</div>
							<Input
								type="text"
								label="Land"
								placeholder="België"
								bind:value={shippingCountry}
								size="full"
								required
							/>
						</div>
					</div>
				{/if}
			</div>
		</div>
		

		<div class="flex-1 max-w-lg">
			<!-- Order details -->
			<OrderComponent></OrderComponent>

			<!-- Coupon -->
			{#if !showCoupon}
				<div class="w-full flex items-end">
					<button
						type="button"
						class="btn btn-ghost btn-sm mt-2 ml-auto items-center"
						on:click={() => (showCoupon = true)}
					>
						<Fa icon={faTicket} class="" /> Heb je een coupon?
					</button>
				</div>
			{/if}
			{#if showCoupon}
				<div class="mb-3 mt-4">
					<Input
						type="text"
						placeholder="Coupon code"
						size="full"
						bind:value={todo}
					>
						<div slot="join">
							<button
								title="Toepassen"
								class="btn join-item border-2 border-l-0 border-[#d1d1d1] dark:border-[#474e56]"
								type="button"
								on:click={coupon}
							>
								Toepassen
							</button>
						</div>
					</Input>
					<button
						type="button"
						class="btn btn-ghost btn-sm mt-2"
						on:click={() => {
							showCoupon = false
							todo = ""
						}}
					>
						Annuleren
					</button>
				</div>
			{/if}

			<!-- Payment -->
			<form
				bind:this={form3}
				on:submit|preventDefault={onSubmitWrapper}
				novalidate
			>
				<div class="flex flex-col gap-1">
					<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-1">
						Betaling
					</h2>
					<label
						class="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-base-200"
					>
						<input
							type="radio"
							name="payment"
							class="radio radio-primary mt-0.5"
							value="invoice"
							bind:group={paymentMethod}
						/>
						<span class="flex-1">
							<span class="font-medium">Betaling op factuur</span>
							<span class="block text-sm text-base-content/70 mt-1">
								Maak je betaling rechtstreeks over op onze bankrekening. Gebruik
								je factuurnummer als betalingsreferentie
							</span>
						</span>
					</label>

					<label
						class="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-base-200"
					>
						<input
							type="radio"
							name="payment"
							class="radio radio-primary mt-0.5"
							value="delivery"
							bind:group={paymentMethod}
						/>
						<span class="flex-1">
							<span class="font-medium">Betaling bij levering</span>
							<span class="block text-sm text-base-content/70 mt-1">
								Contant betalen bij aflevering (Cash of Payconic/Wero)
							</span>
						</span>
					</label>
				</div>
				<!-- Confirm -->
				<div class="flex flex-col gap-3 mt-4">
					<span class="text-sm">
						Uw data wordt enkel gebruikt voor het verbeteren van de site en voor
						administratieve doeleinden. Lees meer in ons
						<a class="link" href="/tos">privacybeleid</a>.
					</span>
					<Checkbox bind:value={visible} size="full" required>
						<span slot="label" class="whitespace-normal">
							Ik heb de <a class="link" href="/tos">algemene voorwaarden</a> van
							de website gelezen en ga hiermee akkoord
						</span>
					</Checkbox>

					<button class="btn btn-primary mt-2" type="submit" disabled={saving}>
						Offerte aanvragen
						<span class="loading loading-ring" class:hidden={!saving}></span>
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
