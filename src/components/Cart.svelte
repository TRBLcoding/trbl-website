<script lang="ts">
	import type { Product } from "$lib/domain/Product"
	import { cartStore } from "$lib/stores/CartStore"
	import {
		faBorderNone,
		faCartShopping,
		faTrashCan,
		faXmark,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	function removeItem(product: Product | undefined) {
		if (!product) return
		cartStore.remove(product)
	}

	$: combinedPrice = Promise.all($cartStore).then((cartItems) =>
		cartItems.reduce(
			(acc, item) => acc + (item.product?.price ?? 0) * item.amount,
			0
		)
	)
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

		{#each $cartStore as productPromise}
			{#await productPromise then cartProduct}
				<li class="list-row flex flex-row items-center gap-1 p-3">
					<div
						class="cursor-default bg-base-100! overflow-clip w-20 h-14 relative rounded-lg"
					>
						<img
							alt="temp"
							class="rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
							src={cartProduct.product?.getImageUrls()[0]}
						/>
					</div>
					<div
						class="flex-1 cursor-default bg-base-100! flex flex-col items-baseline gap-0"
					>
						<a
							class="font-semibold hover:link"
							href="/products/{cartProduct.product?.id}"
							>{cartProduct.product?.name || "Product not found"}</a
						>
						<div
							class="opacity-80 text-[13px] mt-[-2px] flex gap-1 items-baseline"
						>
							{cartProduct.amount}
							<Fa icon={faXmark} size="xs" />
							<span class="text-green-600 font-semibold"
								>€{cartProduct.product?.price.toFixed(2)}</span
							>
						</div>
					</div>
					<button
						class="btn btn-square btn-ghost"
						aria-label="Remove item"
						on:click={() => removeItem(cartProduct.product)}
					>
						<Fa icon={faTrashCan} size="lg" />
					</button>
				</li>
			{:catch error}
				<li class="p-4 text-error">Error loading products</li>
			{/await}
		{/each}

		{#if $cartStore.length > 0}
			<div
				class="p-4 pb-2 flex flex-row justify-between interaction items-center"
			>
				<div class="font-semibold">Subtotaal:</div>
				{#await combinedPrice}
					<div>€ {0}</div>
				{:then price}
					<div class="text-green-600 font-semibold text-lg">
						€ {price.toFixed(2)}
					</div>
				{:catch error}
					<li class="p-4 text-error">Error calculating price</li>
				{/await}
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
		{/if}
	</ul>
</div>
