<script lang="ts">
	import Input from "$components/formHelpers/Input.svelte"
	import type { User } from "$lib/domain/User"
	import { authStore } from "$lib/stores/AuthStore"
	import {
		faCheckCircle,
		faExclamationTriangle,
		faUser,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import type { TabType } from "./TabType"

	export let checked: boolean = false
	export let setTab: (tab: TabType) => void

	let newFirstName = ""
	let newLastName = ""

	let initialized = false
	function initPage(user: User) {
		newFirstName = user.firstName
		newLastName = user.lastName
		initialized = true
	}
	$: if (!initialized && $authStore) initPage($authStore)

	let loading = false
	let error = ""
	let succes = false
	async function updateProfile() {
		loading = true
		succes = false
		try {
			await authStore.updateProfile(newFirstName, newLastName)
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

<!-- Personal details -->
<label class="tab [--tab-bg:var(--color-base-200)]">
	<input
		type="radio"
		name="profile-tabs"
		{checked}
		on:change={() => setTab("personal")}
	/>
	<Fa icon={faUser} class="me-2" />
	Persoonlijke gegevens
</label>
<div class="tab-content bg-base-200 border-base-300 p-6">
	<div class="flex gap-2 items-baseline mb-4">
		<h2 class="text-xl font-semibold">Persoonlijke gegevens</h2>
		{#if $authStore?.isAdmin()}
			<div class="badge badge-primary text-base-100 font-semibold">Admin</div>
		{/if}
	</div>

	<form class="flex flex-col gap-4" on:submit|preventDefault={updateProfile}>
		<div class="flex flex-col sm:flex-row gap-2">
			{#if initialized}
				<Input
					type="text"
					label="Voornaam"
					placeholder="Voornaam"
					bind:value={newFirstName}
					size="full"
					required
					autocomplete="given-name"
				/>
				<Input
					type="text"
					label="Achternaam"
					placeholder="Achternaam"
					bind:value={newLastName}
					size="full"
					required
					autocomplete="family-name"
				/>
			{:else}
				<div class="w-full">
					<div class="skeleton h-4 w-21 mt-1 mb-1"></div>
					<div class="skeleton h-10 w-full"></div>
				</div>
				<div class="w-full">
					<div class="skeleton h-4 w-24 mt-1 mb-1"></div>
					<div class="skeleton h-10 w-full"></div>
				</div>
			{/if}
		</div>
		<div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
			<button
				type="submit"
				class="btn btn-primary sm:self-start mt-2"
				disabled={loading}
			>
				Gegevens wijzigen
				<span class="loading loading-ring" class:hidden={!loading}></span>
			</button>
			{#if succes && !error}
				<div class="text-success flex gap-2 items-center mt-2">
					<Fa icon={faCheckCircle} />
					<span>Gegevens succesvol bijgewerkt</span>
				</div>
			{/if}
		</div>
		{#if error}
			<div class="text-error flex gap-2 items-center mt-2">
				<Fa icon={faExclamationTriangle} />
				{error}
			</div>
		{/if}
	</form>
</div>
