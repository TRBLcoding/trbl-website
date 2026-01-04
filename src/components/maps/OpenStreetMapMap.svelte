<script lang="ts">
	import { faMap, faRoute } from "@fortawesome/free-solid-svg-icons"
	import { onMount } from "svelte"
	import Fa from "svelte-fa"

	export let height = 500
	export let zoom = 16

	let MapComponent: undefined | typeof import("sveaflet")

	onMount(async () => {
		const module = await import("sveaflet")
		MapComponent = module
	})

	const lattitude = 51.053988
	const longitude = 3.727125
	const locationText = "TRBL Sound and Light"
	const locationAddress = "Nederpolder 4, 9000 Gent, Belgium"

	const searchURL =
		"https://www.google.com/search?q=TRBL+Sound+and+Light,+Nederpolder+4,+9000+Gent"
	const mapURL =
		"https://www.google.com/maps/place/TRBL+Sound+and+Light/@51.0539917,3.7245446,706m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47c3711e66de30cf:0xfd4288790b25d4d3!8m2!3d51.0539884!4d3.7271249!16s%2Fg%2F11tmjnp167"
	const directionURL =
		"https://www.google.com/maps/dir//TRBL+Sound+and+Light,+Nederpolder+4,+9000+Gent/@51.053988,3.727125,1411m"

	const amountOfReviews = 11
	const averageRating = 4.9
</script>

{#if MapComponent}
	<div class="relative" style="width: 100%;height: {height}px;">
		<MapComponent.Map
			options={{ center: [lattitude, longitude], zoom, zoomControl: false }}
		>
			<MapComponent.ControlLayers options={{ position: "bottomleft" }}>
				<MapComponent.TileLayer
					url={"https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
					checked={true}
					layerType="base"
					name="OpenStreetMap"
					options={{
						attribution: /*html*/ `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
					}}
				/>
				<MapComponent.TileLayer
					url={"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"}
					checked={false}
					layerType="base"
					name="Satellite"
					options={{
						attribution: /*html*/ `&copy; <a href="https://www.esri.com/en-us/home">Esri</a>`,
					}}
				/>
			</MapComponent.ControlLayers>

			<MapComponent.Marker latLng={[lattitude, longitude]}>
				<MapComponent.Icon
					options={{
						iconUrl: "/marker.png",
					}}
				/>
			</MapComponent.Marker>
			<MapComponent.Marker latLng={[lattitude, longitude]}>
				<MapComponent.DivIcon >
					<div
						class="text-md text-[1.2em] w-50 ml-6 -mt-7 text-red-600 font-medium text-shadow-2xs"
					>
						{locationText}
					</div>
				</MapComponent.DivIcon>
			</MapComponent.Marker>
			<MapComponent.ControlZoom options={{ position: "topright" }} />
		</MapComponent.Map>
		<div
			class="absolute top-3 left-3 bg-base-100 p-3 rounded-lg shadow-lg z-999 max-w-xs flex gap-4"
		>
			<div>
				<h3 class="text-lg font-semibold">{locationText}</h3>
				<p class="text-sm opacity-50">{locationAddress}</p>
				<div class="text-sm mt-1">
					{averageRating}
					<span class="text-yellow-500"
						>{"★".repeat(Math.round(averageRating))}</span
					>

					<a class="link link-hover text-info" href={searchURL} target="_blank"
						>({amountOfReviews} reviews)</a
					>
				</div>
				<div class="flex gap-4 mt-2">
					<a
						href={mapURL}
						target="_blank"
						class="text-sm link link-hover text-info flex gap-1 items-center"
					>
						<Fa icon={faMap} /> Grotere kaart
					</a>
					<a
						href={directionURL}
						target="_blank"
						class="text-sm link link-hover text-info flex gap-1 items-center"
					>
						<Fa icon={faRoute} /> Routebeschrijving
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";

	:global(.leaflet-div-icon) {
		@apply bg-transparent! border-none!;
	}

	:global(.leaflet-control, .leaflet-control-zoom a) {
		@apply dark:border-gray-500! bg-(--color-base-100)! text-(--text-base-100)!;
	}

	:global(.leaflet-tile-pane) {
		@apply dark:invert dark:hue-rotate-180 dark:brightness-95 dark:contrast-90;
	}

	:global(.leaflet-container) {
		@apply dark:bg-neutral-800!;
	}
</style>
