<script lang="ts">
	import { authStore } from "$lib/stores/AuthStore"
	import {
		faCheckCircle,
		faCross,
		faTrashCan,
		faXmark,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import type { TabType } from "./TabType"

	export let checked: boolean = false
	export let setTab: (tab: TabType) => void
	export let deletedProfile: boolean = false

	let confirmDeleteModal: HTMLDialogElement
	let deletedModal: HTMLDialogElement

	let loading = false
	let errorMessage = ""
	async function deleteProfile() {
		loading = true
		try {
			await authStore.deleteProfile()
			deletedProfile = true
			deletedModal.showModal()
			await authStore.signOut()
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error updating profile:", error)
				errorMessage = error.message
			} else {
				console.error(error)
				errorMessage = "Unknown error updating profile"
			}
		}
		loading = false
	}
</script>

<!-- Delete account -->
<label class="tab [--tab-bg:var(--color-base-200)]">
	<input
		type="radio"
		name="profile-tabs"
		{checked}
		on:change={() => setTab("delete")}
	/>
	<Fa icon={faTrashCan} class="me-2" />
	Account verwijderen
</label>
<div class="tab-content bg-base-200 border-base-300 p-6">
	<div class="flex flex-col gap-6">
		<h2 class="text-xl font-semibold text-error">Account verwijderen</h2>
		<p class="opacity-90">
			Door je account te verwijderen, worden al je gegevens permanent
			verwijderd. Deze actie wordt onmiddellijk uitgevoerd en kan niet ongedaan worden gemaakt.
		</p>
		<div class="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
			<button
				type="button"
				class="btn btn-primary sm:self-start mt-2"
				on:click={() => confirmDeleteModal.showModal()}
				disabled={loading}
			>
				Account permanent verwijderen
				<span class="loading loading-ring" class:hidden={!loading}></span>
			</button>
			{#if errorMessage}
				<div class="text-error">{errorMessage}</div>
			{/if}
		</div>
	</div>
</div>

<dialog bind:this={confirmDeleteModal} id="confirmDeleteModal" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
				<Fa icon={faXmark} class="" />
			</button>
		</form>
		<h3 class="text-lg font-bold text-error">Bevestig verwijderen</h3>
		<p class="py-4">
			Bent u zeker dat u uw account wil verwijderen? Dit kan niet ongedaan
			gemaakt worden.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Anuleren</button>
				<button class="btn btn-primary" on:click={deleteProfile}
					>Verwijderen</button
				>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<dialog bind:this={deletedModal} id="deletedModald" class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold text-success flex items-center gap-2">
			<Fa icon={faCheckCircle} />
			Account verwijderd
		</h3>
		<p class="opacity-80 mt-4">
			Je account en bijbehorende gegevens zijn succesvol verwijderd. We vinden
			het jammer je te zien vertrekken. Bedankt voor het vertrouwen in onze
			service.
		</p>

		<div class="modal-action">
			<a href="/" class="btn btn-primary">Terug naar homepagina</a>
		</div>
	</div>
</dialog>
