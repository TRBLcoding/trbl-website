<script lang="ts">
	import ProductForm from "$components/product/ProductForm.svelte"
	import { Product, type Category, type Type } from "$lib/domain/Product"
	import { productStore } from "$lib/ProductStore"
	import { PreviewableFile } from "$lib/utils/PreviewableFile"
	import { pushCreatedToast } from "$lib/utils/Toast"
	import type { UploadProgress } from "$lib/utils/UploadProgress"
	import { writable } from "svelte/store"

	const progressStore = writable([] as UploadProgress[])

	let name = "Temp"
	let visible: boolean = true
	let price = 0
	let uploadedImages: File[] = []
	let categories: Category[] = []
	let type: Type = "Mixer"
	let description = "Temp"

	async function createProduct() {
		const product = await createPreviewProduct()
		await productStore.createProduct(product, uploadedImages, progressStore)
		pushCreatedToast("Product aangemaakt", { gotoUrl: "/products" })
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
</script>

<div class="mx-6 mt-3">
	<h1 class="text-2xl font-bold">Nieuw product</h1>

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
</div>
