<script lang="ts">
	import { faCompass, faMap, faRoute } from "@fortawesome/free-solid-svg-icons"
	import { onMount } from "svelte"
	import Fa from "svelte-fa"

	let MapComponent: undefined | typeof import("sveaflet")

	onMount(async () => {
		const module = await import("sveaflet")
		MapComponent = module
	})

	const zoom = 16
	const lattitude = 51.054007
	const longitude = 3.726917

	const height = 618

	const locationText = "TRBL Sound and Light"
</script>

{#if MapComponent}
	<div class="relative" style="width: 100%;height: {618}px;">
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
				<MapComponent.DivIcon>
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
				<p class="text-sm opacity-50">Nederpolder 4, 9000 Gent, Belgium</p>
				<div class="text-sm mt-1">
					4.9 <span class="text-yellow-500">★★★★★</span>
					<a
						class="link link-hover text-info"
						href="https://search.google.com/local/reviews?placeid=ChIJzzDeZh5xw0cR09QlC3mIQv0&q=TRBL+Sound+and+Light&hl=en&gl=BE"
						target="_blank">(11 reviews)</a
					>
				</div>
				<div class="flex gap-4 mt-2">
					<a
						href="https://maps.google.com/maps?ll=51.053988,3.727125&z=16&t=m&hl=en-GB&gl=US&mapclient=embed&cid=18249298693518120147"
						target="_blank"
						class="text-sm link link-hover text-info flex gap-1 items-center"
					>
						<Fa icon={faMap} /> Grotere kaart
					</a>
					<a
						href="https://www.google.com/maps/dir//TRBL+Sound+and+Light+Nederpolder+4+9000+Gent+Belgium/@51.0539884,3.7271249,16z/data=!4m5!4m4!1m0!1m2!1m1!1s0x47c3711e66de30cf:0xfd4288790b25d4d3"
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
	:global(.leaflet-div-icon) {
		background: transparent !important;
		border: none !important;
	}
</style>
