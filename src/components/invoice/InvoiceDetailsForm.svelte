<script lang="ts">
	import EditDropdown from "$components/EditDropdown.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import Select from "$components/formHelpers/Select.svelte"
	import { InvoiceDetails } from "$lib/domain/InvoiceDetails"
	import { authStore } from "$lib/stores/AuthStore"
	import { invoiceDetailsStore } from "$lib/stores/InvoiceDetailsStore"
	import {
		faBorderNone,
		faExclamationTriangle,
		faPlus,
		faXmark,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import { slide } from "svelte/transition"

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

	let showForm = true
	let saving = false
	let errorMessage = ""
	let selectedInvoiceDetails: number | undefined = undefined

	let upperErrorMessage = ""

	async function onSubmitWrapper() {
		saving = true
		errorMessage = ""
		try {
			if (!$authStore)
				throw new Error("User must be logged in to create Invoice Details")
			const userId = $authStore.auth_id
			const newInvoiceDetails = new InvoiceDetails(
				-1, // temporary id
				userId,
				firstName,
				lastName,
				phoneNumber,
				emailAddress,
				companyName,
				btwNumber,
				streetAndNumber,
				postalCode,
				place,
				country
			)
			await invoiceDetailsStore.createInvoiceDetails(newInvoiceDetails)
			firstName = ""
			lastName = ""
			emailAddress = ""
			phoneNumber = ""
			companyName = ""
			btwNumber = null
			streetAndNumber = ""
			postalCode = ""
			place = ""
			country = ""
			showForm = false
		} catch (error) {
			console.error(error)
			if (error instanceof Error) errorMessage = error.message
			else errorMessage = "Unknown error occured"
		}
		saving = false
	}
	async function deleteInvoiceDetails(invoiceDetails: InvoiceDetails) {
		upperErrorMessage = ""
		try {
			await invoiceDetailsStore.deleteInvoiceDetails(invoiceDetails)
		} catch (error) {
			console.error(error)
			if (error instanceof Error) upperErrorMessage = error.message
			else upperErrorMessage = "Unknown error occured"
		}
	}

	function selectInvoiceDetails(index: number) {
		selectedInvoiceDetails = index
	}

	let editing = false
	function startEdit(invoiceDetails: InvoiceDetails) {
		editing = true
		firstName = invoiceDetails.fistName
		lastName = invoiceDetails.lastName
		emailAddress = invoiceDetails.emailAddress
		phoneNumber = invoiceDetails.phoneNumber
		companyName = invoiceDetails.companyName
		btwNumber = invoiceDetails.BTWNumber
		streetAndNumber = invoiceDetails.streetAndNumber
		postalCode = invoiceDetails.postalCode
		place = invoiceDetails.place
		country = invoiceDetails.country
		showForm = true
	}
	function startCreate() {
		editing = false
		firstName = ""
		lastName = ""
		emailAddress = ""
		phoneNumber = ""
		companyName = ""
		btwNumber = null
		streetAndNumber = ""
		postalCode = ""
		place = ""
		country = ""
		showForm = true
	}
</script>

<div class="flex flex-col gap-1">
	<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-1">
		Factuurgegevens
	</h2>
	<div class="p-4 bg-base-200 rounded-lg mb-2">
		<div class="flex flex-col gap-2 mb-2">
			{#await invoiceDetailsStore.initPromise}
				Loading
			{:then}
				{#each $invoiceDetailsStore as invoiceDetails, i}
					<div class="relative">
						<button
							class="w-full flex flex-col items-start bg-base-100 p-2 rounded-lg border-2 border-[#d1d1d1] cursor-pointer hover:bg-base-300"
							class:bg-base-300={selectedInvoiceDetails === i}
							type="button"
							on:click={() => selectInvoiceDetails(i)}
						>
							<div class="text-sm italic">
								{#if selectedInvoiceDetails === i}
									<span class="text-success">Geselecteeerd</span>
								{:else}
									Alternatief
								{/if}
							</div>
							<div class="font-semibold">
								{invoiceDetails.fistName}
								{invoiceDetails.lastName} • {invoiceDetails.companyName}
							</div>
							<div class="text-sm">
								{invoiceDetails.streetAndNumber} • {invoiceDetails.postalCode}
								{invoiceDetails.place} • {invoiceDetails.country}
							</div>
						</button>
						<div class="absolute right-2 top-2">
							<EditDropdown
								size="xs"
								editHandler={() => startEdit(invoiceDetails)}
								deleteHandler={() => deleteInvoiceDetails(invoiceDetails)}
							></EditDropdown>
						</div>
					</div>
				{:else}
					<div class="flex flex-col gap-4 my-2 items-center">
						<Fa icon={faBorderNone} size="2x" />
						<span>Geen opgeslagen factuurgegevens</span>
					</div>
				{/each}
			{:catch error}
				<div class="text-error">{error}</div>
			{/await}
		</div>
		{#if upperErrorMessage}
			<div class="text-error flex gap-2 items-center">
				<Fa icon={faExclamationTriangle} />
				{upperErrorMessage}
			</div>
		{/if}
		<button class="btn btn-ghost" type="button" on:click={startCreate}>
			<Fa icon={faPlus} />
			Factuurgegevens toevoegen
		</button>
	</div>
	{#if showForm}
		<div
			class="p-4 bg-base-200 rounded-lg relative"
			transition:slide={{ duration: 300 }}
		>
			<button
				type="button"
				class="btn btn-sm btn-square btn-ghost absolute right-3 top-3"
				on:click={() => (showForm = false)}
			>
				<Fa icon={faXmark} />
			</button>
			<form
				class="flex flex-col gap-1"
				on:submit|preventDefault={onSubmitWrapper}
			>
				<h3 class="font-semibold mb-2">
					{editing ? "Factuurgegevens aanpassen" : "Nieuwe factuurgegevens"}
				</h3>
				<Input
					type="text"
					label="Voornaam"
					placeholder="Voornaam"
					bind:value={firstName}
					size="full"
					required
				/>
				<Input
					type="text"
					label="Achternaam"
					placeholder="Achternaam"
					bind:value={lastName}
					size="full"
					required
				/>
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
				<Select label="Land" bind:value={country} required size="full">
					<option>Belgie</option>
					<option>Nederland</option>
				</Select>
				<Input
					type="text"
					label="Straatnaam en huisnummer"
					placeholder="Straatnaam en huisnummer"
					bind:value={streetAndNumber}
					size="full"
					required
				/>
				<Input
					type="text"
					label="Postcode"
					placeholder="Postcode"
					bind:value={postalCode}
					size="full"
					required
				/>
				<Input
					type="text"
					label="Plaats"
					placeholder="Plaats"
					bind:value={place}
					size="full"
					required
				/>
				<button
					class="btn btn-primary mt-4 mb-1"
					type="submit"
					disabled={saving}
				>
					Factuurgegevens {editing ? "aanpassen" : "aanmaken"}
					<span class="loading loading-ring" class:hidden={!saving}></span>
				</button>
				{#if errorMessage}
					<div class="text-error flex gap-2 items-center">
						<Fa icon={faExclamationTriangle} />
						{errorMessage}
					</div>
				{/if}
			</form>
		</div>
	{/if}
</div>
