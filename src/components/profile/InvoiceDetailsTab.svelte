<script lang="ts">
	import InvoiceDetailsComponent from "$components/invoice/InvoiceDetailsComponent.svelte"
	import type { InvoiceDetails } from "$lib/domain/InvoiceDetails"
	import { faFileInvoice } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	let invoiceFormElement: HTMLFormElement
	let selectedInvoiceDetails: InvoiceDetails
</script>

<!-- Invoice details -->
<label class="tab [--tab-bg:var(--color-base-200)]">
	<input type="radio" name="profile-tabs" />
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

	<InvoiceDetailsComponent
		bind:invoiceFormElement
		bind:selectedInvoiceDetails
	></InvoiceDetailsComponent>
</div>
