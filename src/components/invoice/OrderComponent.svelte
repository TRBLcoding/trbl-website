<script lang="ts">
	import { cartStore } from "$lib/stores/CartStore"
	import {
		faExclamationTriangle,
		faImage,
		faXmark,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export let deliveryMethod: "pick-up" | "delivery"

	// Price calculation
	$: combinedPrice = Promise.all($cartStore).then((cartItems) =>
		cartItems.reduce(
			(acc, item) => acc + (item.product?.price ?? 0) * item.amount,
			0
		)
	)
</script>

<!-- Your order -->
<div>
	<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-1">
		Jouw besteling
	</h2>

	<div class="flex flex-col gap-3 mt-3 bg-base-200 rounded-lg p-4">
		{#each $cartStore as productPromise, i}
			{#await productPromise then cartProduct}
				{#if cartProduct.product}
					<div
						class="flex gap-3 pb-3 border-b border-base-300"
						class:border-b-2={i === 2}
					>
						<div class="overflow-clip w-20 h-14 relative rounded-lg">
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
						<div class="flex-1 flex justify-between">
							<div>
								<h3 class="font-semibold">{cartProduct.product.name}</h3>
								<div class="flex gap-2 items-center mt-1">
									<span
										class="badge badge-soft text-xs gap-1 font-semibold opacity-80"
									>
										<span>{cartProduct.amount}</span>
										<Fa icon={faXmark} size="xs" />
										<span>
											€ {cartProduct.product.price.toFixed(2)}
										</span>
									</span>
								</div>
							</div>
							<span class="font-semibold">
								€ {(cartProduct.product.price * cartProduct.amount).toFixed(2)}
							</span>
						</div>
					</div>
				{:else}
					<div class="cursor-default text-wrap text-error flex gap-3">
						<Fa icon={faExclamationTriangle} />
						<span>
							Error: probleem bij het laden van product uit winkelmandje
						</span>
					</div>
				{/if}
			{:catch error}
				<p>Error loading product: {error.message}</p>
			{/await}
		{/each}

		<!-- Totaal -->
		<div class="flex flex-col gap-2">
			{#await combinedPrice then price}
				<div class="flex justify-between items-center font-semibold">
					<span>Subtotaal</span>
					<span>€ {price?.toFixed(2)}</span>
				</div>
			{/await}

			<div class="flex justify-between items-center font-semibold">
				<span>Levering</span>
				<span>{deliveryMethod === "pick-up" ? "n.v.t.": "t.b.d."}</span>
			</div>

			{#await combinedPrice then price}
				<div
					class="flex justify-between items-center font-bold text-xl border-t border-base-300 pt-2"
				>
					<span>Totaal</span>
					<span class="text-green-600"
						>€ {(price)?.toFixed(2)}</span
					>
				</div>
			{/await}
		</div>
	</div>
</div>
