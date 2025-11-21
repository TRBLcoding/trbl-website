<script lang="ts">
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import Checkbox from "$components/formHelpers/Checkbox.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import Quill from "$components/formHelpers/Quill.svelte"
	import Speaker from "$components/icons/Flowbite/Speaker.svelte"
	import type { User } from "$lib/domain/User"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import {
		faInfinity,
		faPlus,
		faTrash,
		faSearch,
		faFileLines,
	} from "@fortawesome/free-solid-svg-icons"

	import Fa from "svelte-fa"

	let name = ""
	let visible: boolean = true
	let price = 0
	let maxOrderAmount: null | number = null
	let saving = false
	let description = ""
	let activeTab: "products" | "description" = "products"

	// Demo products data
	const availableProducts = [
		{ id: 1, name: "Product A", price: 10.99 },
		{ id: 2, name: "Product B", price: 15.5 },
		{ id: 3, name: "Product C", price: 8.75 },
		{ id: 4, name: "Product D", price: 12.0 },
		{ id: 5, name: "Product E", price: 20.25 },
		{ id: 6, name: "Product F", price: 5.99 },
	]

	let selectedProducts: Array<{ productId: number; amount: number }> = []
	let searchQuery = ""

	$: filteredProducts = availableProducts.filter(
		(p) =>
			p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
			!selectedProducts.some((sp) => sp.productId === p.id)
	)

	function addProduct(productId: number) {
		selectedProducts = [...selectedProducts, { productId, amount: 1 }]
	}

	function removeProduct(productId: number) {
		selectedProducts = selectedProducts.filter((p) => p.productId !== productId)
	}

	function getProductName(productId: number): string {
		return availableProducts.find((p) => p.id === productId)?.name || ""
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Productgroep aanmaken")
	// -- Authguard --
	$: if ($authStore === null || ($authStore && !($authStore as User).isAdmin()))
		goto(resolve("/"))
</script>

<div class="mx-6 mt-3 mb-8">
	<div class="flex flex-row gap-3 items-center mb-1">
		<h1 class="text-2xl font-bold">Productgroep aanmaken</h1>
		<button class="btn btn-primary btn-sm normal-case"> Toon preview </button>
	</div>

	<form class="flex flex-col">
		<div class="flex flex-col lg:flex-row lg:gap-8 xl:gap-14">
			<div class="flex-col flex-auto min-w-sm">
				<div class="flex-col flex-auto min-w-sm">
					<Input
						type="text"
						label="Naam:"
						placeholder="Naam"
						bind:value={name}
						required
					/>
					<div class="mt-1">
						<Checkbox label="Zichtbaar" bind:value={visible} />
					</div>
					<Input
						type="number"
						step=".01"
						label="Prijs:"
						placeholder="Prijs €"
						bind:value={price}
						required
					/>
					<Input
						type="number"
						step="1"
						min="1"
						label="Max hoeveelheid:"
						placeholder="Onbeperkt"
						bind:value={maxOrderAmount}
					>
						<div slot="join">
							<button
								title="Clear"
								class="btn btn-square join-item border-2 border-l-0 border-[#d1d1d1] dark:border-[#474e56]"
								type="button"
							>
								<Fa icon={faInfinity} />
							</button>
						</div>
					</Input>
				</div>
			</div>
			<div class="flex-col w-full -mt-11">
				<!-- Tabs -->
				<div role="tablist" class="tabs tabs-border">
					<button
						type="button"
						role="tab"
						class="tab flex items-center"
						class:tab-active={activeTab === "products"}
						on:click={() => (activeTab = "products")}
					>
						<Speaker class="mr-1.5 pb-0.5"></Speaker> Producten ({selectedProducts.length})
					</button>
					<button
						type="button"
						role="tab"
						class="tab"
						class:tab-active={activeTab === "description"}
						on:click={() => (activeTab = "description")}
					>
					 <Fa icon={faFileLines} class="mr-1.5" />	Beschrijving
					</button>
				</div>

				<!-- Tab content -->
				<div class="">
					{#if activeTab === "products"}
						<!-- Products section -->
						<div class="mt-6 min-h-60">
							<!-- Selected products list -->
							<div class="mb-4 space-y-2">
								{#each selectedProducts as product}
									<div
										class="flex gap-2 items-center p-2 bg-base-200 rounded-lg"
									>
										<div class="flex-1 font-medium">
											{getProductName(product.productId)}
										</div>
										<div class="w-24">
											<input
												type="number"
												class="input input-bordered input-sm w-full"
												placeholder="Aantal"
												min="1"
												bind:value={product.amount}
											/>
										</div>
										<button
											type="button"
											class="btn btn-error btn-sm btn-square"
											on:click={() => removeProduct(product.productId)}
										>
											<Fa icon={faTrash} />
										</button>
									</div>
								{:else}
									<div
										class="flex gap-2 items-center p-2 py-3 bg-base-200 rounded-lg"
									>
										Geen producten geselecteerd
									</div>
								{/each}
							</div>

							<!-- Search bar -->
							<div class="relative mb-2">
								<input
									type="text"
									class="input input-bordered w-full pl-10"
									placeholder="Zoek producten..."
									bind:value={searchQuery}
								/>
								<Fa
									icon={faSearch}
									class="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
								/>
							</div>

							<!-- Available products list -->
							<div class="border rounded-lg max-h-97 overflow-y-auto">
								{#each filteredProducts as product}
									<button
										type="button"
										class="w-full p-3 hover:bg-base-200 flex justify-between items-center border-b last:border-b-0"
										on:click={() => addProduct(product.id)}
									>
										<div class="text-left">
											<div class="font-medium">{product.name}</div>
											<div class="text-sm opacity-70">
												€{product.price.toFixed(2)}
											</div>
										</div>
										<Fa icon={faPlus} class="text-primary" />
									</button>
								{:else}
									<div class="p-4 text-center opacity-50">
										Geen producten gevonden
									</div>
								{/each}
							</div>
						</div>
					{:else if activeTab === "description"}
						<!-- Description section -->
						<div class="h-[500px]">
							<Quill
								label="Beschrijving van product:"
								bind:value={description}
								required
							/>
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="w-fit" class:hover:cursor-wait={saving}>
			<button class="btn btn-primary mt-2" type="submit" disabled={saving}>
				Productgroep aanmaken
				<span class="loading loading-ring" class:hidden={!saving}></span>
			</button>
		</div>
		<!-- {#if errorMessage}
        <div class="text-error flex gap-2 items-center mt-2">
            <Fa icon={faExclamationTriangle} />
            {errorMessage}
        </div>
    {/if} -->
	</form>
</div>
