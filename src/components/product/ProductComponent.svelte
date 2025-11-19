<script lang="ts">
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import Carousel from "$components/carousel/Carousel.svelte"
	import EditDropdown from "$components/EditDropdown.svelte"
	import UserContentRenderer from "$components/UserContentRenderer.svelte"
	import type { Product } from "$lib/domain/Product"
	import { authStore } from "$lib/stores/AuthStore"
	import { productStore } from "$lib/stores/ProductStore"
	import { pushCreatedToast } from "$lib/utils/Toast"
	import { faEyeSlash } from "@fortawesome/free-regular-svg-icons"
	import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import PriceCard from "./PriceCard.svelte"

	export let product: Product
	export let isPreview = false

	let loading = false
	let errorMessage = ""

	async function removeProduct() {
		loading = true
		try {
			await productStore.deleteProduct(product)
			pushCreatedToast("Product verwijderd")
			goto(resolve("/products"))
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
	<div class="flex items-center gap-2 underline -mb-1.5">
		<Fa icon={faEyeSlash} /> Dit product is niet zichtbaar!
	</div>
{/if}

<div class="breadcrumbs text-sm">
	<ul>
		<li><a href={resolve("/products")}>Producten</a></li>
		<li>
			<a
				href="/products?{product.categories
					.map((e) => `filter=${e}`)
					.join('&')}">{product.categories.join("+")}</a
			>
		</li>
	</ul>
</div>

<!-- Name -->
<div class="flex flex-row items-center">
	<h1 class="text-4xl font-semibold">{product.name || "Geen naam"}</h1>
	{#if !isPreview && $authStore?.isAdmin()}
		<div class="ml-auto">
			<EditDropdown
				editUrl={`/products/edit/${product.id}`}
				deleteHandler={removeProduct}
			/>
		</div>
	{/if}
</div>

<div class="flex flex-col md:flex-row gap-6 mt-6 mb-10">
	<div class="w-full md:w-2/3 flex flex-col gap-6">
		<!-- Gallery -->
		<div class="mb-2">
			{#await Promise.all(product.createCarouselImages()) then images}
				{#if images.length > 0}
					<Carousel {images} background thumbnails />
				{/if}
			{/await}
		</div>

		<div class="w-full md:hidden">
			<PriceCard {product} {isPreview}></PriceCard>
		</div>

		<div class="order-2 md:order-0">
			<div class="rounded-lg p-6 bg-base-200">
				<h2 class="text-xl font-semibold mb-3">Omschrijving</h2>
				<UserContentRenderer content={product.description} showLinks />
			</div>
		</div>
	</div>

	<div class="w-1/3 hidden md:block">
		<PriceCard {product} {isPreview}></PriceCard>
	</div>
</div>

{#if errorMessage}
	<div class="text-error flex gap-2 items-center">
		<Fa icon={faExclamationTriangle} />
		{errorMessage}
	</div>
{:else if loading}
	<span class="loading loading-ring"></span>
{/if}
