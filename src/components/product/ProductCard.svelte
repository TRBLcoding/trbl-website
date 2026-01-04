<script lang="ts">
	import { resolve } from "$app/paths"
	import { Product } from "$lib/domain/Product"
	import { ProductGroup } from "$lib/domain/ProductGroup"
	import { cartStore } from "$lib/stores/CartStore"
	import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export let product: Product

	function addProduct() {
		cartStore.add(product, 1)
	}
</script>

<div class="card bg-base-200 w-96 shadow-md">
	{#if product.imageIds?.length > 0}
		<div class="relative">
			<figure class="bg-base-200 h-72 rounded-t-md">
				<a href={resolve("/products/[slug]", { slug: product.id.toString() })} tabindex={-1}>
					<img src={product.getThumbnailUrls()[0]} alt="Productafbeelding" />
				</a>
			</figure>
			{#if product instanceof ProductGroup}
				<div class="absolute top-1.5 right-2 pointer-events-none">
					<span class="badge  badge-soft badge-sm">Bundel</span>
				</div>
			{/if}
		</div>
	{/if}
	<div class="card-body pt-3">
		<span class="italic opacity-50 -mb-2.5">{product.categories}</span>
		<h2 class="card-title">
			<a
				class="link link-hover"
				href={resolve("/products/[slug]", { slug: product.id.toString() })}
				>{product.name}</a
			>
		</h2>
		<p class="text-xl font-semibold text-green-600">
			€ {product.price.toFixed(2)}
		</p>
		<button
			class="btn hover:btn-primary items-center btn-soft"
			type="button"
			on:click={addProduct}
		>
			<Fa icon={faShoppingCart} class="mr-1" /> Toevoegen
		</button>
	</div>
</div>
