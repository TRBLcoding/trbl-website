<script lang="ts">
	import Fa from "svelte-fa"
	import "../app.css"

	import { faDiscord, faFacebookSquare, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons"
	import { faEnvelope } from "@fortawesome/free-regular-svg-icons"

	let { children } = $props()
</script>

<div class="m">
	<!-- Socials -->
	<div class="flex flex-row gap-2">
		<a href="https://www.facebook.com/trblsoundandlight" target="_blank">
			<Fa icon={faFacebookSquare} />
		</a>
		<a href="https://www.instagram.com/trbl_snl/" target="_blank">
			<Fa icon={faInstagram} />
		</a>
		<a href="https://www.youtube.com/channel/UCKdrfhbUobqx98V_ViPOHDg" target="_blank">
			<Fa icon={faYoutube} />
		</a>
		<a href="mailto:info@trbl.be" target="_blank">
			<Fa icon={faEnvelope} />
		</a>
		<a href="https://www.discordapp.com/users/_Teunvdv_#5637" target="_blank">
			<Fa icon={faDiscord} />
		</a>
	</div>
</div>
{@render children()}
