<script lang="ts">
	export let selectImage: (i: number) => void
	export let counter: number
	export let images
	export let carouselWidth

	// -- Responsive thumbnail display --
	let maxThumbnails = 0

	// Responsive thumbnail widths: smaller on mobile, larger on desktop
	const getThumbnailWidth = (carouselWidth: number) => {
		if (carouselWidth < 640) return 80 // w-20 = 5rem = 80px for mobile
		return 128 // w-32 = 8rem = 128px for desktop
	}

	const gap = 8 // gap-2 = 0.5rem = 8px

	$: {
		if (carouselWidth > 0) {
			const availableWidth = carouselWidth
			const thumbnailWidth = getThumbnailWidth(carouselWidth)
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

<div class="flex gap-2 mt-2">
	{#each visibleThumbnails as image, i}
		<button
			class="flex-1 max-w-30 sm:max-w-40 rounded-sm h-20 sm:h-25 md:h-30 overflow-hidden cursor-pointer shadow-lg relative transition-all hover:ring-3 hover:ring-gray-400"
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
			class="flex-shrink-0 w-20 sm:w-32 rounded-sm h-20 sm:h-25 md:h-30 overflow-hidden shadow-lg relative bg-gray-400 dark:bg-gray-700 flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100 transition-all duration-200"
			on:click={() => selectImage(maxThumbnails)}
		>
			<span class="text-white font-bold text-sm sm:text-lg">+{overflowCount}</span>
		</button>
	{/if}
</div>
