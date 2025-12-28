<script lang="ts">
	import { browser } from "$app/environment"
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import { page } from "$app/stores"
	import Input from "$components/formHelpers/Input.svelte"
	import ProductCard from "$components/product/ProductCard.svelte"
	import ProductCardSkeleton from "$components/product/ProductCardSkeleton.svelte"
	import type { Category, Product } from "$lib/domain/Product"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { productStore } from "$lib/stores/ProductStore"
	import {
		faBorderNone,
		faExclamationTriangle,
		faSearch,
		faXmarkCircle,
	} from "@fortawesome/free-solid-svg-icons"
	import { onMount } from "svelte"
	import Fa from "svelte-fa"
	import { debounce } from "ts-debounce"

	let searchInputValue: string
	let searchString: string = "" // Debounced searchInputValue
	let sortOption = "Alfabetisch oplopend"
	let activeFilters = new Set<Category>()
	let errorMessage = ""
	let loading = true

	function updateFilter(filter: Category) {
		if (activeFilters.has(filter)) activeFilters.delete(filter)
		else activeFilters.add(filter)
		activeFilters = activeFilters
	}

	$: filteredProducts = filterProducts($productStore, activeFilters)
	function filterProducts(products: Product[], filters: Set<Category>) {
		if (filters.size === 0) return products
		return products.filter((product) =>
			product.categories.some((category) => filters.has(category))
		)
	}

	$: sortedProducts = sortProducts(filteredProducts, sortOption)
	function sortProducts(products: Product[], sortOption: string) {
		updateSearchParams()
		return [...(products || [])].sort((a, b) => {
			switch (sortOption) {
				case "Alfabetisch oplopend":
					return a.name.localeCompare(b.name)
				case "Alfabetisch aflopend":
					return b.name.localeCompare(a.name)
				case "Prijs oplopend":
					return a.price - b.price
				case "Prijs aflopend":
					return b.price - a.price
				default:
					return 0
			}
		})
	}

	$: searchedProducts = searchProducts(sortedProducts, searchString)
	function searchProducts(products: Product[], searchString: string) {
		if (searchString)
			return products.filter((e) => e.matchesSearchString(searchString))
		return products
	}

	function updateSearchParams() {
		if (!browser) return
		const url = new URL($page.url)

		// -- Filter --
		url.searchParams.delete("filter")
		activeFilters.forEach((filter) => {
			url.searchParams.append("filter", filter)
		})
		// -- Search --
		url.searchParams.delete("sort")
		if (sortOption !== "Alfabetisch oplopend")
			url.searchParams.set("sort", sortOption)

		goto(url.toString(), { replaceState: true, noScroll: true })
	}

	// -- Init --
	async function initStore() {
		loading = true
		try {
			await productStore.initPromise
		} catch (error) {
			console.error(error)
			if (error instanceof Error) {
				errorMessage = error.toString()
			} else {
				errorMessage = "An unknown error occurred"
			}
		} finally {
			loading = false
		}
	}
	initStore()

	onMount(() => {
		if (browser && $page.url) {
			// -- Filters --
			const filterParams = $page.url.searchParams.getAll("filter")
			activeFilters = new Set(filterParams as Category[])

			// -- Sort --
			const sortParam = $page.url.searchParams.get("sort")
			if (sortParam) {
				sortOption = sortParam
			}
		}
	})

	// -- Search input --
	function clearSearch() {
		searchInputValue = ""
		searchString = ""
	}
	const debounceSearchInput = debounce(
		() => (searchString = searchInputValue),
		200
	)

	// -- Page title --
	pageHeadStore.updatePageTitle("Producten")
</script>

<div class="mx-4 lg:mx-12 my-5">
	<div class="flex gap-3 mb-2 items-center">
		<h1 class="text-4xl font-semibold">Producten</h1>
		{#if $authStore && $authStore.isAdmin()}
			<a href={resolve("/products/new")} class="btn btn-primary btn-sm">
				Nieuw product
			</a>
			<a href={resolve("/product-groups/new")} class="btn btn-primary btn-sm">
				Nieuwe product groep
			</a>
		{/if}
	</div>

	<hr class="h-px bg-base-300 border-none" />

	<!-- Filters -->
	<div class="flex flex-col gap-3 my-4 items-center lg:items-stretch">
		<div
			class="flex flex-col md:flex-row items-center justify-center lg:justify-between gap-3 xl:gap-5"
		>
			<div class="shrink-0 md:mx-0">
				<div class="w-full flex items-center gap-1">
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

			<div class="shrink min-w-32 max-w-lg w-full hidden lg:block">
				<Input
					size="full"
					type="text"
					bind:value={searchInputValue}
					onInput={debounceSearchInput}
					autocomplete="off"
					iconLeft={faSearch}
					inputClass="rounded-full"
					placeholder="Zoek een product"
				>
					<span
						slot="iconRight"
						class:hidden={!searchInputValue}
						class="z-10 opacity-50"
					>
						<button
							class="btn btn-ghost btn-circle btn-sm"
							type="button"
							on:click={clearSearch}
						>
							<Fa icon={faXmarkCircle} size="lg" />
						</button>
					</span>
				</Input>
			</div>

			<div class="flex gap-2 items-center shrink-0">
				{#if searchedProducts}
					<div class="border-r pr-2 whitespace-nowrap hidden xl:block">
						<span class="font-bold">{searchedProducts.length}</span> Producten
					</div>
				{/if}
				<span class="whitespace-nowrap xl:ml-4">Sorteer op:</span>
				<select class="select min-w-44" bind:value={sortOption}>
					<option>Alfabetisch oplopend</option>
					<option>Alfabetisch aflopend</option>
					<option>Prijs oplopend</option>
					<option>Prijs aflopend</option>
				</select>
			</div>
		</div>
		<div class="lg:hidden max-w-sm md:max-w-3xl w-full">
			<Input
				size="full"
				type="text"
				bind:value={searchInputValue}
				onInput={debounceSearchInput}
				autocomplete="off"
				iconLeft={faSearch}
				inputClass="rounded-full"
				placeholder="Zoek een product"
			/>
		</div>
	</div>

	{#if errorMessage}
		<div class="text-error flex gap-2 items-center">
			<Fa icon={faExclamationTriangle} />
			{errorMessage}
		</div>
	{:else if loading}
		<div class="mt-2 flex gap-2 flex-wrap justify-center">
			{#each Array(8) as _}
				<ProductCardSkeleton />
			{/each}
		</div>
	{:else}
		<div class="mt-2 flex gap-2 flex-wrap justify-center">
			{#each searchedProducts as product}
				<ProductCard {product} />
			{:else}
				<div class="flex flex-col gap-2 mt-4">
					<Fa icon={faBorderNone} class="min-w-20" size="4x" />
					Geen producten gevonden
				</div>
			{/each}
		</div>
	{/if}
</div>
