<script lang="ts">
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import ProductGroupForm from "$components/product-group/ProductGroupForm.svelte"
	import ProductComponent from "$components/product/ProductComponent.svelte"
	import type { Category, Product, Type } from "$lib/domain/Product"
	import type { ProductAmount } from "$lib/domain/ProductAmount"
	import { ProductGroup } from "$lib/domain/ProductGroup"
	import type { User } from "$lib/domain/User"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { productStore } from "$lib/stores/ProductStore"
	import { PreviewableFile } from "$lib/utils/PreviewableFile"
	import { pushCreatedToast } from "$lib/utils/Toast"
	import type { UploadProgress } from "$lib/utils/UploadProgress"
	import { writable } from "svelte/store"

	const progressStore = writable([] as UploadProgress[])

	let name = ""
	let visible: boolean = true
	let price = 0
	let categories: Category[] = []
	let uploadedImages: File[] = []
	let description = ""
	let maxOrderAmount: null | number = null
	let selectedProducts: ProductAmount[] = []

	async function createProductGroup() {
		const productGroup = await createPreviewProductGroup()
		await productStore.createProductGroup(productGroup, uploadedImages, progressStore)
		pushCreatedToast("Productgroep aangemaakt", { gotoUrl: "/products" })
	}

	// -- Preview --
	let showPreview = false

	function togglePreview() {
		showPreview = !showPreview
	}
	async function createPreviewProductGroup() {
		const type: Type = "LightSet"
		const imageIDs = await Promise.all(
			uploadedImages.map((e) => PreviewableFile.getFilePreview(e))
		)
		return new ProductGroup(
			-1, // temporary id
			name,
			price,
			description,
			categories,
			type,
			visible,
			imageIDs,
			maxOrderAmount,
			selectedProducts
		)
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
		{:then previewProductGroup}
			<button
				class="btn btn-primary btn-xs normal-case"
				on:click={togglePreview}
			>
				Sluit preview
			</button>
			<div class="md:mx-2 mb-4 sm:mb-10">
				<ProductComponent product={previewProductGroup} isPreview={true} />
			</div>
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
			bind:categories
			bind:description
			bind:maxOrderAmount
			bind:selectedProducts
			newProductGroup={true}
			submitLabel="Productgroep aanmaken"
			onSave={createProductGroup}
			progress={$progressStore}
		/>
	{/if}
</div>
