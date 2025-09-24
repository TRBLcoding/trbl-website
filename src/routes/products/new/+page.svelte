<script lang="ts">
	import { goto } from "$app/navigation"
	import ProductComponent from "$components/product/ProductComponent.svelte"
	import ProductForm from "$components/product/ProductForm.svelte"
	import { Product, type Category, type Type } from "$lib/domain/Product"
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
	let uploadedImages: File[] = []
	let categories: Category[] = []
	let type: Type = ""
	let description = ""

	async function createProduct() {
		const product = await createPreviewProduct()
		await productStore.createProduct(product, uploadedImages, progressStore)
		pushCreatedToast("Product aangemaakt", { gotoUrl: "/products" })
	}

	// -- Preview --
	let showPreview = false

	function togglePreview() {
		showPreview = !showPreview
	}
	async function createPreviewProduct() {
		return new Product(
			-1, // temporary id
			name,
			price,
			description,
			categories,
			type,
			visible,
			await Promise.all(
				uploadedImages.map((e) => PreviewableFile.getFilePreview(e))
			)
		)
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Nieuw product")
	// -- Authguard --
	$: if ($authStore === null || ($authStore && !$authStore.isAdmin())) goto("/")
</script>

<div class="mx-2 lg:mx-6 mt-3 mb-8">
	{#if showPreview}
		<!-- Article preview -->
		{#await createPreviewProduct()}
			<div>Loading</div>
		{:then product}
			<button
				class="btn btn-primary btn-xs normal-case"
				on:click={togglePreview}
			>
				Sluit preview
			</button>
			<ProductComponent {product} isPreview={true} />
		{/await}
	{:else}
		<!-- Product editor -->
		<div class="flex flex-row gap-3 items-center mb-1">
			<h1 class="text-2xl font-bold">Nieuw product</h1>
			<button
				class="btn btn-primary btn-sm normal-case"
				on:click={togglePreview}
			>
				Toon preview
			</button>
		</div>

		<ProductForm
			bind:name
			bind:price
			bind:visible
			bind:combinedImages={uploadedImages}
			bind:categories
			bind:type
			bind:description
			newProduct={true}
			submitLabel="Product aanmaken"
			onSave={createProduct}
			progress={$progressStore}
		/>
	{/if}
</div>
