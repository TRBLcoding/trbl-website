<script lang="ts">
	import Input from "$components/formHelpers/Input.svelte"
	import InfoCircle from "$components/icons/Flowbite/InfoCircle.svelte"
	import { authStore } from "$lib/stores/AuthStore"
	import {
		faCheckCircle,
		faExclamationTriangle,
		faShield,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import type { TabType } from "./TabType"

	export let checked: boolean = false
	export let setTab: (tab: TabType) => void

	let newPassword = ""
	let confirmPassword = ""
	let newEmail = ""

	let loadingEmailForm = false
	let errorEmailForm = ""
	let succesEmailForm = false
	async function updateEmail() {
		loadingEmailForm = true
		succesEmailForm = false
		try {
			await authStore.updateEmail(newEmail)
			succesEmailForm = true
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error updating profile:", error)
				errorEmailForm = error.message
			} else {
				console.error("Unknown error updating profile")
				errorEmailForm = "Unknown error updating profile"
			}
		}
		loadingEmailForm = false
	}

	function testPasswords() {
		if (newPassword !== confirmPassword)
			throw new Error("Wachtwoorden komen niet overeen")
	}

	let loadingPasswordForm = false
	let errorPasswordForm = ""
	let succesPasswordForm = false
	async function updatePassword() {
		loadingPasswordForm = true
		succesPasswordForm = false
		try {
			testPasswords()
			await authStore.updatePassword(newPassword)
			succesPasswordForm = true
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error updating profile:", error)
				errorPasswordForm = error.message
			} else {
				console.error("Unknown error updating profile")
				errorPasswordForm = "Unknown error updating profile"
			}
		}
		loadingPasswordForm = false
	}
</script>

<!-- Security -->
<label class="tab [--tab-bg:var(--color-base-200)]">
	<input
		type="radio"
		name="profile-tabs"
		{checked}
		on:change={() => setTab("security")}
	/>
	<Fa icon={faShield} class="me-2" />
	Beveiliging
</label>
<div class="tab-content bg-base-200 border-base-300 p-6">
	<h2 class="text-xl font-semibold mb-3">Beveiliging</h2>

	<!-- Change Email -->
	<div class="">
		<div class="flex items-start w-fit">
			<h3 class="text-lg font-semibold mb-2">
				E-mailadres wijziging aanvragen
			</h3>
			<div
				class="tooltip ml-auto tooltip-left sm:tooltip-bottom mt-[-6px]"
				data-tip={"Een verandering van mailadres vereist een bevestiging via zowel uw oude als nieuwe mailadres"}
			>
				<button class="btn btn-ghost btn-xs btn-circle">
					<InfoCircle class="" />
				</button>
			</div>
		</div>

		<form class="flex flex-col gap-4" on:submit|preventDefault={updateEmail}>
			<Input
				type="text"
				label="Huidig e-mailadres"
				value={$authStore?.email}
				size="full"
				disabled
			/>
			<Input
				type="text"
				label="Nieuw e-mailadres"
				placeholder="Nieuw e-mailadres"
				bind:value={newEmail}
				size="full"
				required
				autocomplete="email"
			/>
			<div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
				<button
					type="submit"
					class="btn btn-primary sm:self-start mt-2"
					disabled={loadingEmailForm}
				>
					E-mailadres wijzigen
					<span class="loading loading-ring" class:hidden={!loadingEmailForm}>
					</span>
				</button>
				{#if succesEmailForm && !errorEmailForm}
					<div class="text-success flex gap-2 items-center mt-2">
						<Fa icon={faCheckCircle} />
						<span>
							Email wijziging succesvol aangevraagd. Bevestig de verandering
							zowel op het oude als nieuwe e-mailadres
						</span>
					</div>
				{/if}
			</div>
			{#if errorEmailForm}
				<div class="text-error flex gap-2 items-center mt-2">
					<Fa icon={faExclamationTriangle} />
					{errorEmailForm}
				</div>
			{/if}
		</form>
	</div>

	<!-- Change Password -->
	<div class="mt-6">
		<div class="flex items-start w-fit">
			<h3 class="text-lg font-semibold mb-2">Wachtwoord wijzigen</h3>
			<div
				class="tooltip ml-auto tooltip-left sm:tooltip-bottom mt-[-6px]"
				data-tip={"Een verandering van wachtwoord word direct doorgevoerd"}
			>
				<button class="btn btn-ghost btn-xs btn-circle">
					<InfoCircle class="" />
				</button>
			</div>
		</div>

		<form class="flex flex-col gap-4" on:submit|preventDefault={updatePassword}>
			<Input
				type="password"
				label="Nieuw wachtwoord"
				placeholder="Nieuw wachtwoord"
				bind:value={newPassword}
				size="full"
				required
				autocomplete="new-password"
			/>
			<Input
				type="password"
				label="Bevestig nieuw wachtwoord"
				placeholder="Nieuw wachtwoord"
				bind:value={confirmPassword}
				size="full"
				required
				autocomplete="new-password"
			/>
			<div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
				<button
					type="submit"
					class="btn btn-primary sm:self-start mt-2"
					disabled={loadingPasswordForm}
				>
					Wachtwoord wijzigen
					<span class="loading loading-ring" class:hidden={!loadingPasswordForm}
					></span>
				</button>
				{#if succesPasswordForm && !errorPasswordForm}
					<div class="text-success flex gap-2 items-center mt-2">
						<Fa icon={faCheckCircle} />
						<span>Wachtwoord succesvol bijgewerkt</span>
					</div>
				{/if}
			</div>
			{#if errorPasswordForm}
				<div class="text-error flex gap-2 items-center mt-2">
					<Fa icon={faExclamationTriangle} />
					{errorPasswordForm}
				</div>
			{/if}
		</form>
	</div>
</div>
