<script lang="ts">
	import type { Product } from "$lib/domain/Product"
	import { cartAddTrigger, cartStore } from "$lib/stores/CartStore"
	import {
		faBorderNone,
		faCartShopping,
		faExclamationTriangle,
		faImage,
		faTrashCan,
		faXmark,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	let dropdownButton: HTMLElement

	function removeItem(product: Product | undefined, event: any) {
		if (!product) return
		dropdownButton.focus()
		cartStore.remove(product)
	}

	$: combinedPrice = $cartStore
		? Promise.all($cartStore).then((cartItems) =>
				cartItems.reduce(
					(acc, item) => acc + (item.product?.price ?? 0) * item.amount,
					0
				)
			)
		: 0

	$: showCartOnAdd($cartAddTrigger)
	function showCartOnAdd(value: number) {
		if (value) dropdownButton.focus()
	}
</script>

<div class="dropdown dropdown-end">
	<div
		bind:this={dropdownButton}
		tabindex="0"
		role="button"
		class="btn btn-square btn-ghost relative"
		title="Winkelmandje"
	>
		<Fa icon={faCartShopping} class="text-xl" />
		{#if $cartStore && $cartStore.length}
			<div
				class="absolute -top-2 -end-2 inline-flex items-center justify-center w-6 h-6 text-xs z-10 font-bold bg-primary border-2 border-base-100 rounded-full text-base-100"
			>
				{$cartStore.length}
			</div>
		{/if}
	</div>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<ul
		tabindex="0"
		class="list bg-base-100! dark:bg-base-200! rounded-box shadow-xl dropdown-content w-96"
	>
		<li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Winkelmandje</li>

		{#each $cartStore as productPromise}
			{#await productPromise then cartProduct}
				<li class="flex flex-row items-center gap-1 p-3">
					{#if cartProduct.product}
						<div
							class="cursor-default bg-transparent! text-wrap overflow-clip w-20 h-14 relative rounded-lg"
						>
							{#if cartProduct.product.getImageUrls()?.length > 0 && cartProduct.product.getImageUrls()[0] != null}
								<img
									alt="Productafbeelding"
									class="rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
									src={cartProduct.product.getImageUrls()[0]}
								/>
							{:else}
								<div
									class="bg-transparent! rounded-lg absolute w-full h-full flex items-center justify-center"
									title="Geen afbeelding"
								>
									<Fa
										icon={faImage}
										size="lg"
										class="opacity-80 text-neutral"
									/>
								</div>
							{/if}
						</div>
						<div
							class="flex-1 cursor-default bg-transparent! flex flex-col items-baseline gap-0"
						>
							<a
								class="font-semibold hover:link"
								href="/products/{cartProduct.product.id}"
							>
								{cartProduct.product.name}
							</a>
							<div
								class="opacity-80 text-[13px] mt-[-2px] flex gap-1 items-baseline"
							>
								<span class="text-base-content">{cartProduct.amount}</span>
								<Fa icon={faXmark} size="xs" class="text-base-content" />
								<span class="text-green-600 font-semibold">
									€ {cartProduct.product?.price.toFixed(2)}
								</span>
							</div>
						</div>
						<button
							class="btn btn-square btn-ghost hover:btn-primary"
							aria-label="Remove item"
							on:click={(e) => removeItem(cartProduct.product, e)}
						>
							<Fa icon={faTrashCan} size="lg" />
						</button>
					{:else}
						<div class="cursor-default text-wrap text-error flex gap-3">
							<Fa icon={faExclamationTriangle} />
							<span>
								Error: probleem bij het laden van product uit winkelmandje
							</span>
						</div>
					{/if}
				</li>
			{:catch error}
				<li
					class="text-error flex gap-2 flex-row items-center text-md ml-4 m-1"
				>
					<Fa icon={faExclamationTriangle} class="p-0" />
					<span>Error: {error}</span>
				</li>
			{/await}
		{:else}
			<div class="flex flex-col gap-4 p-4 pb-4 mt-1 items-center">
				<Fa icon={faCartShopping} size="2x" />
				<div class="flex flex-col gap-2 items-center">
					<span>Uw winkelwagen is leeg</span>
					<span>
						Ontdek al onze producten op de
						<a href="/products" class="link">verhuur</a>
						pagina
					</span>
				</div>
			</div>
		{/each}

		{#if $cartStore && $cartStore.length > 0}
			<div
				class="p-3 px-4 m-1 pb-2 flex flex-row justify-between interaction items-center border-t-2 border-base-300"
			>
				<div class="font-semibold text-lg">Subtotaal:</div>
				{#await combinedPrice}
					<div class="text-green-600 font-semibold text-lg">
						€ {Number(0).toFixed(2)}
					</div>
				{:then price}
					<div class="text-green-600 font-semibold text-lg">
						€ {price.toFixed(2)}
					</div>
				{:catch error}
					<li class="p-4 text-error flex flex-row items-center gap-2">
						<Fa icon={faExclamationTriangle} class="p-0" />Error bij berekenen
						van prijs {error}
					</li>
				{/await}
			</div>

			<li class="mx-4 mt-1 mb-2 flex flex-row justify-between">
				<a class="btn" href="/todo">Winkelmandje bekijken</a>
				<a class="btn btn-primary" href="/checkout">Afrekenen</a>
			</li>
		{/if}
	</ul>
</div>
