<script lang="ts">
	import ProductComponent from "$components/product/ProductComponent.svelte"
	import ProductForm from "$components/product/ProductForm.svelte"
	import { Product } from "$lib/domain/Product"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { productStore } from "$lib/stores/ProductStore"
	import { PreviewableFile } from "$lib/utils/PreviewableFile"
	import { pushCreatedToast } from "$lib/utils/Toast"
	import type { UploadProgress } from "$lib/utils/UploadProgress"
	import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import { writable } from "svelte/store"
	import type { PageData } from "./$types"
	import { authStore } from "$lib/stores/AuthStore"
	import { goto } from "$app/navigation"

	export let data: PageData

	const progressStore = writable([] as UploadProgress[])

	let loading = true
	let errorMessage = ""

	let name: string = ""
	let visible: boolean = true
	let price: number = 0
	let combinedImages: (string | File)[] = []
	let categories: string[] = []
	let type: string = ""
	let description: string = ""
	let maxOrderAmount: null | number = null

	let product: Product | undefined | null

	async function initStore() {
		loading = true
		try {
			await productStore.initPromise
		} catch (error) {
			console.error(error)
			if (error instanceof Error) {
				errorMessage = error.toString()
			} else {
				errorMessage = "An unknown error occurred"
			}
		} finally {
			loading = false
		}
	}
	initStore()

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
			maxOrderAmount,
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
			images,
			maxOrderAmount
		)
	}

	// -- Data loading --
	let haveValuesBeenSet = false
	$: $productStore && loadProduct(data)
	$: if (!haveValuesBeenSet && product) setValues(product)

	async function loadProduct(data: PageData) {
		try {
			product = await productStore.getProductById(Number(data.id))
		} catch (error) {
			console.error(error)
			if (error instanceof Error) {
				errorMessage = error.toString()
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
		maxOrderAmount = product.maxOrderAmount
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Product wijzigen")
	// -- Authguard --
	$: if ($authStore === null || ($authStore && !$authStore.isAdmin())) goto("/")
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
			<div class="text-error flex gap-2 items-center">
				<Fa icon={faTriangleExclamation} />
				{errorMessage}
			</div>
		{:else if loading}
			<span>Loading product</span>
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
				bind:maxOrderAmount
				newProduct={false}
				submitLabel="Wijzig product"
				onSave={updateProduct}
				progress={$progressStore}
			/>
		{:else}
			<div class="text-error flex gap-2 items-center">
				<Fa icon={faTriangleExclamation} />
				Product met ID <span class="font-bold">{data.id}</span>: niet gevonden
			</div>
		{/if}
	{/if}
</div>
