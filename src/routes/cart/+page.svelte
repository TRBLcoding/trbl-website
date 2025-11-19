<script lang="ts">
	import { resolve } from "$app/paths"
	import CartItemFull from "$components/cart/CartItemFull.svelte"
	import CartItemFullSkeleton from "$components/cart/CartItemFullSkeleton.svelte"
	import { ProductOrder } from "$lib/domain/ProductOrder"
	import { cartStore } from "$lib/stores/CartStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"

	$: subtotal = ProductOrder.calculatePrice($cartStore || [])

	// -- Page title --
	pageHeadStore.updatePageTitle("Winkelmandje")
</script>

<div class="max-w-6xl mx-auto p-6">
	<h1 class="text-3xl font-bold mb-6">Winkelmandje</h1>

	{#if $cartStore && $cartStore.length === 0}
		<div class="card bg-base-200">
			<div class="card-body text-center">
				<p class="text-xl">Je winkelmandje is leeg</p>
				<div class="card-actions justify-center mt-4">
					<a href={resolve("/products")} class="btn btn-primary"
						>Ga verder met winkelen</a
					>
				</div>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Cart Items -->
			<div class="lg:col-span-2 space-y-4">
				{#each $cartStore as productOrderPromise (productOrderPromise)}
					{#await productOrderPromise}
						<CartItemFullSkeleton />
					{:then productOrder}
						<CartItemFull {productOrder} />
					{/await}
				{:else}
					<CartItemFullSkeleton />
				{/each}
			</div>

			<!-- Order Summary -->
			<div class="lg:col-span-1">
				<div class="card bg-base-200 shadow-lg sticky top-6">
					<div class="card-body">
						<h2 class="card-title">Overzicht</h2>

						<div class="divider my-1"></div>

						<div class="space-y-2">
							<div class="flex justify-between">
								<span>Subtotaal:</span>
								{#await subtotal}
									<div class="skeleton h-5 w-16"></div>
								{:then price}
									<span class="text-green-600">€ {price?.toFixed(2)}</span>
								{/await}
							</div>
							<div class="flex justify-between">
								<span>Verzendkosten:</span>
								{#await subtotal}
									<div class="skeleton h-5 w-16"></div>
								{:then}
									<span>t.b.d.</span>
								{/await}
							</div>
							<div class="flex justify-between">
								<span>Betaling:</span>
								{#await subtotal}
									<div class="skeleton h-5 w-16"></div>
								{:then}
									<span>Factuur of bij ontvangst</span>
								{/await}
							</div>
						</div>

						<div class="divider my-1"></div>

						<div class="flex justify-between text-xl font-bold">
							<span>Totaal:</span>
							{#await subtotal}
								<div class="skeleton h-7 w-26"></div>
							{:then price}
								<span class="text-green-600">€ {price?.toFixed(2)}</span>
							{/await}
						</div>

						<div class="card-actions flex-col mt-4">
							<a class="btn btn-primary btn-block" href={resolve("/checkout")}>
								Afrekenen
							</a>
							<a
								href={resolve("/products")}
								class="btn btn-ghost btn-block btn-soft"
							>
								Verder winkelen
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
