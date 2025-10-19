<script lang="ts">
	import { goto } from "$app/navigation"
	import Input from "$components/formHelpers/Input.svelte"
	import InvoiceDetailsComponent from "$components/invoice/InvoiceDetailsComponent.svelte"
	import type { InvoiceDetails } from "$lib/domain/InvoiceDetails"
	import type { User } from "$lib/domain/User"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import {
		faCheckCircle,
		faExclamationTriangle,
		faFileInvoice,
		faShield,
		faTrashCan,
		faUser,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	// Form values
	let firstName = ""
	let lastName = ""
	let newPassword = ""
	let confirmPassword = ""

	let invoiceFormElement: HTMLFormElement
	let selectedInvoiceDetails: InvoiceDetails

	let initialized = false
	function initPage(user: User) {
		firstName = user.firstName
		lastName = user.lastName
		initialized = true
	}
	$: if (!initialized && $authStore) initPage($authStore)

	let loading1 = false
	let error = ""
	let succes = false
	async function updateProfile() {
		loading1 = true
		succes = false
		try {
			await authStore.updateProfile(firstName, lastName)
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
		loading1 = false
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Profiel")
	// -- Authguard --
	$: if ($authStore === null) goto("/")
</script>

<div class="max-w-4xl mx-auto p-6">
	<h1 class="text-3xl font-bold mb-3">Profiel</h1>

	<div class="tabs tabs-lift">
		<!-- Personal details -->
		<label class="tab [--tab-bg:var(--color-base-200)]">
			<input type="radio" name="profile-tabs" checked={true} />
			<Fa icon={faUser} class="me-2" />
			Persoonlijke gegevens
		</label>
		<div class="tab-content bg-base-200 border-base-300 p-6">
			<div class="flex gap-2 items-baseline">
				<h2 class="text-xl font-semibold mb-4">Persoonlijke gegevens</h2>
				{#if $authStore?.isAdmin()}
					<div class="badge badge-primary text-base-100 font-semibold">
						Admin
					</div>
				{/if}
			</div>

			<form
				class="flex flex-col gap-4"
				on:submit|preventDefault={updateProfile}
			>
				<div class="flex flex-col sm:flex-row gap-2">
					{#if initialized && true}
						<Input
							type="text"
							label="Voornaam"
							placeholder="Voornaam"
							bind:value={firstName}
							size="full"
							required
							autocomplete="given-name"
						/>
						<Input
							type="text"
							label="Achternaam"
							placeholder="Achternaam"
							bind:value={lastName}
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
						disabled={loading1}
					>
						Gegevens wijzigen
						<span class="loading loading-ring" class:hidden={!loading1}></span>
					</button>
					{#if succes && !error}
						<div class="text-success flex gap-2 items-center mt-2">
							<Fa icon={faCheckCircle} />
							<span> Gegevens succesvol bijgewerkt </span>
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

		<!-- Security -->
		<label class="tab [--tab-bg:var(--color-base-200)]">
			<input type="radio" name="profile-tabs" />
			<Fa icon={faShield} class="me-2" />
			Beveiliging
		</label>
		<div class="tab-content bg-base-200 border-base-300 p-6">
			<h2 class="text-xl font-semibold mb-3">Beveiliging</h2>

			<!-- Change Email -->
			<div class="">
				<h3 class="text-lg font-semibold mb-2">E-mailadres wijzigen</h3>
				<form class="flex flex-col gap-4">
					<Input
						type="text"
						label="Huidig e-mailadres"
						value={"lorin.speybrouck@proximus.be"}
						size="full"
						disabled
					/>
					<Input
						type="text"
						label="Nieuw e-mailadres"
						placeholder="Nieuw e-mailadres"
						bind:value={lastName}
						size="full"
						required
						autocomplete="email"
					/>
					<button type="submit" class="btn btn-primary sm:self-start">
						E-mailadres wijzigen
					</button>
				</form>
			</div>

			<!-- Change Password -->
			<div class="mt-6">
				<h3 class="text-lg font-semibold mb-2">Wachtwoord wijzigen</h3>
				<form class="flex flex-col gap-4">
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
					<button type="submit" class="btn btn-primary sm:self-start">
						Wachtwoord wijzigen
					</button>
				</form>
			</div>
		</div>

		<!-- Invoice details -->
		<label class="tab [--tab-bg:var(--color-base-200)]">
			<input type="radio" name="profile-tabs" />
			<Fa icon={faFileInvoice} class="me-2" />
			Factuurgegevens
		</label>
		<div class="tab-content bg-base-200 border-base-300 p-6">
			<div class="mb-3">
				<h2 class="text-xl font-semibold">Factuurgegevens</h2>
				<span class="opacity-80"
					>Hier kunt u uw factuurgegevens bekijken en bijwerken</span
				>
			</div>

			<InvoiceDetailsComponent
				bind:invoiceFormElement
				bind:selectedInvoiceDetails
			></InvoiceDetailsComponent>
		</div>

		<!-- Delete account -->
		<label class="tab [--tab-bg:var(--color-base-200)]">
			<input type="radio" name="profile-tabs" />
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
				<button class="btn btn-primary sm:self-start mt-2"
					>Account permanent verwijderen</button
				>
			</div>
		</div>
	</div>
</div>
