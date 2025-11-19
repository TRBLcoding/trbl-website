<script lang="ts">
	import { page } from "$app/stores"
	import { resolve } from "$app/paths"
</script>

<div id="error" class="h-full flex items-center mt-8 md:mt-20">
	<div class="error text-center mx-auto">
		<div class="error-status relative h-60">
			<h3 class="uppercase tracking-[3px] pl-1.5 font-bold">
				{$page.error?.message}
				{$page.error?.message.toLowerCase().includes("error") ? "" : "Error"}
			</h3>
			<h1
				class="select-none -z-10 text-[#262626] -translate-1/2 -ml-5 tracking-[-0.15em] absolute left-1/2 top-1/2 font-['Montserrat',sans-serif] uppercase font-black text-[252px]"
			>
				{#each $page.status.toString().split("") as letter (letter)}
					<span class="[text-shadow:-8px_0px_0px_#5c5c5c]">{letter}</span>
				{/each}
			</h1>
		</div>
		<h2 class="text-xl mb-6">De gevraagde pagina bevatte een probleem</h2>

		{#if $page.status === 404}
			<a href={resolve("/")} class="btn btn-primary normal-case">
				Terug naar de homepagina
			</a>
		{:else}
			<p class="text-xl text-primary">Probeer het later opnieuw</p>
		{/if}
	</div>
</div>

<!-- This templates was made by Colorlib (https://colorlib.com) -->
<!-- Source: https://colorlib.com/wp/free-404-error-page-templates/ -->
<style lang="postcss">
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
