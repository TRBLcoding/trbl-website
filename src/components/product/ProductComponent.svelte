<script lang="ts">
	import type { Product } from "$lib/domain/Product"
	import EditDropdown from "$components/EditDropdown.svelte"

	export let product: Product
	export let isPreview = false

	async function removeProduct() {
		// await articleStore.deleteArticle(article, deleteProgressStore)
		// goto("/")
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
