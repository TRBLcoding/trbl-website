<script lang="ts">
	import Editor from "cl-editor/src/Editor.svelte"

	export let label: string
	export let value: string
	export let required = false
	export let disabled = false
	export let size: "full" | "md" | "sm" | "xs" = "full"
// TODO
	/**
	 * Toolbar actions
	 * - Empty array is all actions
	 * - Reference: https://github.com/nenadpnc/cl-editor/blob/50706f3fb0cc7ed25d9cd2bd2ed05619fd501842/src/helpers/actions.js#L16
	 */
	export let actions = [
		"viewHtml",
		"undo",
		"redo",
		"b",
		"i",
		"u",
		"strike",
		"sup",
		"sub",
		"h1",
		"h2",
		"p",
		"blockquote",
		"ol",
		"ul",
		"hr",
		"left",
		"right",
		"center",
		"justify",
		"a",
		//"image",
		"forecolor",
		"backcolor",
		"removeFormat",
	]
</script>

<div
	class="form-control w-full h-full flex flex-col"
	class:max-w-md={size === "md"}
	class:max-w-sm={size === "sm"}
	class:max-w-xs={size === "xs"}
>
	<label class="label" for="editor">
		<span class="label-text">
			{label}
			{#if required}
				<span class="text-red-500 font-bold">*</span>
			{/if}
		</span>
	</label>
	<div class:cursor-not-allowed={disabled} class="flex-1">
		<div class:pointer-events-none={disabled} class="h-full">
			<Editor
				html={value}
				on:change={(e: any) => (value = e.detail)}
				{actions}
				
			/>
		</div>
	</div>
</div>

<style lang="postcss">
	@import "../../css/cl-editor.postcss";

	:global(.cl-textarea) {
		@apply hidden! p-10;
	}
	:global(.cl, .cl-content) {
        @apply h-full! min-h-72;
    }
</style>
