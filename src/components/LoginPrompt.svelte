<script lang="ts">
	import {
		loginModalOpenStore,
		loginModalStateStore,
	} from "$lib/stores/LoginmodalStore"
	import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	let showLoginPrompt = true

	function openLoginModal() {
		$loginModalStateStore = "Login"
		$loginModalOpenStore = true
	}
	function openSingupModal() {
		$loginModalStateStore = "Register"
		$loginModalOpenStore = true
	}
</script>

{#if showLoginPrompt}
	<div class="p-4 bg-base-200 rounded-xl mb-2 relative">
		<button
			type="button"
			class="btn btn-sm btn-square btn-ghost absolute right-3 top-3"
			on:click={() => (showLoginPrompt = false)}
		>
			<Fa icon={faXmark} />
		</button>

		<div class="flex flex-col gap-3 items-center text-center">
			<div
				class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
			>
				<Fa icon={faUser} class="text-primary" size="lg" />
			</div>
			<div class="flex flex-col gap-2">
				<h3 class="font-semibold text-lg">Sla je factuurgegevens op</h3>
				<p class="text-sm text-base-content/70 max-w-md">
					Ingelogde gebruikers kunnen factuurgegevens opslaan voor later gebruik
					en sneller afrekenen.
				</p>
			</div>
			<button
				class="btn btn-primary btn-wide gap-2"
				type="button"
				on:click={openLoginModal}
			>
				<Fa icon={faUser} size="sm" />
				Aanmelden
			</button>
			<button type="button" class="link text-sm" on:click={openSingupModal}>
				Nog geen account? Registreer hier
			</button>
		</div>
	</div>
{/if}
