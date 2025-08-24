<script lang="ts">
	import { MultiSelect } from "svelte-multiselect"

	export let label: string
	export let values: string[]
	export let required = false
	export let disabled = false
	export let size: "full" | "md" | "sm" | "xs" = "sm"

	export let placeholder = "Kies"
	export let options = Array<string>()
	export let allowUserOptions = false
</script>

<div
	class="form-control w-full"
	class:max-w-md={size === "md"}
	class:max-w-sm={size === "sm"}
	class:max-w-xs={size === "xs"}
>
	<label class="label" for="multiselect">
		<span class="label-text">
			{label}
			{#if required}
				<span class="text-red-500 font-bold">*</span>
			{/if}
		</span>
	</label>
	<MultiSelect
		bind:selected={values}
		{options}
		{allowUserOptions}
		{placeholder}
		{disabled}
	/>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	/* Integrate svelte-multiselect with Tailwind and dark mode */
	:global(.multiselect) {
		@apply border-2! h-fit! min-h-12! dark:border-[#464e57]!;

		:global(input.form-control) {
			@apply hidden!;
		}
		:global(.selected .remove:is(:hover, :focus) path) {
			/* @apply fill-primary; */
			@apply fill-[var(--color-primary)];
		}
		:global(.remove-all:is(:hover, :focus) path) {
			/* @apply fill-primary; */
			@apply fill-[var(--color-primary)];
		}
		:global(.options) {
			/* @apply bg-base-100!; */
			@apply p-2! bg-[var(--color-base-100)]!;

			:global(li) {
				@apply px-4! py-2! rounded-lg!;
			}
		}
	}
	:global(.multiselect:focus-within) {
		/* Add gray outline */
		outline: 2px solid oklcha(var(--bc) / 0.2);
		outline-offset: 2px;
		/* Add blue outline */
		--tw-ring-inset: var(--tw-empty, /*/ /*/);
		--tw-ring-offset-width: 0px;
		--tw-ring-offset-color: #fff;
		--tw-ring-color: #1c64f2;
		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
			var(--tw-ring-offset-width) var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0
			calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
		box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
			var(--tw-shadow);
		border-color: #1c64f2 !important;
	}
</style>
