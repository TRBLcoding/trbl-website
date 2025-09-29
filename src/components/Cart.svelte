<script lang="ts">
	import Fa from "svelte-fa"
	import { faCartShopping, faXmark } from "@fortawesome/free-solid-svg-icons"

	let items = [...Array(3)]

	function removeItem(index: number) {
		console.log(items)
		items.forEach((_, i) => console.log(i))
		items = items.filter((_, i) => i != index)
	}
</script>

<div class="dropdown dropdown-hover dropdown-end">
	<div
		tabindex="0"
		role="button"
		class="btn btn-square btn-ghost relative"
		title="Winkelmandje"
	>
		<Fa icon={faCartShopping} class="text-xl" />
		<div
			title={`1 nieuwe clubrecords`}
			class="absolute -top-2 -end-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-primary border-2 border-base-100 rounded-full text-base-100"
		>
			11
		</div>
	</div>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<ul
		tabindex="0"
		class="list bg-base-100 rounded-box shadow-md dropdown-content w-96 mt-0!"
	>
		<li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Winkelmandje</li>

		{#each items as _, i}
			<li class="list-row">
				<div>
					<img
						alt="temp"
						class="size-10 rounded-box"
						src="https://img.daisyui.com/images/profile/demo/1@94.webp"
					/>
				</div>
				<div>
					<div>Dio Lupa {i}</div>
				</div>
				<button
					class="btn btn-square btn-ghost"
					aria-label="Remove item"
					on:click={() => removeItem(i)}
				>
					<Fa icon={faXmark} class="" />
				</button>
			</li>
		{/each}

		{#if items.length > 0}
			<div class="p-4 pb-2 flex flex-row justify-between interaction">
				<div>Subtotaal:</div>
				<div>{15.0}€</div>
			</div>

			<li class="p-4 pb-2 flex flex-row justify-between">
				<a class="btn" href="/todo">Bekijken</a>
				<a class="btn btn-primary" href="/todo">Afrekenen</a>
			</li>
		{:else}
			<div class="p-4 pb-2 flex flex-row justify-between interaction">
				<div>Geen items in winkelmand</div>
			</div>
		{/if}
	</ul>
</div>
