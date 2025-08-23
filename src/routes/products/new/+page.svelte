<script lang="ts">
	import ProductForm from "$components/product/ProductForm.svelte"

	let title = ""
	let visible: boolean = true
	let uploadedImages: File[] = []
	let tags: string[] = []
	let content = ""

	async function saveArticle() {
		// const article = await createPreviewArticle()
		// await articleStore.createArticle(article, uploadedImages)
		// pushCreatedToast("Bericht aangemaakt", { gotoUrl: "/" })
	}
</script>

<div class="mx-6 mt-3">
	<h1 class="text-2xl font-bold">Nieuw product</h1>

	<ProductForm
		bind:title
		bind:visible
		bind:combinedImages={uploadedImages}
		bind:tags
		bind:content
		newProduct={true}
		submitLabel="Product aanmaken"
		onSave={saveArticle}
	/>
</div>
