<script lang="ts">
	import { resolve } from "$app/paths"
	import AmountInput from "$components/formHelpers/AmountInput.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import type { Product } from "$lib/domain/Product"
	import { ProductAmount } from "$lib/domain/ProductAmount"
	import { productStore } from "$lib/stores/ProductStore"
	import { faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"

	import Fa from "svelte-fa"

	export let selectedProductAmounts: ProductAmount[]
	let searchQuery = ""

	$: filteredProductAmounts = $productStore?.filter(
		(product) =>
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
			!selectedProductAmounts.some((e) => e.productId === product.id)
	)

	function addProduct(product: Product) {
		selectedProductAmounts = [
			...selectedProductAmounts,
			new ProductAmount(product.id, 1),
		]
	}

	function removeProduct(product: Product) {
		selectedProductAmounts = selectedProductAmounts.filter(
			(e) => e.productId !== product.id
		)
	}

	function onChangeAmount(product: Product, newAmount: number) {
		if (newAmount <= -1) {
			removeProduct(product)
		}
	}
</script>

<!-- Selected products list -->
<div class="mb-4 space-y-2 mt-6">
	{#each selectedProductAmounts as productAmount}
		{#await productAmount.getProduct() then product}
			<div class="flex gap-2 items-center p-2 bg-base-200 rounded-lg">
				<div class="avatar">
					<div class="h-10 w-14 rounded mr-3">
						<img src={product.getThumbnailUrls()[0]} alt="Product" />
					</div>
				</div>
				<div class="text-left flex-1">
					<div class="flex items-center gap-2">
						<a
							class="font-medium link link-hover"
							target="_blank"
							href={resolve("/products/[slug]", {
								slug: product.id.toString(),
							})}>{product.name}</a
						>
						{#each product.categories as category}
							<div class="badge badge-sm badge-soft font-semibold">
								{category}
							</div>
						{/each}
					</div>
					<div class="text-sm opacity-70">
						€{product.price.toFixed(2)}
					</div>
				</div>
				<div class="flex items-center gap-2 mr-1">
					<span class="text-sm font-semibold">Aantal:</span>

					<AmountInput
						bind:amount={productAmount.amount}
						size="sm"
						max={2}
						deleteOnZero
						class="w-30"
						onChange={() => onChangeAmount(product, productAmount.amount)}
					></AmountInput>
				</div>
				<button
					type="button"
					class="btn btn-error btn-sm btn-square"
					on:click={() => removeProduct(product)}
					title="Verwijderen"
				>
					<Fa icon={faTrash} />
				</button>
			</div>
		{/await}
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
	{#if filteredProductAmounts === undefined}
		<div class="p-4 text-center opacity-50">
			Producten laden <span class="loading loading-ring"></span>
		</div>
	{:else}
		{#each filteredProductAmounts as product}
			<button
				type="button"
				class="w-full p-2.5 hover:bg-base-200 flex justify-between items-center border-b-2 border-[#d1d1d1] dark:border-[#464e57] last:border-b-0 hover:cursor-pointer"
				on:click={() => addProduct(product)}
				title="Toevoegen"
			>
				<div class="avatar">
					<div class="h-10 w-14 rounded mr-3">
						<img src={product.getThumbnailUrls()[0]} alt="Product" />
					</div>
				</div>
				<div class="text-left flex-1">
					<div class="flex items-center gap-2">
						<div class="font-medium mr-1">{product.name}</div>
						{#each product.categories as category}
							<div class="badge badge-sm badge-soft font-semibold">
								{category}
							</div>
						{/each}
					</div>
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
