<script lang="ts">
	import Input from "$components/formHelpers/Input.svelte"
	import type { Product } from "$lib/domain/Product"
	import { productStore } from "$lib/stores/ProductStore"
	import { faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"

	import Fa from "svelte-fa"

	let selectedProducts: Array<{ product: Product; amount: number }> = []
	let searchQuery = ""

	$: filteredProducts = $productStore?.filter(
		(e) =>
			e.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
			!selectedProducts.some((f) => f.product.id === e.id)
	)

	function addProduct(product: Product) {
		selectedProducts = [...selectedProducts, { product, amount: 1 }]
	}

	function removeProduct(product: Product) {
		selectedProducts = selectedProducts.filter(
			(e) => e.product.id !== product.id
		)
	}
</script>

<!-- Selected products list -->
<div class="mb-4 space-y-2 mt-6">
	{#each selectedProducts as product}
		<div class="flex gap-2 items-center p-2 bg-base-200 rounded-lg">
			<div class="flex-1 font-medium">
				{product.product.name}
			</div>
			<div class="w-24">
				<input
					type="number"
					class="input input-bordered input-sm w-full"
					placeholder="Aantal"
					min="1"
					bind:value={product.amount}
				/>
			</div>
			<button
				type="button"
				class="btn btn-error btn-sm btn-square"
				on:click={() => removeProduct(product.product)}
			>
				<Fa icon={faTrash} />
			</button>
		</div>
	{:else}
		<div class="flex gap-2 items-center p-2 py-3 bg-base-200 rounded-lg">
			Geen producten toegevoegd
		</div>
	{/each}
</div>

<!-- Search bar -->
<Input
	class="mb-2"
	type="text"
	bind:value={searchQuery}
	size="full"
	placeholder="Zoek producten..."
	iconLeft={faSearch}
></Input>

<!-- Available products list -->
<div
	class="border-2 border-[#d1d1d1] dark:border-[#464e57] rounded-lg overflow-y-auto h-full"
>
	{#if filteredProducts === undefined}
		<div class="p-4 text-center opacity-50">
			Producten laden <span class="loading loading-ring"></span>
		</div>
	{:else}
		{#each filteredProducts as product}
			<button
				type="button"
				class="w-full p-2.5 hover:bg-base-200 flex justify-between items-center border-b-2 border-[#d1d1d1] dark:border-[#464e57] last:border-b-0 hover:cursor-pointer"
				on:click={() => addProduct(product)}
			>
				<div class="avatar">
					<div class="h-10 w-14 rounded mr-3">
						<img
							src={product.getThumbnailUrls()[0]}
							alt="Product"
						/>
					</div>
				</div>
				<div class="text-left flex-1">
					<div class="font-medium">{product.name}</div>
					<div class="text-sm opacity-70">
						€{product.price.toFixed(2)}
					</div>
				</div>
				<div class="btn btn-soft text-primary! btn-sm">
					<Fa icon={faPlus} class="text-primary" /> Toevoegen
				</div>
			</button>
		{:else}
			<div class="p-4 text-center opacity-50">Geen producten gevonden</div>
		{/each}
	{/if}
</div>
