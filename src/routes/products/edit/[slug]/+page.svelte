<script lang="ts">
	import ProductForm from "$components/product/ProductForm.svelte"
	import type { PageData } from "./$types"
	import type { UploadProgress } from "$lib/utils/UploadProgress"
	import { writable } from "svelte/store"
	import type { Product } from "$lib/domain/Product"
	import { productStore } from "$lib/ProductStore"
	import { pushCreatedToast } from "$lib/utils/Toast"

	export let data: PageData

	const progressStore = writable([] as UploadProgress[])

	let name: string = ""
	let visible: boolean = true
	let price: number = 0
	let combinedImages: (string | File)[] = []
	let categories: string[] = []
	let type: string = ""
	let description: string = ""

	let product: Product | undefined | null

	async function updateProduct() {
		console.log(name)
		await productStore.updateProduct(
			product!,
			name,
			visible,
			price,
			combinedImages,
			categories,
			type,
			description
		)
		haveValuesBeenSet = false
		pushCreatedToast("Product gewijzigd", {
			gotoUrl: "/products/" + product!.id,
		})
	}

	// -- Data loading --
	let haveValuesBeenSet = false
	$: $productStore && loadProduct(data)
	$: if (!haveValuesBeenSet && product) setValues(product)

	async function loadProduct(data: PageData) {
		product = await productStore.getProductById(Number(data.id))
	}
	function setValues(product: Product) {
		name = product.name
		visible = product.visible
		price = product.price
		combinedImages = product.imageIds
		categories = product.categories
		type = product.type
		description = product.description
	}
</script>

<div class="mx-6 mt-3">
	<h1 class="text-2xl font-bold">Product wijzigen</h1>

	<ProductForm
		bind:name
		bind:price
		bind:visible
		bind:combinedImages
		bind:categories
		bind:type
		bind:description
		newProduct={true}
		submitLabel="Wijzig product"
		onSave={updateProduct}
		progress={$progressStore}
	/>
</div>
