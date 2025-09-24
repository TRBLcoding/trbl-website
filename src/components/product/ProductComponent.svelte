<script lang="ts">
	import { goto } from "$app/navigation"
	import Carousel from "$components/Carousel.svelte"
	import EditDropdown from "$components/EditDropdown.svelte"
	import type { Product } from "$lib/domain/Product"
	import { authStore } from "$lib/stores/AuthStore"
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

<div class="breadcrumbs text-sm">
	<ul>
		<li><a href="/products">Producten</a></li>
		<li><a href="/products">{product.categories.join("+")}</a></li>
	</ul>
</div>
<!-- Name -->
<div class="flex flex-row items-center">
	<h1 class="text-4xl font-semibold">{product.name || "Geen naam"}</h1>
	{#if !isPreview && $authStore?.isAdmin()}
		<div class="ml-auto">
			<EditDropdown
				editUrl={"/products/edit/" + product.id}
				deleteHandler={removeProduct}
			/>
		</div>
	{/if}
</div>

<div class="flex flex-col lg:flex-row gap-6 mt-2 mb-5">
    <div class="w-full lg:w-2/3 flex flex-col gap-6">
        <!-- Gallery -->
        <div class="bg-blue-400 h-96 rounded-lg flex items-center justify-center">
            Gallery
        </div>

        <!-- Description - Shows last on mobile, second on desktop -->
        <div class="order-2 lg:order-none">
            <div
                class="bg-red-400 rounded-lg p-6 h-screen flex items-center justify-center"
            >
                Description
            </div>
        </div>
    </div>

    <!-- Right column - Price (sticky) -->
    <div class="w-full lg:w-1/3 order-1 lg:order-none">
        <div
            class="bg-green-400 h-60 rounded-lg flex items-center justify-center lg:sticky lg:top-6"
        >
            Pricee
        </div>
    </div>
</div>

<!-- {#await Promise.all(product.createCarouselImages()) then images}
	{#if images.length > 0}
		<div class="my-2">
			<Carousel {images} background />
		</div>
	{/if}
{/await} -->

{#if errorMessage}
	<div class="text-error flex gap-2 items-center">
		<Fa icon={faTriangleExclamation} class="" />
		{errorMessage}
	</div>
{:else if loading}
	<span class="loading loading-ring"></span>
{/if}
