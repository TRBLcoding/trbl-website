<script lang="ts">
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import ProductGroupForm from "$components/product-group/ProductGroupForm.svelte"
	import type { User } from "$lib/domain/User"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { productGroupStore } from "$lib/stores/ProductGroupStore"
	import { pushCreatedToast } from "$lib/utils/Toast"
	import type { UploadProgress } from "$lib/utils/UploadProgress"
	import { writable } from "svelte/store"

	const progressStore = writable([] as UploadProgress[])

	let name = ""
	let visible: boolean = true
	let price = 0
	let uploadedImages: File[] = []
	let description = ""
	let maxOrderAmount: null | number = null

	async function createProductGroup() {
		// const product = await createPreviewProduct()
		// await productStore.createProduct(product, uploadedImages, progressStore)
		pushCreatedToast("Productgroep aangemaakt", { gotoUrl: "/products" })
	}

	// -- Preview --
	let showPreview = false

	function togglePreview() {
		showPreview = !showPreview
	}
	async function createPreviewProductGroup() {
		return
	}

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

		<ProductGroupForm
			bind:name
			bind:price
			bind:visible
			bind:combinedImages={uploadedImages}
			bind:description
			bind:maxOrderAmount
			newProductGroup={true}
			submitLabel="Productgroep aanmaken"
			onSave={createProductGroup}
			progress={$progressStore}
		/>
	{/if}
</div>
