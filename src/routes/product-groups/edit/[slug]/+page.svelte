<script lang="ts">
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import ProductComponent from "$components/product/ProductComponent.svelte"
	import ProductForm from "$components/product/ProductForm.svelte"
	import { Product } from "$lib/domain/Product"
	import type { User } from "$lib/domain/User"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { productStore } from "$lib/stores/ProductStore"
	import { PreviewableFile } from "$lib/utils/PreviewableFile"
	import { pushCreatedToast } from "$lib/utils/Toast"
	import type { UploadProgress } from "$lib/utils/UploadProgress"
	import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import { writable } from "svelte/store"
	import type { PageData } from "./$types"
	import ProductGroupForm from "$components/product-group/ProductGroupForm.svelte"
	import { ProductGroup } from "$lib/domain/ProductGroup"
	import type { ProductAmount } from "$lib/domain/ProductAmount"

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
	let selectedProducts: ProductAmount[] = []

	let product: ProductGroup | undefined | null

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

	async function updateProductGroup() {
		await productStore.updateProductGroup(
			product!,
			name,
			visible,
			price,
			combinedImages,
			categories,
			type,
			description,
			maxOrderAmount,
			selectedProducts,
			progressStore
		)
		haveValuesBeenSet = false
		pushCreatedToast("Productgroep gewijzigd", {
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
		return new ProductGroup(
			-1, // temporary id
			name,
			price,
			description,
			categories,
			type,
			visible,
			images,
			maxOrderAmount,
			selectedProducts
		)
	}

	// -- Data loading --
	let haveValuesBeenSet = false
	$: $productStore && loadProduct(data)
	$: if (!haveValuesBeenSet && product) setValues(product)

	async function loadProduct(data: PageData) {
		try {
			const foundProduct =  await productStore.getProductById(Number(data.id))
			if(foundProduct instanceof ProductGroup) {
				product = foundProduct
			} else {
				errorMessage = "Product is geen productgroep"
			}
		} catch (error) {
			console.error(error)
			if (error instanceof Error) {
				errorMessage = error.toString()
			} else {
				errorMessage = "An unknown error occurred"
			}
		}
	}
	function setValues(product: ProductGroup) {
		name = product.name
		visible = product.visible
		price = product.price
		combinedImages = product.imageIds
		categories = product.categories
		type = product.type
		description = product.description
		maxOrderAmount = product.maxOrderAmount
		selectedProducts = product.productAmounts
		haveValuesBeenSet = true
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Productgroep wijzigen")
	// -- Authguard --
	$: if ($authStore === null || ($authStore && !($authStore as User).isAdmin()))
		goto(resolve("/"))
</script>

<div class="mx-6 mt-3 mb-8">
	{#if showPreview}
		<!-- Article preview -->
		{#await createPreview()}
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
			<h1 class="text-2xl font-bold">Productgroep wijzigen</h1>
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
			bind:combinedImages
			bind:categories
			bind:description
			bind:maxOrderAmount
			bind:selectedProducts
			newProductGroup={false}
			submitLabel="Productgroep wijzigen"
			onSave={updateProductGroup}
			progress={$progressStore}
		/>
	{/if}
</div>
