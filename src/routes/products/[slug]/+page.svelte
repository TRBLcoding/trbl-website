<script lang="ts">
	import ProductComponent from "$components/product/ProductComponent.svelte"
	import type { Product } from "$lib/domain/Product"
	import { productStore } from "$lib/ProductStore"
	import type { PageData } from "./$types"

	export let data: PageData

	let errorMessage = ""
	let product: Product | undefined | null
	$: $productStore && loadProduct(data)

	async function loadProduct(data: PageData) {
		errorMessage = ""
		try {
			product = await productStore.getProductById(Number(data.id))
		} catch (error) {
			console.error(error)
			errorMessage = "error occurred"
		}
	}

	// // -- Authguard --
	// $: authStore.known.then(() => {
	// 	if (!product?.visible && !$authStore) goto("/")
	// })
	// // -- Page title --
	// $: product && pageHeadStore.updatePageTitle(product.title)
</script>

<div class="mx-6 mt-3">
	{#if product === undefined}
		Loading
	{:else if product}
		<ProductComponent {product} />
	{:else}
		<div>"{data.id}": not found</div>
	{/if}

	{#if errorMessage}
		<p class="text-error">{errorMessage}</p>
	{/if}
</div>
