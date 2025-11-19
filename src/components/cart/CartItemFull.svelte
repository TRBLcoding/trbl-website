<script lang="ts">
	import { resolve } from "$app/paths"
	import type { ProductOrder } from "$lib/domain/ProductOrder"
	import { cartStore } from "$lib/stores/CartStore"
	import {
		faMinus,
		faPlus,
		faTrashCan,
	} from "@fortawesome/free-solid-svg-icons"
	import { onDestroy } from "svelte"
	import Fa from "svelte-fa"

	export let productOrder: ProductOrder

	let amount: number = productOrder.amount

	function decreaseAmount() {
		if (amount <= 0) removeItem(productOrder)
		else updateAmount(productOrder, amount - 1)
	}
	function increaseAmount() {
		updateAmount(productOrder, amount + 1)
	}
	function updateAmount(productOrder: ProductOrder, newAmount: number) {
		cartStore.set(productOrder.product, newAmount)
	}

	function removeItem(productOrder: ProductOrder) {
		cartStore.remove(productOrder.product)
	}

	$: clampAmount(amount)
	function clampAmount(newAmount: number) {
		if (newAmount < 0) amount = 0
		if (productOrder.product.isMaxOrderAmountReached(newAmount))
			amount = productOrder.product.maxOrderAmount!
	}

	onDestroy(() => {
		if (amount === 0) {
			removeItem(productOrder)
		}
	})
</script>

<div class="card bg-base-200 shadow-lg">
	<div class="card-body">
		<div class="flex flex-col sm:flex-row gap-4">
			<!-- Product Image -->
			<a
				class="avatar w-24 h-24 rounded"
				href={resolve("/products/[slug]", {
					slug:productOrder.product.id.toString(),
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
					class="card-title text-lg link link-hover"
					href={resolve("/products/[slug]", {
						slug: productOrder.product.id.toString(),
					})}
				>
					{productOrder.product.name}
				</a>
				<span
					class="badge badge-soft text-xs gap-1 font-semibold opacity-80 mt-1"
				>
					Stukprijs: € {productOrder.product.price.toFixed(2)}
				</span>

				<!-- Quantity Controls -->
				<div class="flex items-center gap-2 mt-4">
					<span class="text-sm font-bold">Aantal:</span>
					<div class="join flex">
						<button
							class="btn btn-sm btn-square join-item"
							class:btn-primary={amount === 0}
							class:btn-neutral={amount !== 0}
							type="button"
							disabled={amount < 0}
							on:click={decreaseAmount}
							title={amount === 0 ? "Product verwijderen" : "Aantal verlagen"}
						>
							<Fa icon={amount == 0 ? faTrashCan : faMinus} size="lg" />
						</button>
						<input
							class="input input-sm join-item w-15 bg-base-300! border-base-300! text-center font-bold"
							bind:value={amount}
							type="number"
							min="0"
							step="1"
							required
							max={2}
							on:blur={() => updateAmount(productOrder, amount)}
						/>
						<span
							title={productOrder.product.isMaxOrderAmountReached(amount)
								? "Maximum aantal bereikt"
								: "Aantal verhogen"}
						>
							<button
								class="btn btn-sm btn-square btn-neutral join-item"
								type="button"
								on:click={increaseAmount}
								disabled={productOrder.product.isMaxOrderAmountReached(amount)}
							>
								<Fa icon={faPlus} size="lg" />
							</button>
						</span>
					</div>
				</div>
			</div>

			<!-- Price & Remove -->
			<div class="flex flex-col items-end justify-between">
				<button
					class="btn btn-square btn-ghost hover:btn-primary btn-sm"
					on:click={() => removeItem(productOrder)}
					aria-label="Verwijder item"
				>
					<Fa icon={faTrashCan} size="lg" />
				</button>
				<div class="text-right">
					<p class="text-sm text-base-content/70">Totaal:</p>
					<p class="text-xl font-bold text-green-600">
						€ {productOrder.getSubtotal().toFixed(2)}
					</p>
				</div>
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
