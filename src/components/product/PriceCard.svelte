<script lang="ts">
	import AmountInput from "$components/formHelpers/AmountInput.svelte"
	import type { Product } from "$lib/domain/Product"
	import { cartStore } from "$lib/stores/CartStore"
	import {
		faCreditCard,
		faExclamationTriangle,
		faShoppingCart,
		faTruck,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export let product: Product
	export let isPreview: boolean = false

	let amount = 1

	function addProduct() {
		if (!isPreview) {
			cartStore.add(product, amount)
		}
	}
</script>

<div class="sticky top-6">
	<div class="flex flex-col px-5 py-4 bg-base-200 rounded-lg">
		<h2 class="text-xl font-semibold">{product.name}</h2>
		<span class="text-3xl mx-auto mt-4 mb-6 font-semibold text-green-600">
			€ {product.price.toFixed(2)}
		</span>
		
		<AmountInput
			bind:amount
			disabled={product.maxOrderAmount === 1}
			isLessDisabled={() => amount <= 1}
			isMoreDisabled={() => product.isMaxOrderAmountReached(amount)}
			size="lg"
		></AmountInput>

		{#if product.maxOrderAmount === amount}
			<div class="flex w-full items-center justify-center">
				<div class="flex gap-1 items-center opacity-60 mt-2">
					<Fa icon={faExclamationTriangle} class="w-5" />
					<span class="text-sm">Maximum aantal producten bereikt</span>
				</div>
			</div>
		{/if}
		<button
			class="btn btn-primary mt-4 mb-2 items-center"
			type="button"
			on:click={addProduct}
			><Fa icon={faShoppingCart} /> Toevoegen
		</button>
		<div class="mt-3 flex flex-col gap-1">
			<div class="flex gap-1 items-center opacity-60">
				<Fa icon={faTruck} class="w-5" />
				<span class="text-sm">Afhaling in Gent of levering mogelijk</span>
			</div>
			<div class="flex gap-1 items-center opacity-60">
				<Fa icon={faCreditCard} class="w-5" />
				<span class="text-sm">Betaling op factuur of bij levering</span>
			</div>
		</div>
	</div>
</div>
