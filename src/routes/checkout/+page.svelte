<script lang="ts">
	import Checkbox from "$components/formHelpers/Checkbox.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import InvoiceDetailsComponent from "$components/invoice/InvoiceDetailsComponent.svelte"
	import type { InvoiceDetails } from "$lib/domain/InvoiceDetails"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"

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

	let eventType = ""
	let rentPeriod = ""
	let todo = ""
	let visible = false

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

	    // Price calculation
    const subtotal = 165.0
    const shippingCost = 25.0
    $: total = subtotal + (true ? shippingCost : 0)


	// -- Page title --
	pageHeadStore.updatePageTitle("Algemene Voorwaarden")

	let invoiceFormElement: HTMLFormElement
	let selectedInvoiceDetails: InvoiceDetails
</script>

<div class="xl:max-w-2/3 mx-auto mt-4 mb-8">
	<div class="flex flex-row gap-3 items-center mb-1">
		<h1 class="text-2xl font-bold">Offerte aanvragen</h1>
	</div>

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
				<Checkbox
					label="Afhalen op Nederpolder 4 9000 Gent (LEZ)"
					bind:value={visible}
				/>
				<Checkbox label="Laten Leveren" bind:value={visible} />
			</div>
		</div>
		<div class="flex-1">
			<!-- Your order -->
			<!-- Your order -->
			<div>
				<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-1">
					Jouw besteling
				</h2>

				<div class="flex flex-col gap-3 mt-3 bg-base-200 rounded-lg p-4">
					<!-- Product 1 -->
					<div class="flex gap-3 pb-3 border-b border-base-300">
						<img
							src="https://placehold.co/80x80"
							alt="Product"
							class="w-20 h-20 object-cover rounded"
						/>
						<div class="flex-1 flex justify-between">
							<div>
								<h3 class="font-semibold">Stoelen</h3>
								<p class="text-sm text-base-content/70">€ 40,00</p>
								<div class="flex justify-between items-center mt-2">
									<span class="text-sm badge badge-soft">Aantal: 20</span>
								</div>
							</div>
							<span class="font-semibold">€ 40,00</span>
						</div>
					</div>

					<!-- Product 2 -->
					<div class="flex gap-3 pb-3 border-b border-base-300">
						<img
							src="https://placehold.co/80x80"
							alt="Product"
							class="w-20 h-20 object-cover rounded"
						/>
						<div class="flex-1 flex justify-between">
							<div>
								<h3 class="font-semibold">Stoelen</h3>
								<p class="text-sm text-base-content/70">€ 40,00</p>
								<div class="flex justify-between items-center mt-2">
									<span class="text-sm badge badge-soft">Aantal: 20</span>
								</div>
							</div>
							<span class="font-semibold">€ 40,00</span>
						</div>
					</div>

					<!-- Product 3 -->
					<div class="flex gap-3 pb-1 border-base-100">
						<img
							src="https://placehold.co/80x80"
							alt="Product"
							class="w-20 h-20 object-cover rounded"
						/>
						<div class="flex-1 flex justify-between">
							<div>
								<h3 class="font-semibold">Stoelen</h3>
								<p class="text-sm text-base-content/70">€ 40,00</p>
								<div class="flex justify-between items-center mt-2">
									<span class="text-sm badge badge-soft">Aantal: 20</span>
								</div>
							</div>
							<span class="font-semibold">€ 40,00</span>
						</div>
					</div>

					<!-- Totaal -->
                    <div class="flex flex-col gap-2 pt-2 border-t-2 border-base-300">
                        <div class="flex justify-between items-center font-semibold">
                            <span>Subtotaal</span>
                            <span>€ {subtotal?.toFixed(2)}</span>
                        </div>
              
                            <div class="flex justify-between items-center font-semibold">
                                <span>Levering</span>
                                <span>€ {shippingCost?.toFixed(2)}</span>
                            </div>
							
                        <div class="flex justify-between items-center font-bold text-lg border-t border-base-300 pt-2">
                            <span>Totaal</span>
                            <span class="text-green-600">€ {total?.toFixed(2)}</span>
                        </div>
                    </div>
				</div>
			</div>

			<!-- Payment -->
			<form
				bind:this={form3}
				on:submit|preventDefault={onSubmitWrapper}
				novalidate
			>
				<div class="flex flex-col gap-1 mt-4">
					<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-1">
						Betaling
					</h2>
					<Checkbox label="Betaling op factuur" bind:value={visible} />
					<Checkbox label="Betaling bij levering" bind:value={visible} />
					<Input
						type="text"
						label="Coupon"
						placeholder="Van waneer tot wanneer"
						bind:value={todo}
					/>
				</div>
				<!-- Confirm -->
				<div class="flex flex-col gap-1 mt-4">
					<span class="text-sm">
						Uw data wordt enkel gebruikt voor het verbeteren van de site en voor
						administratieve doeleinden. Lees meer in ons
						<a class="link" href="/tos">privacybeleid</a>
						.
					</span>
					<Checkbox
						label="Ik heb de algemene voorwaarden van de website gelezen en ga hiermee akkoord"
						bind:value={visible}
						required
					/>

					<button class="btn btn-primary mt-3" type="submit" disabled={saving}>
						Offerte aanvragen
						<span class="loading loading-ring" class:hidden={!saving}></span>
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
