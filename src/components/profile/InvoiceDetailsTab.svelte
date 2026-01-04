<script lang="ts">
	import InvoiceDetailsComponent from "$components/invoice/InvoiceDetailsComponent.svelte"
	import type { InvoiceDetails } from "$lib/domain/InvoiceDetails"
	import { faFileInvoice } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import type { TabType } from "./TabType"

	export let checked: boolean = false
	export let setTab: (tab: TabType) => void

	let invoiceFormElement: HTMLFormElement
	let selectedInvoiceDetails: InvoiceDetails
</script>

<!-- Invoice details -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<label class="tab [--tab-bg:var(--color-base-200)]" tabindex={checked ? -1 : 0}>
	<input
		type="radio"
		name="profile-tabs"
		{checked}
		on:change={() => setTab("invoice")}
	/>
	<Fa icon={faFileInvoice} class="me-2" />
	Factuurgegevens
</label>
<div class="tab-content bg-base-200 border-base-300 p-6">
	<div class="mb-3">
		<h2 class="text-xl font-semibold">Factuurgegevens</h2>
		<span class="opacity-80"
			>Hier kunt u uw factuurgegevens bekijken en bijwerken</span
		>
	</div>

	<InvoiceDetailsComponent bind:invoiceFormElement bind:selectedInvoiceDetails
	></InvoiceDetailsComponent>
</div>
