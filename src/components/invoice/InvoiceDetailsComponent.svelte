<script lang="ts">
	import EditDropdown from "$components/EditDropdown.svelte"
	import { InvoiceDetails } from "$lib/domain/InvoiceDetails"
	import { authStore } from "$lib/stores/AuthStore"
	import { invoiceDetailsStore } from "$lib/stores/InvoiceDetailsStore"
	import {
		faBorderNone,
		faExclamationTriangle,
		faPlus,
		faUser,
		faXmark,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import { slide } from "svelte/transition"
	import InvoiceDetailsForm from "./InvoiceDetailsForm.svelte"
	import LoginPrompt from "$components/LoginPrompt.svelte"

	export let invoiceFormElement: HTMLFormElement
	export let selectedInvoiceDetails: InvoiceDetails

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

	let showForm = false
	let errorMessage = ""

	function clearInputs() {
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
	}
	async function save() {
		if (!$authStore)
			throw new Error("User must be logged in to create Invoice Details")
		const userId = $authStore.auth_id
		const newInvoiceDetails = new InvoiceDetails(
			-1, // temporary id
			userId,
			firstName,
			lastName,
			emailAddress,
			phoneNumber,
			companyName,
			btwNumber,
			streetAndNumber,
			postalCode,
			place,
			country
		)
		await invoiceDetailsStore.createInvoiceDetails(newInvoiceDetails)
		clearInputs()
		showForm = false
	}
	async function deleteInvoiceDetails(invoiceDetails: InvoiceDetails) {
		errorMessage = ""
		try {
			await invoiceDetailsStore.deleteInvoiceDetails(invoiceDetails)
		} catch (error) {
			console.error(error)
			if (error instanceof Error) errorMessage = error.message
			else errorMessage = "Unknown error occured"
		}
		firstName
	}

	let editing = false
	function startEdit(invoiceDetails: InvoiceDetails) {
		editing = true
		firstName = invoiceDetails.firstName
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
		clearInputs()
		showForm = true
	}

	function createLocalInvoiceDetails(
		firstName: string,
		lastName: string,
		emailAddress: string,
		phoneNumber: string,
		companyName: string,
		btwNumber: string | null,
		streetAndNumber: string,
		postalCode: string,
		place: string,
		country: string
	) {
		return new InvoiceDetails(
			-1, // temporary id
			"NoAuthId",
			firstName,
			lastName,
			emailAddress,
			phoneNumber,
			companyName,
			btwNumber,
			streetAndNumber,
			postalCode,
			place,
			country
		)
	}

	let debounceTimer: ReturnType<typeof setTimeout>
	$: if (!$authStore && invoiceFormElement?.checkValidity()) {
		clearTimeout(debounceTimer)
		debounceTimer = setTimeout(() => {
			selectedInvoiceDetails = createLocalInvoiceDetails(
				firstName,
				lastName,
				emailAddress,
				phoneNumber,
				companyName,
				btwNumber,
				streetAndNumber,
				postalCode,
				place,
				country
			)
		}, 300)
	}
</script>

<div class="flex flex-col">
	<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-1">
		Factuurgegevens
	</h2>

	{#if $authStore}
		<div class="p-4 bg-base-200 rounded-lg mb-2 mt-2">
			<div class="flex flex-col gap-2 mb-2">
				{#await invoiceDetailsStore.initPromise}
					Loading
				{:then}
					{#each $invoiceDetailsStore as invoiceDetails, i}
						<div class="relative">
							<button
								class="w-full flex flex-col items-start bg-base-100 p-2 rounded-lg border-2 border-[#d1d1d1] dark:border-[#474e56] cursor-pointer hover:bg-base-300"
								class:bg-base-300={selectedInvoiceDetails?.id ===
									invoiceDetails.id}
								type="button"
								on:click={() => (selectedInvoiceDetails = invoiceDetails)}
							>
								<div class="text-sm italic">
									{#if selectedInvoiceDetails?.id === invoiceDetails.id}
										<span class="text-success">Geselecteeerd</span>
									{:else}
										Alternatief
									{/if}
								</div>
								<div class="font-semibold">
									{invoiceDetails.firstName}
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
			{#if errorMessage}
				<div class="text-error flex gap-2 items-center">
					<Fa icon={faExclamationTriangle} />
					{errorMessage}
				</div>
			{/if}
			<button class="btn btn-ghost" type="button" on:click={startCreate}>
				<Fa icon={faPlus} />
				Factuurgegevens aanmaken
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
				<h3 class="font-semibold mb-2">
					{editing ? "Factuurgegevens aanpassen" : "Nieuwe factuurgegevens"}
				</h3>
				<InvoiceDetailsForm
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
					submitLabel={editing
						? "Factuurgegevens aanpassen"
						: "Nieuwe factuurgegevens"}
					onSave={save}
					bind:invoiceFormElement
				/>
			</div>
		{/if}
	{:else}
		<LoginPrompt></LoginPrompt>
		<InvoiceDetailsForm
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
			submitLabel={null}
			onSave={save}
			bind:invoiceFormElement
		/>
	{/if}
</div>
