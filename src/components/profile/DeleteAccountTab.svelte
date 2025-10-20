<script lang="ts">
	import { authStore } from "$lib/stores/AuthStore"
	import {
		faCheckCircle,
		faCross,
		faTrashCan,
		faXmark,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	let confirmDeleteModal: HTMLDialogElement

	let loading = false
	let error = ""
	let succes = false
	async function deleteProfile() {
		loading = true
		succes = false
		try {
			await authStore.deleteProfile()
			succes = true
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error updating profile:", error)
				error = error.message
			} else {
				console.error("Unknown error updating profile")
				error = "Unknown error updating profile"
			}
		}
		loading = false
	}
</script>

<!-- Delete account -->
<label class="tab [--tab-bg:var(--color-base-200)]">
	<input type="radio" name="profile-tabs" checked={true} />
	<Fa icon={faTrashCan} class="me-2" />
	Account verwijderen
</label>
<div class="tab-content bg-base-200 border-base-300 p-6">
	<div class="flex flex-col gap-4">
		<h2 class="text-xl font-semibold text-error">Account verwijderen</h2>
		<p class="opacity-90">
			Door je account te verwijderen, worden al je gegevens permanent
			verwijderd. Deze actie kan niet ongedaan worden gemaakt.
		</p>
		<div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
			<button
				type="button"
				class="btn btn-primary sm:self-start mt-2"
				on:click={() => confirmDeleteModal.showModal()}
				disabled={loading}
			>
				Account permanent verwijderen
				<span class="loading loading-ring" class:hidden={!loading}></span>
			</button>
			{#if succes && !error}
				<div class="text-success flex gap-2 items-center mt-2">
					<Fa icon={faCheckCircle} />
					<span>Account verwijderd</span>
				</div>
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
