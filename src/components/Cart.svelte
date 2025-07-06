<script lang="ts">
	import Fa from "svelte-fa"
	import { faCartShopping, faXmark } from "@fortawesome/free-solid-svg-icons"
</script>

<div class="dropdown dropdown-hover dropdown-end">
	<div tabindex="0" role="button" class="btn btn-square btn-ghost">
		<Fa icon={faCartShopping} size="lg" />
	</div>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->	
	<ul
		tabindex="0"
		class="list bg-base-100 rounded-box shadow-md dropdown-content w-96 mt-0!"
	>
		<li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Winkelmanje</li>

		<li class="list-row">
			<div>
				<img
					alt="temp"
					class="size-10 rounded-box"
					src="https://img.daisyui.com/images/profile/demo/1@94.webp"
				/>
			</div>
			<div>
				<div>Dio Lupa</div>
			</div>
			<button class="btn btn-square btn-ghost" aria-label="Remove item">
				<Fa icon={faXmark} class="" />
			</button>
		</li>

		<li class="list-row">
			<div>
				<img
					alt="temp"
					class="size-10 rounded-box"
					src="https://img.daisyui.com/images/profile/demo/4@94.webp"
				/>
			</div>
			<div>
				<div>Ellie Beilish</div>
			</div>
			<button class="btn btn-square btn-ghost" aria-label="Remove item">
				<Fa icon={faXmark} class="" />
			</button>
		</li>

		<li class="list-row">
			<div>
				<img
					alt="temp"
					class="size-10 rounded-box"
					src="https://img.daisyui.com/images/profile/demo/3@94.webp"
				/>
			</div>
			<div>
				<div>Sabrino Gardener</div>
			</div>
			<button class="btn btn-square btn-ghost" aria-label="Remove item">
				<Fa icon={faXmark} class="" />
			</button>
		</li>

		<div class="p-4 pb-2 flex flex-row justify-between interaction">
			<div>Subtotaal: </div>
			<div>15.00€</div>
		</div>

		
		<li class="p-4 pb-2 flex flex-row justify-between">
			<a class="btn" href="/todo">Bekijken</a>
			<a class="btn btn-primary" href="/todo">Afrekenen</a>
		</li>
	</ul>
</div>
