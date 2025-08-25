<script lang="ts">
	import Checkbox from "$components/formHelpers/Checkbox.svelte"
	import CLEditor from "$components/formHelpers/CLEditor.svelte"
	import Dropzone from "$components/formHelpers/Dropzone.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import MultiSelect from "$components/formHelpers/MultiSelect.svelte"
	import Select from "$components/formHelpers/Select.svelte"
	import { CategoryValues, Product, TypeValues, type Category, type Type } from "$lib/domain/Product"
	import type { UploadProgress } from "$lib/utils/UploadProgress"

	export let name = ""
	export let visible = true
	export let price = 0
	export let combinedImages: (string | File)[] = []
	export let categories: Category[] = []
	export let type: Type = ""
	export let description = ""

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
			errorMessage = "error occured"
		}
		saving = false
	}
</script>

<form class="flex flex-col gap-2" on:submit={onSubmitWrapper}>
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

	<CLEditor label="Beschrijving van product:" bind:value={description} />

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
		<p class="text-error">{errorMessage}</p>
	{/if}
</form>
