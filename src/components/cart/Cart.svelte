<script lang="ts">
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import type { Product } from "$lib/domain/Product"
	import { ProductOrder } from "$lib/domain/ProductOrder"
	import { cartAddTrigger, cartStore } from "$lib/stores/CartStore"
	import {
		faCartShopping,
		faExclamationTriangle,
		faImage,
		faTrashCan,
		faXmark,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	let dropdownButton: HTMLElement

	function removeItem(product: Product | undefined) {
		if (!product) return
		dropdownButton.focus()
		cartStore.remove(product)
	}

	$: combinedPrice = $cartStore ? ProductOrder.calculatePrice($cartStore) : 0

	$: showCartOnAdd($cartAddTrigger)
	function showCartOnAdd(value: number) {
		if (value) dropdownButton.focus()
	}

	function handleCartClick() {
		if (isMobile) goto(resolve("/cart"))
	}
	let windowWidth = 0
	$: isMobile = windowWidth < 1024
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="lg:dropdown dropdown-end inline-block">
	<button
		on:click={handleCartClick}
		bind:this={dropdownButton}
		tabindex={0}
		class="btn btn-square btn-ghost mb-1 relative"
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
	</button>

	{#if !isMobile}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<ul
			tabindex={-1}
			class="list bg-base-200 rounded-box shadow-xl dropdown-content w-96"
		>
			<li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Winkelmandje</li>

			{#each $cartStore as productOrderPromise (productOrderPromise)}
				{#await productOrderPromise then productOrder}
					<li class="flex flex-row items-center gap-1 p-3">
						{#if productOrder.product}
							<div
								class="cursor-default bg-transparent! text-wrap overflow-clip w-20 h-14 relative rounded-lg"
							>
								{#if productOrder.product.getImageUrls()?.length > 0 && productOrder.product.getImageUrls()[0] != null}
									<img
										alt="Productafbeelding"
										class="rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
										src={productOrder.product.getImageUrls()[0]}
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
									href={resolve("/products/[slug]", {
										slug: productOrder.product.id.toString(),
									})}
								>
									{productOrder.product.name}
								</a>
								<div
									class="opacity-80 text-[13px] -mt-0.5 flex gap-1 items-baseline"
								>
									<span class="text-base-content">{productOrder.amount}</span>
									<Fa icon={faXmark} size="xs" class="text-base-content" />
									<span class="text-green-600 font-semibold">
										€ {productOrder.product?.price.toFixed(2)}
									</span>
								</div>
							</div>
							<button
								class="btn btn-square btn-ghost hover:btn-primary"
								aria-label="Remove item"
								on:click={() => removeItem(productOrder.product)}
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
							<a href={resolve("/products")} class="link">verhuur</a>
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
					<a class="btn btn-soft" href={resolve("/cart")}
						>Winkelmandje bekijken</a
					>
					<a class="btn btn-primary" href={resolve("/checkout")}>Offerte aanvragen</a>
				</li>
			{/if}
		</ul>
	{/if}
</div>
