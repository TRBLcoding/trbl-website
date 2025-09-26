<script lang="ts">
	import type { Product } from "$lib/domain/Product"
	import {
		faCreditCard,
		faMinus,
		faPlus,
		faTruck,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export let product: Product
</script>

<div class="sticky top-6">
	<div class="flex flex-col px-5 py-4 bg-base-200 rounded-lg">
		<h2 class="text-lg font-semibold">{product.name}</h2>
		<span class="text-3xl mx-auto mt-4 mb-6 font-semibold text-green-600">
			€ {product.price}
		</span>

		<div class="join flex flex-1 w-full">
			<button
				class="btn btn-lg btn-square btn-neutral join-item"
				disabled={true}
			>
				<Fa icon={faMinus} size="lg" />
			</button>
			<label class="input input-lg join-item flex-1">
				<input
					class="text-center"
					type="number"
					value="1"
					min="1"
					step="1"
					required
				/>
			</label>
			<button
				class="btn btn-lg btn-square btn-neutral join-item"
				disabled={false}
			>
				<Fa icon={faPlus} size="lg" />
			</button>
		</div>
		<button class="btn btn-primary mt-6 mb-2" type="button">Toevoegen</button>
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
