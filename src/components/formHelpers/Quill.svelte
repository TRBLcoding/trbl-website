<script lang="ts">
	import InfoCircle from "$components/icons/Flowbite/InfoCircle.svelte"
	import type Quill from "quill"
	import "quill/dist/quill.snow.css"
	import { onMount } from "svelte"

	export let label: string
	export let value: string
	export let required = false
	export let disabled = false
	export let size: "full" | "md" | "sm" | "xs" = "full"

	let editorContainer: HTMLDivElement
	let toolbarContainer: HTMLDivElement
	let quill: Quill

	onMount(async () => {
		const Quill = (await import("quill")).default
		quill = new Quill(editorContainer, {
			modules: {
				toolbar: toolbarContainer,
			},
			theme: "snow",
		})
		quill.enable(!disabled)
		quill.on("text-change", () => {
			value = quill.root.innerHTML
		})
	})

	$: if (quill) quill.enable(!disabled)
</script>

<div
	class="form-control w-full h-full flex flex-col"
	class:max-w-md={size === "md"}
	class:max-w-sm={size === "sm"}
	class:max-w-xs={size === "xs"}
>
	<div class="flex justify-between gap-2">
		<div class="label">
			<span class="label-text">
				{label}
				{#if required}
					<span class="text-red-500 font-bold">*</span>
				{/if}
			</span>
		</div>
		<div class="tooltip tooltip-left z-20" data-tip="Quill.js WYSIWYG editor">
			<button type="button" class="btn btn-ghost btn-xs btn-circle">
				<InfoCircle />
			</button>
		</div>
	</div>

	<div class:-z-10={disabled} class="flex-1 flex flex-col">
		<!-- Toolbar -->
		<div
			bind:this={toolbarContainer}
			class="rounded-t-lg border-2! border-[#d1d1d1]! dark:border-[#464e57]! z-10 bg-base-200"
		>
			<span class="ql-formats">
				<button title="Bold" type="button" class="ql-bold btn btn-ghost"
				></button>
				<button title="Italic" type="button" class="ql-italic btn btn-ghost"
				></button>
				<button
					title="Underline"
					type="button"
					class="ql-underline btn btn-ghost"
				></button>
				<button
					title="Strikethrough"
					type="button"
					class="ql-strike btn btn-ghost"
				></button>
			</span>
			<span class="ql-formats">
				<select id="ql-color-select" title="Text color" class="ql-color"
				></select>
				<select id="ql-bg-select" title="Background color" class="ql-background"
				></select>
			</span>
			<span class="ql-formats">
				<button
					title="Subscript"
					type="button"
					class="ql-script btn btn-ghost"
					value="sub"
				></button>
				<button
					title="Superscript"
					type="button"
					class="ql-script btn btn-ghost"
					value="super"
				></button>
			</span>
			<span class="ql-formats">
				<button
					title="Header 1"
					type="button"
					class="ql-header btn btn-ghost"
					value="1"
				></button>
				<button
					title="Header 2"
					type="button"
					class="ql-header btn btn-ghost"
					value="2"
				></button>
				<button
					title="Header 3"
					type="button"
					class="ql-header btn btn-ghost"
					value="3"
				></button>
				<button
					title="Blockquote"
					type="button"
					class="ql-blockquote btn btn-ghost"
				></button>
				<button
					title="Code block"
					type="button"
					class="ql-code-block btn btn-ghost"
				></button>
			</span>
			<span class="ql-formats">
				<button
					title="Ordered list"
					type="button"
					class="ql-list btn btn-ghost"
					value="ordered"
				></button>
				<button
					title="Unordered list"
					type="button"
					class="ql-list btn btn-ghost"
					value="bullet"
				></button>
				<button
					title="Unindent"
					type="button"
					class="ql-indent btn btn-ghost"
					value="-1"
				></button>
				<button
					title="Indent"
					type="button"
					class="ql-indent btn btn-ghost"
					value="+1"
				></button>
			</span>
			<span class="ql-formats">
				<select id="ql-align-select" title="Align" class="ql-align btn-ghost"></select>
			</span>
			<span class="ql-formats">
				<button title="Make link" type="button" class="ql-link btn btn-ghost"
				></button>
				<!-- Formula module requires KaTeX -->
				<!-- <button
					title="Enter formula"
					type="button"
					class="ql-formula btn btn-ghost"
				></button> -->
			</span>
			<span class="ql-formats">
				<button title="Unformat" type="button" class="ql-clean btn btn-ghost"
				></button>
			</span>
		</div>

		<!-- Editor -->
		<div
			bind:this={editorContainer}
			class="flex-1 rounded-b-lg border-t-0! border-2! border-[#d1d1d1]! dark:border-[#464e57]!"
		>
			<!--  eslint-disable-next-line svelte/no-at-html-tags -->
			{@html value}
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	:global(.ql-picker-options, .ql-tooltip) {
		@apply bg-(--color-base-200)! border-2! border-[#d1d1d1]! dark:border-[#464e57]! rounded-lg;
	}

	:global(.ql-tooltip::before) {
		@apply text-(--color-base-content)!;
	}

	:global(.ql-tooltip input) {
		@apply text-(--color-base-content)! border-2! border-[#d1d1d1]! dark:border-[#464e57]! rounded-lg;
	}

	:global(a.ql-action::after) {
		@apply text-(--color-primary)!;
	}

	:global(.ql-stroke) {
		@apply stroke-(--color-base-content)!;
	}
	:global(.ql-fill) {
		@apply fill-(--color-base-content)!;
	}

	:global(
			button:hover .ql-stroke,
			button:focus .ql-stroke,
			.ql-picker-label:hover .ql-stroke,
			.ql-picker-label:focus .ql-stroke,
			.ql-picker-item:hover .ql-stroke,
			.ql-picker-item:focus .ql-stroke,
			.ql-active .ql-stroke
		) {
		@apply stroke-(--color-primary)!;
	}
	:global(
			button:hover .ql-fill,
			button:focus .ql-fill,
			.ql-picker-label:hover .ql-fill,
			.ql-picker-label:focus .ql-fill,
			.ql-picker-item:hover .ql-fill,
			.ql-picker-item:focus .ql-fill,
			button.ql-active .ql-fill
		) {
		@apply fill-(--color-primary)!;
	}
</style>
