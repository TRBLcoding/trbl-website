<script lang="ts">
	import type { Product } from "$lib/domain/Product"
	import { cartStore } from "$lib/stores/CartStore"
	import { pushCreatedToast } from "$lib/utils/Toast"
	import {
		faBorderNone,
		faCartShopping,
		faXmark,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export function zip<T, U>(array1: T[], array2: U[]): [T, U][] {
		if (array1.length !== array2.length)
			throw new Error("Arrays must have equal length")
		return array1.map((item, index) => [item, array2[index]])
	}

	function removeItem(product: Product | undefined) {
		if (!product) return
		cartStore.remove(product)
		// pushCreatedToast("Product verwijderd uit winkelmandje")
	}
</script>

<div class="dropdown dropdown-hover dropdown-end">
	<div
		tabindex="0"
		role="button"
		class="btn btn-square btn-ghost relative"
		title="Winkelmandje"
	>
		<Fa icon={faCartShopping} class="text-xl" />
		{#await $cartStore}
			waiting
		{:then cartProducts}
			<!-- promise was fulfilled -->
			{#if cartProducts.length}
				<div
					class="absolute -top-2 -end-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-primary border-2 border-base-100 rounded-full text-base-100"
				>
					{cartProducts.length}
				</div>
			{/if}
		{/await}
	</div>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<ul
		tabindex="0"
		class="list bg-base-100 rounded-box shadow-md dropdown-content w-96 mt-0!"
	>
		<li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Winkelmandje</li>

		{#each $cartStore as productP, i}
			{#await productP then cartProduct}
				<li class="list-row">
					<div>
						<img
							alt="temp"
							class="size-10 rounded-box"
							src="https://img.daisyui.com/images/profile/demo/1@94.webp"
						/>
					</div>
					<div>
						<div>{cartProduct.product?.name}</div>
					</div>
					<button
						class="btn btn-square btn-ghost"
						aria-label="Remove item"
						on:click={() => removeItem(cartProduct.product)}
					>
						<Fa icon={faXmark} class="" />
					</button>
				</li>
			{:catch error}
				<li class="p-4 text-error">Error loading products</li>
			{/await}
		{/each}

		<!-- {#if cartProducts.length > 0}
			<div class="p-4 pb-2 flex flex-row justify-between interaction">
				<div>Subtotaal:</div>
				<div>{15.0}€</div>
			</div>

			<li class="p-4 pb-2 flex flex-row justify-between">
				<a class="btn" href="/todo">Bekijken</a>
				<a class="btn btn-primary" href="/todo">Afrekenen</a>
			</li>
		{:else}
			<div class="flex flex-col gap-4 p-4 pb-4 mt-1 items-center">
				<Fa icon={faBorderNone} size="2x" />
				<span>Geen items in winkelmandje</span>
			</div>
		{/if} -->
	</ul>
</div>
