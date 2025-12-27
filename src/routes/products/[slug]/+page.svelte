<script lang="ts">
	import ProductComponent from "$components/product/ProductComponent.svelte"
	import type { Product } from "$lib/domain/Product"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { productStore } from "$lib/stores/ProductStore"
	import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import type { PageData } from "./$types"
	import { onDestroy } from "svelte"

	export let data: PageData

	let loading = true
	let errorMessage = ""
	let product: Product | undefined | null
	let deletingProduct = false

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

	$: $productStore && !deletingProduct && loadProduct(data)

	async function loadProduct(data: PageData) {
		errorMessage = ""
		try {
			product = await productStore.getProductById(Number(data.id))
		} catch (error) {
			console.error(error)
			errorMessage = "error occurred"
		}
	}

	// -- Page title --
	$: product && pageHeadStore.updatePageTitle(product.name)
</script>

<div class="mx-4 lg:mx-12 mt-3">
	{#if errorMessage}
		<div class="text-error flex gap-2 items-center">
			<Fa icon={faExclamationTriangle} />
			{errorMessage}
		</div>
	{:else if loading}
		<span>Product laden</span>
		<span class="loading loading-ring"></span>
	{:else if product}
		<ProductComponent {product} bind:deletingProduct />
	{:else}
		<div class="text-error flex gap-2 items-center text-lg">
			<Fa icon={faExclamationTriangle} />
			Error: product met ID <span class="font-bold">"{data.id}"</span> niet gevonden
		</div>
	{/if}
</div>
