<script lang="ts">
	import { Product } from "$lib/domain/Product"

	export let product: Product;
</script>

<div class="card bg-base-100 w-96 shadow-md">
	<figure>
		<a href="/product/{product.id}">
			<img src={product.imageUrl} alt="Productafbeelding" />
		</a>
	</figure>

	<div class="card-body">
		<span class="italic opacity-50 mb-[-10px]">Media</span>
		<h2 class="card-title">
			<a class="link link-hover" href="/product/{product.id}">{product.name}</a>
		</h2>
		<p class="text-xl font-semibold text-green-600">€ 48,90</p>
		<button class="btn">Toevoegen</button>
	</div>
</div>
