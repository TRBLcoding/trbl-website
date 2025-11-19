<script lang="ts">
	import { version } from "$app/environment"
	import { resolve } from "$app/paths"

	let year = new Date().getFullYear()
</script>

<footer class="footer relative z-20 bg-black flex py-4">
	<div class="w-full flex justify-around">
		<div class="text-white text-xs">
			<span class="whitespace-nowrap">Copyright © {year} TRBL</span> |
			<span class="whitespace-nowrap">
				Teun Van de Voorde - Student Zelfstandige
			</span>
			|
			<span class="whitespace-nowrap">BE0791945315</span>
		</div>
		<div class="text-white text-xs">
			<span class="whitespace-nowrap">
				<a href={resolve("/tos")} class="link-hover">Algemene Voorwaarden</a
				></span
			>
			|
			<span class="whitespace-nowrap"
				><a href={resolve("/privacy-policy")} class="link-hover"
					>Privacyverklaring</a
				></span
			>
			|
			<a
				href="https://github.com/TRBLcoding/trbl-website/releases"
				target="_blank"
				class="link-hover">Versie: {version}</a
			>
		</div>
	</div>
</footer>
