<script lang="ts">
	export let src: string
	export let alt: string
	export let imgClass: string = ""
	export let skeletonClass: string = ""

	let loaded = false
	let imgElement: HTMLImageElement

	// Check if image is already loaded (cached)
	$: if (imgElement?.complete) loaded = true
</script>

<div class={skeletonClass} class:skeleton={!loaded}>
	<img
		bind:this={imgElement}
		{src}
		{alt}
		class={imgClass}
		class:opacity-0={!loaded}
		on:load={() => (loaded = true)}
	/>
</div>
