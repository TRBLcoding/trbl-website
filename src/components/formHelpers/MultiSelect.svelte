<script lang="ts">
	import { MultiSelect } from "svelte-multiselect"
	import { v4 as uuidv4 } from "uuid"

	export let label: string
	export let values: string[]
	export let required: boolean = false
	export let disabled: boolean = false
	export let size: "full" | "md" | "sm" | "xs" = "sm"
	export let id = ""

	export let placeholder: string = "Kies"
	export let options: readonly string[] = []
	export let allowUserOptions: boolean = false

	$: inputId =
		id ||
		label?.replace(/[ :]/g, "").replace(" ", "-").toLowerCase() ||
		placeholder?.toLowerCase().replace(" ", "-") ||
		uuidv4()
</script>

<div
	class="w-full"
	class:max-w-md={size === "md"}
	class:max-w-sm={size === "sm"}
	class:max-w-xs={size === "xs"}
>
	<label class="label" for={inputId}>
		<span class="label-text">
			{label}
			{#if required}
				<span class="text-red-500 font-bold">*</span>
			{/if}
		</span>
	</label>
	<MultiSelect
		id={inputId}
		bind:selected={values}
		{options}
		{allowUserOptions}
		{placeholder}
		{disabled}
		{required}
		--sms-options-z-index="{100};"
	/>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	/* Integrate svelte-multiselect with Tailwind and dark mode */
	:global(.multiselect) {
		@apply border-2! h-fit! min-h-12! dark:border-[#464e57]!;
		--sms-options-z-index: 100;
		:global(input.form-control) {
			@apply w-0.5 h-0.5;
		}
		:global(.selected .remove:is(:hover, :focus) path) {
			@apply fill-(--color-primary);
		}
		:global(.remove-all:is(:hover, :focus) path) {
			@apply fill-(--color-primary);
		}
		:global(.options) {
			@apply p-2! bg-(--color-base-100)! z-100!;

			:global(li) {
				@apply px-4! py-2! rounded-lg!;
			}
		}
	}
	:global(.multiselect:focus-within) {
		@apply border-black! dark:border-white! outline-2 outline-black dark:outline-white outline-offset-2;
	}
</style>
