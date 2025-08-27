<script lang="ts">
	import { Product } from "$lib/domain/Product"

	export let product: Product
</script>

<div class="card bg-base-100 w-96 shadow-md">
	{#if product.imageIds?.length > 0}
		<figure class="bg-base-200 h-72">
			<a href="/products/{product.id}">
				<img src={product.getThumbnailUrls()[0]} alt="Productafbeelding" />
			</a>
		</figure>
	{/if}
	<div class="card-body pt-3">
		<span class="italic opacity-50 mb-[-10px]">{product.categories}</span>
		<h2 class="card-title">
			<a class="link link-hover" href="/products/{product.id}">{product.name}</a
			>
		</h2>
		<p class="text-xl font-semibold text-green-600">€ {product.price}</p>
		<button class="btn">Toevoegen</button>
	</div>
</div>
