<script lang="ts">
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import ProductGroupForm from "$components/product-group/ProductGroupForm.svelte"
	import type { User } from "$lib/domain/User"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { productGroupStore } from "$lib/stores/ProductGroupStore"

	// -- Preview --
	let showPreview = false

	function togglePreview() {
		showPreview = !showPreview
	}
	async function createPreviewProductGroup() {
		return 
	}

	console.log($productGroupStore?.map(e=>e))

	// -- Page title --
	pageHeadStore.updatePageTitle("Productgroep aanmaken")
	// -- Authguard --
	$: if ($authStore === null || ($authStore && !($authStore as User).isAdmin()))
		goto(resolve("/"))
</script>

<div class="mx-6 mt-3 mb-8">
	{#if showPreview}
		<!-- Article preview -->
		{#await createPreviewProductGroup()}
			<div>Loading</div>
		{:then product}
			<button
				class="btn btn-primary btn-xs normal-case"
				on:click={togglePreview}
			>
				Sluit preview
			</button>
			TODO
		{/await}
	{:else}
		<!-- Product editor -->
		<div class="flex flex-row gap-3 items-center mb-1">
			<h1 class="text-2xl font-bold">Productgroep aanmaken</h1>
			<button
				class="btn btn-primary btn-sm normal-case"
				on:click={togglePreview}
			>
				Toon preview
			</button>
		</div>

		store: {$productGroupStore}

		<ProductGroupForm></ProductGroupForm>
	{/if}
</div>
