<script lang="ts">
	import type { Product } from "$lib/domain/Product"
	import { cartStore } from "$lib/stores/CartStore"
	import { pushCreatedToast } from "$lib/utils/Toast"
	import {
		faCreditCard,
		faExclamation,
		faExclamationTriangle,
		faMinus,
		faPlus,
		faTruck,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export let product: Product
	export let isPreview: boolean = false

	let amount: number = 1

	function decrease() {
		amount = amount - 1
	}
	function increase() {
		amount = amount + 1
	}

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

		<div class="join flex flex-1 w-full mb-2">
			<button
				class="btn btn-lg btn-square btn-neutral join-item"
				disabled={amount <= 1}
				type="button"
				on:click={decrease}
			>
				<Fa icon={faMinus} size="lg" />
			</button>
			<label
				class="input input-lg join-item flex-1 bg-base-300! border-base-300!"
			>
				<input
					class="text-center font-bold"
					type="number"
					bind:value={amount}
					min="1"
					step="1"
					required
					disabled={product.maxOrderAmount === 1}
				/>
			</label>
			<button
				class="btn btn-lg btn-square btn-neutral join-item"
				disabled={product.maxOrderAmount !== null &&
					amount >= product.maxOrderAmount}
				type="button"
				on:click={increase}
			>
				<Fa icon={faPlus} size="lg" />
			</button>
		</div>
		{#if product.maxOrderAmount === amount}
			<div class="flex w-full items-center justify-center">
				<div class="flex gap-1 items-center opacity-60">
					<Fa icon={faExclamationTriangle} class="w-5" />
					<span class="text-sm">Maximum aantal producten bereikt</span>
				</div>
			</div>
		{/if}
		<button
			class="btn btn-primary mt-4 mb-2"
			type="button"
			on:click={addProduct}>Toevoegen</button
		>
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

<style lang="postcss">
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type="number"] {
		-moz-appearance: textfield;
	}
</style>
