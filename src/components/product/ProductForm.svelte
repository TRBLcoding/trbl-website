<script lang="ts">
	import Checkbox from "$components/formHelpers/Checkbox.svelte"
	import CLEditor from "$components/formHelpers/CLEditor.svelte"
	import Dropzone from "$components/formHelpers/Dropzone.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import MultiSelect from "$components/formHelpers/MultiSelect.svelte"
	import Select from "$components/formHelpers/Select.svelte"
	import {
		CategoryValues,
		Product,
		TypeValues,
		type Category,
		type Type,
	} from "$lib/domain/Product"
	import type { UploadProgress } from "$lib/utils/UploadProgress"
	import {
		faInfinity,
		faExclamationTriangle,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export let name = ""
	export let visible = true
	export let price = 0
	export let combinedImages: (string | File)[] = []
	export let categories: Category[] = []
	export let type: Type = ""
	export let description = ""
	export let maxOrderAmount: null | number = null

	export let submitLabel: string
	export let onSave: () => Promise<void>
	export let progress: UploadProgress[]
	export let newProduct: boolean

	let saving = false
	let errorMessage = ""

	async function onSubmitWrapper(event: SubmitEvent) {
		event.preventDefault()
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

<form class="flex flex-col" on:submit={onSubmitWrapper}>
	<div class="flex flex-col lg:flex-row lg:gap-8 xl:gap-14">
		<div class="flex-col flex-auto min-w-sm">
			<Input
				type="text"
				label="Naam:"
				placeholder="Naam"
				bind:value={name}
				required
			/>
			<Checkbox label="Zichtbaar" bind:value={visible} />
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
				showDiskSize={newProduct}
				{progress}
				previewConverter={Product.imageToThumbnailUrl}
			/>
			<MultiSelect
				label="Categorieën:"
				bind:values={categories}
				options={CategoryValues}
				required
			/>
			<Select label="Type:" bind:value={type} required>
				{#each TypeValues as type}
					<option>{type}</option>
				{/each}
			</Select>
		</div>
		<div class="flex-col w-full">
			<CLEditor label="Beschrijving van product:" bind:value={description} />
		</div>
	</div>
	<div class="w-fit" class:hover:cursor-wait={saving}>
		<button
			class="btn btn-primary mt-2 max-w-sm"
			type="submit"
			disabled={saving}
		>
			{submitLabel}
			<span class="loading loading-ring" class:hidden={!saving}></span>
		</button>
	</div>
	{#if errorMessage}
		<div class="text-error flex gap-2 items-center mt-2">
			<Fa icon={faExclamationTriangle} class="" />
			{errorMessage}
		</div>
	{/if}
</form>
