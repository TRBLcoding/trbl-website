<script lang="ts">
	import type { Category } from "$lib/domain/Product"
	import { productStore } from "$lib/ProductStore"
	import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
	import ProductCard from "../../components/product/ProductCard.svelte"
	import Fa from "svelte-fa"

	let sortOption = "Alfabetish oplopend"
	let activeFilters = new Set<Category>()

	function updateFilter(filter: Category) {
		if (activeFilters.has(filter)) activeFilters.delete(filter)
		else activeFilters.add(filter)
		activeFilters = activeFilters
		console.log(activeFilters)
	}
	$: filteredProducts =
		activeFilters.size === 0
			? $productStore
			: $productStore.filter((product) =>
					product.categories.some((category) => activeFilters.has(category))
				)

	$: sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
		switch (sortOption) {
			case "Alfabetish oplopend":
				return a.name.localeCompare(b.name)
			case "Alfabetish aflopend":
				return b.name.localeCompare(a.name)
			case "Prijs oplopend":
				return a.price - b.price
			case "Prijs aflopend":
				return b.price - a.price
			default:
				return 0
		}
	})

	let { error, loading } = productStore
</script>

<div class="mx-4 lg:mx-10 my-5">
	<div class="flex gap-3 mb-2">
		<h1 class="text-4xl font-semibold">Producten</h1>
		<a href="/products/new" class="btn btn-primary normal-case">
			Nieuw product
		</a>
		<!-- {#await authStore.known then _}
		{#if $authStore}
			<a class="btn btn-sm btn-primary" href="/articles/new"> Nieuw artikel </a>
		{/if}
	{/await} -->
	</div>

	<hr class="h-px bg-base-300 border-none" />

	<!-- Filters -->
	<div class="flex flex-col md:flex-row items-center justify-center lg:justify-between">
		<div class="overflow-x-auto w-fit md:overflow-x-visible mt-3 mb-2  md:mx-0 mx-[-20px]">
			<div class="flex items-center gap-2 lg:gap-3 mb-2">
				<span class="hidden md:block">Filters:</span>
				<button
					class="btn rounded-full"
					class:btn-primary={activeFilters.has("Sound")}
					on:click={() => updateFilter("Sound")}
				>
					Geluid
				</button>
				<button
					class="btn rounded-full"
					class:btn-primary={activeFilters.has("Light")}
					on:click={() => updateFilter("Light")}
				>
					Verlichting
				</button>
				<button
					class="btn rounded-full"
					class:btn-primary={activeFilters.has("Truss")}
					on:click={() => updateFilter("Truss")}
				>
					Truss en statief
				</button>
				<button
					class="btn rounded-full"
					class:btn-primary={activeFilters.has("Media")}
					on:click={() => updateFilter("Media")}
				>
					Media
				</button>
			</div>
		</div>
		<div class="flex gap-2 items-center">
			{#if sortedProducts}
				<div class="border-r pr-2 whitespace-nowrap hidden lg:block">
					<span class="font-bold">{sortedProducts.length}</span> Producten
				</div>
			{/if}
			<span class="whitespace-nowrap ml-4">Sorteer op:</span>
			<select class="select min-w-44" bind:value={sortOption}>
				<option>Alfabetish oplopend</option>
				<option>Alfabetish aflopend</option>
				<option>Prijs oplopend</option>
				<option>Prijs aflopend</option>
			</select>
		</div>
	</div>

	{#if $error}
		<div class="text-error flex gap-2 items-center">
			<Fa icon={faTriangleExclamation} class="" />
			{$error}
		</div>
	{:else if $loading}
		Loading
	{:else}
		<div class="mt-2 flex gap-2 flex-wrap justify-center">
			{#each sortedProducts as product}
				<ProductCard {product} />
			{/each}
		</div>
	{/if}
</div>
