<script lang="ts">
	import { page } from "$app/stores"
</script>

<div id="error" class="h-full flex items-center mt-8 md:mt-20">
	<div class="error mx-auto">
		<div class="error-status">
			<h3 class="uppercase tracking-[3px] pl-1.5 font-bold">{$page.error?.message} Error</h3>
			<h1 class="unselectable absolute left-1/2 top-1/2 font-['Montserrat',sans-serif] uppercase font-black text-[252px]">
				{#each $page.status.toString().split("") as letter}
					<span>{letter}</span>
				{/each}
			</h1>
		</div>
		<h2 class="text-xl mb-6">De gevraagde pagina bevatte een probleem</h2>

		{#if $page.status === 404}
			<a href="/" class="btn btn-primary normal-case"
				>Terug naar de homepagina</a
			>
		{:else}
			<p style="color: #ff9800; font-size: 1.3em">Probeer het later opnieuw</p>
		{/if}
	</div>
</div>

<!-- This templates was made by Colorlib (https://colorlib.com) -->
<!-- Source: https://colorlib.com/wp/free-404-error-page-templates/ -->
<style lang="postcss">
	.unselectable {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		z-index: -1;
	}

	.error {
		max-width: 520px;
		width: 100%;
		line-height: 1.4;
		text-align: center;
	}

	.error .error-status {
		position: relative;
		height: 240px;
	}

	.error .error-status h1 {
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		color: #262626;
		letter-spacing: -0.15em;
		margin-left: -20px;
	}

	.error .error-status h1 > span {
		text-shadow: -8px 0px 0px #5c5c5c;
	}

	@media only screen and (max-width: 767px) {
		.error .error-status {
			height: 200px;
		}
		.error .error-status h1 {
			font-size: 200px;
		}
	}

	@media only screen and (max-width: 480px) {
		.error .error-status {
			height: 162px;
		}
		.error .error-status h1 {
			font-size: 162px;
			height: 150px;
			line-height: 162px;
		}
		.error h2 {
			font-size: 16px;
		}
	}
</style>
