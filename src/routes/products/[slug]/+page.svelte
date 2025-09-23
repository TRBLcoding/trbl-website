<script lang="ts">
	import ProductComponent from "$components/product/ProductComponent.svelte"
	import type { Product } from "$lib/domain/Product"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { productStore } from "$lib/stores/ProductStore"
	import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import type { PageData } from "./$types"

	export let data: PageData

	let loading = true
	let errorMessage = ""
	let product: Product | undefined | null
	$: $productStore && loadProduct(data)

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

<div class="mx-6 mt-3">
	{#if errorMessage}
		<div class="text-error flex gap-2 items-center">
			<Fa icon={faTriangleExclamation} class="" />
			{errorMessage}
		</div>
	{:else if loading}
		<span>Product laden</span>
		<span class="loading loading-ring"></span>
	{:else if product}
		<ProductComponent {product} />
	{:else}
		<div>"{data.id}": not found</div>
	{/if}
</div>
