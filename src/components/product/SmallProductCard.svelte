<script lang="ts">
	import { resolve } from "$app/paths"
	import type { ProductAmount } from "$lib/domain/ProductAmount"

	export let productAmount: ProductAmount
</script>

{#await productAmount.getProduct() then productGroupItem}
	<a
		class="card bg-base-200 hover:bg-base-300 transition-colors overflow-hidden"
		href={resolve("/products/[slug]", {
			slug: productGroupItem.id.toString(),
		})}
	>
		{#if productGroupItem.imageIds?.length > 0}
			<figure class="bg-base-200 h-42">
				<img
					src={productGroupItem.getThumbnailUrls()[0]}
					alt="Productafbeelding"
				/>
			</figure>
		{/if}
		<div class="card-body p-4">
			<h3 class="card-title text-sm link-hover">
				{productGroupItem.name}
			</h3>
			<p class="text-xs opacity-70">
				Aantal: {productAmount.amount}
			</p>
		</div>
	</a>
{/await}
