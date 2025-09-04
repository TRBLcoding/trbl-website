<script lang="ts">
	import ProductForm from "$components/product/ProductForm.svelte"
	import type { PageData } from "./$types"
	import type { UploadProgress } from "$lib/utils/UploadProgress"
	import { writable } from "svelte/store"
	import { Product } from "$lib/domain/Product"
	import { productStore } from "$lib/stores/ProductStore"
	import { pushCreatedToast } from "$lib/utils/Toast"
	import { PreviewableFile } from "$lib/utils/PreviewableFile"
	import ProductComponent from "$components/product/ProductComponent.svelte"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { PostgrestError } from "@supabase/supabase-js"

	export let data: PageData

	const progressStore = writable([] as UploadProgress[])

	let name: string = ""
	let visible: boolean = true
	let price: number = 0
	let combinedImages: (string | File)[] = []
	let categories: string[] = []
	let type: string = ""
	let description: string = ""

	let product: Product | undefined | null
	let errorMessage = ""

	async function updateProduct() {
		await productStore.updateProduct(
			product!,
			name,
			visible,
			price,
			combinedImages,
			categories,
			type,
			description,
			progressStore
		)
		haveValuesBeenSet = false
		pushCreatedToast("Product gewijzigd", {
			gotoUrl: "/products/" + product!.id,
		})
	}

	// -- Preview --
	let showPreview = false
	function togglePreview() {
		showPreview = !showPreview
	}
	async function createPreview() {
		const images = await Promise.all(
			combinedImages.map((e) => PreviewableFile.getMixedFilePreview(e))
		)
		return new Product(
			-1, // temporary id
			name,
			price,
			description,
			categories,
			type,
			visible,
			images
		)
	}

	// -- Data loading --
	let haveValuesBeenSet = false
	$: loadProduct(data, $productStore)
	$: if (!haveValuesBeenSet && product) setValues(product)

	async function loadProduct(data: PageData, _reactive: Product[]) {
		// _reactive store parameter is nesecairy to load the init function of the Svelte Store
		try {
			product = await productStore.getProductById(Number(data.id))
		} catch (error) {
			console.error(error)
			if (error instanceof Error) {
				errorMessage = error.message
			} else {
				errorMessage = "An unknown error occurred"
			}
		}
	}
	function setValues(product: Product) {
		name = product.name
		visible = product.visible
		price = product.price
		combinedImages = product.imageIds
		categories = product.categories
		type = product.type
		description = product.description
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Product wijzigen")
</script>

<div class="mx-6 mt-3 mb-8">
	{#if showPreview}
		<!-- Product preview -->
		{#await createPreview()}
			<div>Loading</div>
		{:then previewProduct}
			<button
				class="btn btn-primary btn-xs normal-case"
				on:click={togglePreview}
			>
				Sluit preview
			</button>
			<div class="md:mx-2 mb-4 sm:mb-10">
				<ProductComponent product={previewProduct} isPreview={true} />
			</div>
		{/await}
	{:else}
		<!-- Product editor -->
		<div class="flex flex-row gap-3 items-center mb-1">
			<h1 class="text-2xl font-bold">Product wijzigen</h1>
			{#if !errorMessage && product !== undefined}
				<button
					class="btn btn-primary btn-xs normal-case"
					on:click={togglePreview}
				>
					Toon preview
				</button>
			{/if}
		</div>
		{#if errorMessage}
			<span class="text-error">{errorMessage}</span>
		{:else if product === undefined}
			<span>Loading</span>
			<span class="loading loading-ring"></span>
		{:else if product}
			<ProductForm
				bind:name
				bind:price
				bind:visible
				bind:combinedImages
				bind:categories
				bind:type
				bind:description
				newProduct={false}
				submitLabel="Wijzig product"
				onSave={updateProduct}
				progress={$progressStore}
			/>
		{:else}
			<div>"{data.id}": not found</div>
		{/if}
	{/if}
</div>
