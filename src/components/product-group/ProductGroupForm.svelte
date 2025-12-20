<script lang="ts">
	import Checkbox from "$components/formHelpers/Checkbox.svelte"
	import Dropzone from "$components/formHelpers/Dropzone.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import Quill from "$components/formHelpers/Quill.svelte"
	import Speaker from "$components/icons/Flowbite/Speaker.svelte"
	import { 		CategoryValues,Product, type Category } from "$lib/domain/Product"
	import type { UploadProgress } from "$lib/utils/UploadProgress"
	import {
		faExclamationTriangle,
		faFileLines,
		faInfinity,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import ProductGroupProductSelector from "./ProductGroupProductSelector.svelte"
	import type { ProductAmount } from "$lib/domain/ProductAmount"
	import MultiSelect from "$components/formHelpers/MultiSelect.svelte"

	export let name: string
	export let visible: boolean
	export let price: number
	export let combinedImages: (string | File)[]
	export let categories: Category[] = []
	export let description: string
	export let maxOrderAmount: null | number
	export let selectedProducts: ProductAmount[]

	export let submitLabel: string
	export let onSave: () => Promise<void>
	export let progress: UploadProgress[]
	export let newProductGroup: boolean

	let activeTab: "products" | "description" = "products"
	
	let saving = false
	let errorMessage = ""

	async function onSubmitWrapper() {
		saving = true
		errorMessage = ""
		try {
			await onSave()
		} catch (error) {
			console.error(error)
			if (error instanceof Error) {
				errorMessage = error.toString()
			} else {
				errorMessage = "An unknown error occurred"
			}
		}
		saving = false
	}

	function clearMaxAmount() {
		maxOrderAmount = null
	}
</script>

<form class="flex flex-col" on:submit|preventDefault={onSubmitWrapper}>
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
							on:click={clearMaxAmount}
						>
							<Fa icon={faInfinity} />
						</button>
					</div>
				</Input>
				<Dropzone
					label="Afbeeldingen:"
					bind:combinedImages
					showDiskSize={newProductGroup}
					{progress}
					previewConverter={Product.imageToThumbnailUrl}
				/>
				<MultiSelect
				label="Categorieën:"
				bind:values={categories}
				options={CategoryValues}
				required
				/>
				<div class="hidden md:block">
					<div class="w-fit" class:hover:cursor-wait={saving}>
						<button
							class="btn btn-primary mt-2"
							type="submit"
							disabled={saving}
						>
							{submitLabel}
							<span class="loading loading-ring" class:hidden={!saving}></span>
						</button>
					</div>
					{#if errorMessage}
						<div class="text-error flex gap-2 items-center mt-2">
							<Fa icon={faExclamationTriangle} />
							{errorMessage}
						</div>
					{/if}
				</div>
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
					<Fa icon={faFileLines} class="mr-1.5" /> Beschrijving
				</button>
			</div>

			<!-- Tab content -->
			<div class="h-[524px] flex flex-col">
				{#if activeTab === "products"}
					<ProductGroupProductSelector bind:selectedProductAmounts={selectedProducts}></ProductGroupProductSelector>
				{:else if activeTab === "description"}
					<Quill
						label="Beschrijving van product:"
						bind:value={description}
						required
					/>
				{/if}
			</div>
		</div>
	</div>
	<div class="md:hidden">
		<div class="w-fit" class:hover:cursor-wait={saving}>
			<button class="btn btn-primary mt-2" type="submit" disabled={saving}>
				{submitLabel}
				<span class="loading loading-ring" class:hidden={!saving}></span>
			</button>
		</div>
		{#if errorMessage}
			<div class="text-error flex gap-2 items-center mt-2">
				<Fa icon={faExclamationTriangle} />
				{errorMessage}
			</div>
		{/if}
	</div>
</form>
