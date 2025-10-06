<script lang="ts">
	import EditDropdown from "$components/EditDropdown.svelte"
	import { InvoiceDetails } from "$lib/domain/InvoiceDetails"
	import { authStore } from "$lib/stores/AuthStore"
	import { invoiceDetailsStore } from "$lib/stores/InvoiceDetailsStore"
	import {
		loginModalOpenStore,
		loginModalStateStore,
	} from "$lib/stores/LoginmodalStore"
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

	export let firstName = "Lorin"
	export let lastName = "Speybrouck"
	export let emailAddress = "lorin.speybrouck@proximus.be"
	export let phoneNumber = "+32 473 23 45 67"
	export let companyName = "TBRL 2"
	export let btwNumber: string | null = ""
	export let streetAndNumber = "Spiedamstraat 25"
	export let postalCode = "1899"
	export let place = "Gent"
	export let country = "Belgie"

	let showForm = false
	let showLoginPrompt = true

	let upperErrorMessage = ""

	async function save() {
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

	export let selectedInvoiceDetails: InvoiceDetails
	function selectInvoiceDetails(invoiceDetails: InvoiceDetails) {
		selectedInvoiceDetails = invoiceDetails
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

	function openLoginModal() {
		$loginModalStateStore = "Login"
		$loginModalOpenStore = true
	}
	function openSingupModal() {
		$loginModalStateStore = "Register"
		$loginModalOpenStore = true
	}

	export let invoiceFormElement: HTMLFormElement
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
								on:click={() => selectInvoiceDetails(invoiceDetails)}
							>
								<div class="text-sm italic">
									{#if selectedInvoiceDetails?.id === invoiceDetails.id}
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
		{#if showLoginPrompt}
			<div class="px-6 py-6 bg-base-200 rounded-xl mb-2 relative">
				<button
					type="button"
					class="btn btn-sm btn-square btn-ghost absolute right-3 top-3"
					on:click={() => (showLoginPrompt = false)}
				>
					<Fa icon={faXmark} />
				</button>

				<div class="flex flex-col gap-3 items-center text-center">
					<div
						class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
					>
						<Fa icon={faUser} class="text-primary" size="lg" />
					</div>
					<div class="flex flex-col gap-2">
						<h3 class="font-semibold text-lg">Sla je factuurgegevens op</h3>
						<p class="text-sm text-base-content/70 max-w-md">
							Ingelogde gebruikers kunnen factuurgegevens opslaan voor later
							gebruik en sneller afrekenen.
						</p>
					</div>
					<button
						class="btn btn-primary btn-wide gap-2"
						type="button"
						on:click={openLoginModal}
					>
						<Fa icon={faUser} size="sm" />
						Aanmelden
					</button>
					<button type="button" class="link text-sm" on:click={openSingupModal}>
						Nog geen account? Registreer hier
					</button>
				</div>
			</div>
		{/if}
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
