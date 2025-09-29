<script lang="ts">
	//   import { preferencesStore } from "$lib/stores/LocalStorageStores"
	import { clamp } from "$lib/utils/Utils"
	import {
		faChevronLeft,
		faChevronRight,
	} from "@fortawesome/free-solid-svg-icons"
	import { onMount } from "svelte"
	import Fa from "svelte-fa"

	export let images: { imageUrl: string; alt?: string; thumbnailUrl?: string }[]
	export let height = ""
	export let hideButtons = false
	export let hideIndicators = false
	export let fillWidth = false
	export let duration = 10000
	export let background = false
	export let thumbnails = false

	// -- Counter --
	export let counter = 0
	$: counter = clamp(counter, 0, images.length - 1)
	function next() {
		counter = (counter + 1) % images.length
	}
	function previous() {
		counter = (counter - 1 + images.length) % images.length
	}

	// -- Looping --
	let loopTimeout: number
	let mounted = false

	onMount(() => (mounted = true))

	function setLoop() {
		clearTimeout(loopTimeout)
		loopTimeout = window.setTimeout(() => {
			next()
			setLoop()
		}, duration)
	}
	//   $: if (mounted && loop && $preferencesStore.autoPlay) setLoop()
	//   else clearTimeout(loopTimeout)

	function selectImage(i: number) {
		counter = i
	}

	// -- Responsive thumbnail display --
	let maxThumbnails = 0
	let carouselWidth = 0
	const thumbnailWidth = 128 // w-32 = 8rem = 128px
	const gap = 8 // gap-2 = 0.5rem = 8px

	$: {
		if (carouselWidth > 0) {
			const availableWidth = carouselWidth
			const widthPerThumbnail = thumbnailWidth + gap
			const maxPossibleThumbnails = Math.floor(
				availableWidth / widthPerThumbnail
			)

			// Reserve space for overflow thumbnail if needed
			const maxThumbnailsWithOverflow =
				images.length > maxPossibleThumbnails
					? maxPossibleThumbnails - 1
					: maxPossibleThumbnails
			maxThumbnails = Math.max(1, maxThumbnailsWithOverflow)
		} else {
			maxThumbnails = 3 // fallback
		}
	}

	$: visibleThumbnails = images.slice(0, maxThumbnails)
	$: overflowCount = Math.max(0, images.length - maxThumbnails)
	$: hasOverflow = images.length > maxThumbnails
</script>

<!-- Adapted from https://flowbite.com/docs/components/carousel/ -->
<!-- Carousel container -->
<div
	bind:clientWidth={carouselWidth}
	class={`relative h-72 sm:h-96 w-full overflow-hidden rounded-lg ${height}`}
	class:bg-base-200={background}
>
	<!-- Carousel images -->
	{#each images as item, i}
		<img
			src={item.imageUrl}
			class:opacity-0={counter !== i}
			class={`rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ease-in-out transition-opacity duration-700 ${
				fillWidth ? "" : "h-full object-contain"
			}`}
			alt={item.alt}
		/>
	{/each}
	<!-- Slide indicators -->
	{#if images.length > 1 && !hideIndicators}
		<div class="absolute flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
			{#each images as _, i}
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button
					type="button"
					class="w-3 h-3 rounded-full cursor-pointer"
					class:bg-slate-200={counter === i}
					class:bg-slate-500={counter !== i}
					on:click={() => (counter = i)}
				></button>
			{/each}
		</div>
	{/if}
	<!-- Slide buttons -->
	{#if images.length > 1 && !hideButtons}
		<button
			type="button"
			class="absolute top-0 left-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
			on:click={previous}
		>
			<span
				class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-400/30 dark:bg-gray-800/30 group-hover:bg-slate-500/50 dark:group-hover:bg-gray-800/60 group-focus:bg-slate-500/50 dark:group-focus:bg-slate-500/50"
			>
				<Fa
					icon={faChevronLeft}
					class="text-white dark:text-slate-500 text-xl"
				/>
				<span class="sr-only">Volgende</span>
			</span>
		</button>
		<button
			type="button"
			class="absolute top-0 right-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
			on:click={next}
		>
			<span
				class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-400/30 dark:bg-gray-800/30 group-hover:bg-slate-500/50 dark:group-hover:bg-gray-800/60 group-focus:bg-slate-500/50 dark:group-focus:bg-slate-500/50"
			>
				<Fa
					icon={faChevronRight}
					class="text-white dark:text-slate-500 text-xl"
				/>
				<span class="sr-only">Vorige</span>
			</span>
		</button>
	{/if}
</div>

{#if thumbnails}
	<div class="flex gap-2 mt-2">
		{#each visibleThumbnails as image, i}
			<button
				class="flex-1 max-w-40 rounded-sm h-30 overflow-hidden cursor-pointer shadow-lg relative transition-all hover:ring-3 hover:ring-gray-400"
				on:click={() => selectImage(i)}
				class:ring-3={counter === i}
				class:ring-primary!={counter === i}
				class:opacity-100={counter === i}
				class:opacity-90={counter !== i}
			>
				<img
					class="w-full h-full object-cover object-center"
					alt={image.alt}
					src={image.thumbnailUrl}
				/>
			</button>
		{/each}

		{#if hasOverflow}
			<button
				class="flex-shrink-0 w-32 rounded-sm h-30 overflow-hidden shadow-lg relative bg-gray-400 dark:bg-gray-700 flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100 transition-all duration-200"
				on:click={() => selectImage(maxThumbnails)}
			>
				<span class="text-white font-bold text-lg">+{overflowCount}</span>
			</button>
		{/if}
	</div>
{/if}
