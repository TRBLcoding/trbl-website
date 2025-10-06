<script lang="ts">
	import Checkbox from "$components/formHelpers/Checkbox.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import DeliveryComponent from "$components/invoice/DeliveryComponent.svelte"
	import InvoiceDetailsComponent from "$components/invoice/InvoiceDetailsComponent.svelte"
	import OrderComponent from "$components/invoice/OrderComponent.svelte"
	import type { InvoiceDetails } from "$lib/domain/InvoiceDetails"
	import type { InvoiceRequest } from "$lib/domain/InvoiceRequest"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import {
		faExclamationTriangle,
		faTicket,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	// Shipping address fields
	let deliveryFirstName = ""
	let deliveryLastName = ""
	let deliveryStreetAndNumber = ""
	let deliveryPostalCode = ""
	let deliveryPlace = ""
	let deliveryCountry = ""

	let eventType = "Bedrijfsfeest"
	let rentPeriod = "Ooit"
	let paymentMethod: "bank-transfer" | "cash" = "bank-transfer"
	let deliveryMethod: "pick-up" | "delivery" = "pick-up"
	let couponCode = ""
	let appliedCouponCode: string | null = null
	let acceptedTOS = true

	let showCouponInput = false
	let saving = false
	let errorText = ""

	let form2: HTMLFormElement
	let form3: HTMLFormElement

	function areFormsValid() {
		form3.reportValidity()
		form2.reportValidity()
		if (!$authStore) invoiceFormElement.reportValidity()

		if (
			(!$authStore && !invoiceFormElement.checkValidity()) ||
			!form2.checkValidity() ||
			!form3.checkValidity()
		)
			return false
		return true
	}

	const selectedProducts= [{id: 1, amount: 2}]

	async function onSubmitWrapper() {
		// -- Validate forms(reverse order) --
		errorText = ""
		if (!areFormsValid()) return
		saving = true

		try {
			console.log(selectedInvoiceDetails)
			const body: InvoiceRequest = {
				firstName: selectedInvoiceDetails.firstName,
				lastName: selectedInvoiceDetails.lastName,
				emailAddress: selectedInvoiceDetails.emailAddress,
				phoneNumber: selectedInvoiceDetails.phoneNumber,
				companyName: selectedInvoiceDetails.companyName,
				BTWNumber: selectedInvoiceDetails.BTWNumber,
				streetAndNumber: selectedInvoiceDetails.streetAndNumber,
				postalCode: selectedInvoiceDetails.postalCode,
				place: selectedInvoiceDetails.place,
				country: selectedInvoiceDetails.country,
				eventType,
				rentPeriod,
				couponCode: appliedCouponCode,
				paymentMethod,
				deliveryMethod,
				selectedProducts: selectedProducts,
				...(deliveryMethod === "delivery" && {
					deliveryDetails: {
						deliveryFirstName,
						deliveryLastName,
						deliveryStreetAndNumber,
						deliveryPostalCode,
						deliveryPlace,
						deliveryCountry,
					},
				}),
			}
			const response = await fetch("/api/invoice-request", {
				method: "POST",
				body: JSON.stringify(body),
			})
			const responseJson = await response.json()
			console.log(responseJson)
		} catch (error) {
			console.error(error)
			if (error instanceof Error) errorText = error.message
			else errorText = "Unknown error occurred"
		}

		saving = false
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Offerte aanvragen")

	let invoiceFormElement: HTMLFormElement
	let selectedInvoiceDetails: InvoiceDetails

	function applyCoupon() {
		// TODO: Validate coupon
		appliedCouponCode = couponCode
		couponCode = ""
	}

	function useSameAsInvoice() {
		deliveryFirstName = selectedInvoiceDetails.firstName
		deliveryLastName = selectedInvoiceDetails.lastName
		deliveryStreetAndNumber = selectedInvoiceDetails.streetAndNumber
		deliveryPostalCode = selectedInvoiceDetails.postalCode
		deliveryPlace = selectedInvoiceDetails.place
		deliveryCountry = selectedInvoiceDetails.country
	}
</script>

<div class="xl:max-w-2/3 mx-auto mt-4 mb-8 p-4">
	<h1 class="text-2xl font-bold mb-1">Offerte aanvragen</h1>

	<div class="flex md:gap-20 flex-col md:flex-row w-full">
		<div class="flex-1">
			<!-- Invoice details -->
			<InvoiceDetailsComponent
				bind:invoiceFormElement
				bind:selectedInvoiceDetails
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
						value="pick-up"
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
					<DeliveryComponent
						bind:deliveryFirstName
						bind:deliveryLastName
						bind:deliveryStreetAndNumber
						bind:deliveryPostalCode
						bind:deliveryPlace
						bind:deliveryCountry
						{useSameAsInvoice}
					></DeliveryComponent>
				{/if}
			</div>
		</div>

		<div class="flex-1 max-w-lg">
			<!-- Order details -->
			<OrderComponent></OrderComponent>

			<!-- Coupon -->
			{#if !showCouponInput}
				<div class="w-full flex items-end">
					<button
						type="button"
						class="btn btn-ghost btn-sm mt-2 ml-auto items-center"
						on:click={() => (showCouponInput = true)}
					>
						<Fa icon={faTicket} class="" /> Heb je een coupon?
					</button>
				</div>
			{/if}
			{#if showCouponInput}
				<div class="mb-3 mt-4">
					<Input
						type="text"
						placeholder="Coupon code"
						size="full"
						bind:value={couponCode}
					>
						<div slot="join">
							<button
								title="Toepassen"
								class="btn join-item border-2 border-l-0 border-[#d1d1d1] dark:border-[#474e56]"
								type="button"
								on:click={applyCoupon}
							>
								Toepassen
							</button>
						</div>
					</Input>
					<button
						type="button"
						class="btn btn-ghost btn-sm mt-2"
						on:click={() => (showCouponInput = false)}
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
							value="bank-transfer"
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
							value="cash"
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
					<Checkbox bind:value={acceptedTOS} size="full" required>
						<span slot="label" class="whitespace-normal">
							Ik heb de <a class="link" href="/tos">algemene voorwaarden</a> van
							de website gelezen en ga hiermee akkoord
						</span>
					</Checkbox>

					<button class="btn btn-primary mt-2" type="submit" disabled={saving}>
						Offerte aanvragen
						<span class="loading loading-ring" class:hidden={!saving}></span>
					</button>
					{#if errorText}
						<div class="text-error flex gap-2 items-center mt-2">
							<Fa icon={faExclamationTriangle} />
							<span>{errorText}</span>
						</div>
					{/if}
				</div>
			</form>
		</div>
	</div>
</div>
