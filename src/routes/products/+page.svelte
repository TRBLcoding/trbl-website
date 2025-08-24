<script lang="ts">
	import { productStore } from "$lib/ProductStore"
	import ProductCard from "../../components/product/ProductCard.svelte"
</script>

<div class="mx-10 my-5">
	<h1 class="text-xl font-semibold">Producten</h1>
	<hr class="h-px mt-2 bg-base-300 border-none" />

	<div class="mt-4 mb-4 flex items-center justify-center mx-auto gap-4">
		<button class="btn btn-primary rounded-full">Geluid</button>
		<button class="btn btn-primary rounded-full">Verlichting</button>
		<button class="btn btn-primary rounded-full">Truss en statief</button>
		<button class="btn btn-primary rounded-full">Media</button>
	</div>

	<div class="mt-2 flex gap-2 flex-wrap">
		{#each $productStore as product}
			<ProductCard {product} />
		{/each}
	</div>
</div>
