<script lang="ts">
	import { resolve } from "$app/paths"
	import Checkbox from "$components/formHelpers/Checkbox.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import RadioGroup from "$components/formHelpers/RadioGroup.svelte"
	import DeliveryComponent from "$components/invoice/DeliveryComponent.svelte"
	import InvoiceDetailsComponent from "$components/invoice/InvoiceDetailsComponent.svelte"
	import OrderComponent from "$components/invoice/OrderComponent.svelte"
	import type { InvoiceDetails } from "$lib/domain/InvoiceDetails"
	import type {
		DeliveryMethod,
		InvoiceRequest,
		PaymentMethod,
	} from "$lib/domain/InvoiceRequest"
	import type { ProductOrder } from "$lib/domain/ProductOrder"
	import { authStore } from "$lib/stores/AuthStore"
	import { cartStore } from "$lib/stores/CartStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import {
		faCartShopping,
		faCheckCircle,
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

	let eventType = ""
	let rentPeriod = ""
	let paymentMethod: PaymentMethod = "bank-transfer"
	let deliveryMethod: DeliveryMethod = "pick-up"
	let couponCode = ""
	let appliedCouponCode: string | null = null
	let acceptedTOS = false

	let showCouponInput = false
	let saving = false
	let errorText = ""

	let form2: HTMLFormElement
	let form3: HTMLFormElement

	function areFormsValid() {
		errorText = ""
		form3.reportValidity()
		form2.reportValidity()
		if (!$authStore) invoiceFormElement.reportValidity()
		else if (!selectedInvoiceDetails) {
			errorText = "Geen factuurgegevens geselecteerd"
			return false
		}

		if (
			(!$authStore && !invoiceFormElement.checkValidity()) ||
			!form2.checkValidity() ||
			!form3.checkValidity()
		)
			return false
		return true
	}

	let cartSnapshot: Promise<ProductOrder>[] = []
	let succesFullySubmitted = false
	async function onSubmitWrapper() {
		// -- Validate forms(reverse order) --
		errorText = ""
		succesFullySubmitted = false
		if (!$cartStore || !areFormsValid()) return
		saving = true
		try {
			const selectedProducts = (await Promise.all($cartStore)).map((e) => ({
				id: e.product.id,
				amount: e.amount,
			}))
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
			cartSnapshot = $cartStore
			succesFullySubmitted = true
			cartStore.clear()
		} catch (error) {
			console.error(error)
			if (error instanceof Error) errorText = error.message
			else errorText = "Unknown error occurred"
		}

		saving = false
	}

	let invoiceFormElement: HTMLFormElement
	let selectedInvoiceDetails: InvoiceDetails

	function applyCoupon() {
		// TODO: Validate coupon
		appliedCouponCode = couponCode
		couponCode = ""
	}

	function useSameAsInvoice() {
		if (!$authStore && !invoiceFormElement.reportValidity()) return
		deliveryFirstName = selectedInvoiceDetails.firstName
		deliveryLastName = selectedInvoiceDetails.lastName
		deliveryStreetAndNumber = selectedInvoiceDetails.streetAndNumber
		deliveryPostalCode = selectedInvoiceDetails.postalCode
		deliveryPlace = selectedInvoiceDetails.place
		deliveryCountry = selectedInvoiceDetails.country
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Offerte aanvragen")
</script>

<div class="max-w-6xl mx-auto p-3 sm:p-6 mb-4 sm:mb-8">
	<h1 class="text-2xl font-bold mb-1">Offerte aanvragen</h1>
	{#if $cartStore === undefined}
		Loading <span class="loading loading-ring"></span>
	{:else if $cartStore.length > 0 || cartSnapshot.length > 0}
		<!-- else if content here -->
		<div class="flex md:gap-20 flex-col md:flex-row w-full">
			<div class="flex-1">
				<!-- Invoice details -->
				<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-3">
					Factuurgegevens
				</h2>
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
							placeholder="Van wanneer tot wanneer"
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
					<RadioGroup
						value1="pick-up"
						value2="delivery"
						bind:groupValue={deliveryMethod}
					>
						<span slot="title1">Afhalen in Gent</span>
						<span slot="content1">
							Adres: Nederpolder 4 9000 Gent. Opgepast LEZ(Lage Emissie Zone)!
						</span>
						<span slot="title2">Laten Leveren</span>
						<span slot="content2">
							Verzendkosten worden berekend bij opmaken van Offerte, afhankelijk
							van materiaal en afstand
						</span>
					</RadioGroup>

					{#if deliveryMethod === "delivery"}
						<DeliveryComponent
							bind:deliveryFirstName
							bind:deliveryLastName
							bind:deliveryStreetAndNumber
							bind:deliveryPostalCode
							bind:deliveryPlace
							bind:deliveryCountry
							{useSameAsInvoice}
							invoiceSelected={selectedInvoiceDetails !== undefined}
						></DeliveryComponent>
					{/if}
				</div>
			</div>

			<div class="flex-1 max-w-lg">
				<!-- Order details -->
				<OrderComponent
					productOrders={succesFullySubmitted ? cartSnapshot : $cartStore}
					{deliveryMethod}
				></OrderComponent>

				<!-- Coupon -->
				{#if !showCouponInput}
					<div class="w-full flex items-end">
						<button
							type="button"
							class="btn btn-ghost btn-sm mt-2 ml-auto items-center"
							on:click={() => (showCouponInput = true)}
						>
							<Fa icon={faTicket} /> Heb je een coupon?
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
						<h2
							class="text-lg font-semibold pb-1 border-b border-base-300 mb-1"
						>
							Betaling
						</h2>
						<RadioGroup
							value1="bank-transfer"
							value2="cash"
							bind:groupValue={paymentMethod}
						>
							<span slot="title1">Betaling op factuur</span>
							<span slot="content1">
								Maak je betaling rechtstreeks over op onze bankrekening. Gebruik
								je factuurnummer als betalingsreferentie
							</span>
							<span slot="title2">Betaling bij levering</span>
							<span slot="content2">
								Contant betalen bij aflevering (Cash of Payconic/Wero)
							</span>
						</RadioGroup>
					</div>
					<div class="flex flex-col gap-3 mt-4">
						<span class="text-sm">
							Uw data wordt enkel gebruikt voor het verbeteren van de site en
							voor administratieve doeleinden. Lees meer in ons
							<a class="link" href={resolve("/privacy-policy")}>privacybeleid</a
							>.
						</span>
						<Checkbox bind:value={acceptedTOS} size="full" required>
							<span slot="label" class="whitespace-normal">
								Ik heb de <a class="link" href={resolve("/tos")}
									>algemene voorwaarden</a
								> van de website gelezen en ga hiermee akkoord
							</span>
						</Checkbox>

						<button
							class="btn btn-primary mt-2"
							type="submit"
							disabled={saving || succesFullySubmitted}
						>
							Offerte aanvragen
							<span class="loading loading-ring" class:hidden={!saving}></span>
						</button>
						{#if errorText}
							<div class="text-error flex gap-2 items-center mt-2">
								<Fa icon={faExclamationTriangle} />
								<span>{errorText}</span>
							</div>
						{/if}
						{#if succesFullySubmitted}
							<div class="text-success flex gap-2 items-center mt-2">
								<Fa icon={faCheckCircle} />
								<span>
									Uw aanvraag tot offerte is succesvol verstuurd, u ontvangt
									binnenkort ook een bevestiging via mail.
								</span>
							</div>
						{/if}
					</div>
				</form>
			</div>
		</div>
	{:else}
		<div class="flex justify-center bg-base-200 rounded-xl py-12 mt-3">
			<div class="max-w-md flex items-center flex-col gap-4 text-center">
				<Fa icon={faCartShopping} size="4x" />
				<h2 class="text-3xl font-bold">Uw winkelwagen is leeg</h2>
				<p class="text-lg mb-2">
					Voeg eerst producten toe aan uw winkelmandje om een offerte aan te
					vragen.
				</p>
				<a href={resolve("/products")} class="btn btn-primary btn-lg gap-2">
					Bekijk ons aanbod
				</a>
			</div>
		</div>
	{/if}
</div>
