<script lang="ts">
	import { goto } from "$app/navigation"
	import EditDropdown from "$components/EditDropdown.svelte"
	import type { Product } from "$lib/domain/Product"
	import { productStore } from "$lib/stores/ProductStore"
	import { pushCreatedToast } from "$lib/utils/Toast"
	import { faEyeSlash } from "@fortawesome/free-regular-svg-icons"
	import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export let product: Product
	export let isPreview = false

	let loading = false
	let errorMessage = ""

	async function removeProduct() {
		loading = true
		try {
			await productStore.deleteProduct(product)
			pushCreatedToast("Product verwijderd")
			goto("/products")
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
</script>

<!-- Visibility -->
{#if !product.visible}
	<div class="flex items-center gap-2 underline mb-[-6px]">
		<Fa icon={faEyeSlash} class="" /> Dit product is niet zichtbaar!
	</div>
{/if}

<!-- Name -->
<div class="flex flex-row items-center">
	<h1 class="text-4xl font-semibold">{product.name || "Geen naam"}</h1>
	<!-- {#if !isPreview && $authStore} -->
	{#if !isPreview}
		<div class="ml-auto">
			<EditDropdown
				editUrl={"/products/edit/" + product.id}
				deleteHandler={removeProduct}
			/>
		</div>
	{/if}
</div>

{#if errorMessage}
	<div class="text-error flex gap-2 items-center">
		<Fa icon={faTriangleExclamation} class="" />
		{errorMessage}
	</div>
{:else if loading}
	<span class="loading loading-ring"></span>
{/if}
