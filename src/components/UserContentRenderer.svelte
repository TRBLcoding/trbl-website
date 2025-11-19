<script lang="ts">
	import { linkifyText } from "$lib/utils/Utils"

	export let content: string
	export let placeHolder = "Geen inhoud"
	export let showLinks = false
	let classList = ""
	export { classList as class }
</script>

<div class={`usercontent ${classList}`}>
	{#if showLinks}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html linkifyText(content) || placeHolder}
	{:else}
		<!--  eslint-disable-next-line svelte/no-at-html-tags -->
		{@html content || placeHolder}
	{/if}
</div>

<style lang="postcss">
	@reference "../app.css";
	@reference "tailwindcss";

	:global(.ql-code-block-container) {
		@apply dark:bg-gray-800 bg-gray-300 rounded-lg p-3;
	}

	:global(.cl),
	:global(.usercontent) {
		:global(h1) {
			@apply text-2xl! font-semibold!;
		}
		:global(h2) {
			@apply text-xl! font-semibold!;
		}
		:global(blockquote) {
			@apply p-4! my-4! border-l-4! border-gray-500! bg-gray-300! dark:bg-gray-800!;
		}
		:global(ul) {
			@apply list-disc! list-inside!;
		}
		:global(ol) {
			@apply list-decimal! list-inside!;
		}
		:global(a) {
			@apply text-blue-600! visited:text-purple-600! underline!;
		}
	}
</style>
