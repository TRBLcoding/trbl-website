<script lang="ts">
	import { resolve } from "$app/paths"
	import AmountInput from "$components/formHelpers/AmountInput.svelte"
	import type { ProductOrder } from "$lib/domain/ProductOrder"
	import { cartStore } from "$lib/stores/CartStore"
	import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export let productOrder: ProductOrder

	let amount = productOrder.amount

	function updateAmount(productOrder: ProductOrder, newAmount: number) {
		if (amount <= -1) removeItem(productOrder)
		if (amount === productOrder.amount) return
		else cartStore.set(productOrder.product, newAmount)
	}
	function removeItem(productOrder: ProductOrder) {
		cartStore.remove(productOrder.product)
	}

	$: clampAmount(amount)
	function clampAmount(newAmount: number) {
		if (newAmount < 0) amount = 0
		if (productOrder.product.getMaxOrderAmount() < newAmount)
			amount = productOrder.product.maxOrderAmount!
	}
</script>

<div class="card bg-base-200 shadow-lg">
	<div class="card-body p-4">
		<div class="flex sm:flex-row gap-4">
			<!-- Product Image -->
			<a
				class="avatar w-20 h-20 sm:w-24 sm:h-24 rounded"
				href={resolve("/products/[slug]", {
					slug: productOrder.product.id.toString(),
				})}
			>
				<img
					src={productOrder.product.getThumbnailUrls()[0]}
					alt=""
					class="rounded"
				/>
			</a>

			<!-- Product Info -->
			<div class="flex-1">
				<a
					class="card-title sm:text-lg link link-hover"
					href={resolve("/products/[slug]", {
						slug: productOrder.product.id.toString(),
					})}
				>
					{productOrder.product.name}
				</a>
				<span
					class="badge hidden sm:flex badge-soft text-xs gap-1 font-semibold opacity-80 mt-1 items-center"
				>
					Stukprijs: € {productOrder.product.price.toFixed(2)}
				</span>

				<!-- Quantity Controls -->
				<div class="flex items-center gap-2 mt-4">
					<span class="hidden sm:block text-sm font-bold">Aantal:</span>
					<AmountInput
						bind:amount
						max={productOrder.product.getMaxOrderAmount()}
						deleteOnZero
						onChange={() => updateAmount(productOrder, amount)}
						class="w-30"
					/>
				</div>
			</div>

			<!-- Price & Remove -->
			<div class="flex flex-col items-end justify-between">
				<button
					class="btn btn-square btn-ghost hover:btn-primary btn-sm"
					on:click={() => removeItem(productOrder)}
					title="Verwijder item"
				>
					<Fa icon={faTrashCan} size="lg" />
				</button>
				<div class="text-right">
					<p class="text-sm text-base-content/70">Totaal:</p>
					<p class="text-md sm:text-xl font-bold text-green-600">
						€&nbsp;{productOrder.getSubtotal().toFixed(2)}
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
