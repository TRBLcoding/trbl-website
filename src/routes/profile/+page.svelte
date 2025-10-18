<script lang="ts">
	import { goto } from "$app/navigation"
	import InvoiceDetailsComponent from "$components/invoice/InvoiceDetailsComponent.svelte"
	import type { InvoiceDetails } from "$lib/domain/InvoiceDetails"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import {
		faFileInvoice,
		faShield,
		faTrash,
		faTrashAlt,
		faTrashCan,
		faUser,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	// -- Page title --
	pageHeadStore.updatePageTitle("Profiel")
	// -- Authguard --
	$: if ($authStore === null) goto("/")

	// Active section state
	let activeSection: "personal" | "security" | "address" | "danger" = "personal"

	// Form states
	let firstName = ""
	let lastName = ""
	let email = ""
	let currentPassword = ""
	let newPassword = ""
	let confirmPassword = ""
	let street = ""
	let houseNumber = ""
	let city = ""
	let postalCode = ""
	let country = ""

	let invoiceFormElement: HTMLFormElement
	let selectedInvoiceDetails: InvoiceDetails
</script>

<div class="max-w-4xl mx-auto p-6">
	<h1 class="text-3xl font-bold mb-3">Profiel</h1>

	<div class="tabs tabs-lift">
		<!-- Personal details -->
		<label class="tab [--tab-bg:var(--color-base-200)]">
			<input type="radio" name="profile-tabs" />
			<Fa icon={faUser} class="me-2" />
			Persoonlijke gegevens
		</label>
		<div class="tab-content bg-base-200 border-base-300 p-6">Tab content 1</div>

		<!-- Security -->
		<label class="tab [--tab-bg:var(--color-base-200)]">
			<input type="radio" name="profile-tabs" />
			<Fa icon={faShield} class="me-2" />
			Beveiliging
		</label>
		<div class="tab-content bg-base-200 border-base-300 p-6">Tab content 2</div>

		<!-- Invoice details -->
		<label class="tab [--tab-bg:var(--color-base-200)]">
			<input type="radio" name="profile-tabs" checked={true} />
			<Fa icon={faFileInvoice} class="me-2" />
			Factuurgegevens
		</label>
		<div class="tab-content bg-base-200 border-base-300 p-6">
			Hier kunt u uw factuurgegevens bekijken en bijwerken.
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
			<h2 class="text-xl font-semibold text-error mb-4">Gevarenzone</h2>
			<p class="opacity-90 mb-6">
				Door je account te verwijderen, worden al je gegevens permanent
				verwijderd. Deze actie kan niet ongedaan worden gemaakt.
			</p>
			<button class="btn btn-primary">Account permanent verwijderen</button>
		</div>
	</div>

	<!-- Navigation Tabs -->
	<div class="border-b border-gray-200 mb-6">
		<nav class="flex gap-4">
			<button
				class="px-4 py-2 border-b-2 transition-colors {activeSection ===
				'personal'
					? 'border-blue-600 text-blue-600'
					: 'border-transparent text-gray-600 hover:text-gray-900'}"
				on:click={() => (activeSection = "personal")}
			>
				Persoonlijke gegevens
			</button>
			<button
				class="px-4 py-2 border-b-2 transition-colors {activeSection ===
				'security'
					? 'border-blue-600 text-blue-600'
					: 'border-transparent text-gray-600 hover:text-gray-900'}"
				on:click={() => (activeSection = "security")}
			>
				Beveiliging
			</button>
			<button
				class="px-4 py-2 border-b-2 transition-colors {activeSection ===
				'address'
					? 'border-blue-600 text-blue-600'
					: 'border-transparent text-gray-600 hover:text-gray-900'}"
				on:click={() => (activeSection = "address")}
			>
				Bezorgadres
			</button>
			<button
				class="px-4 py-2 border-b-2 transition-colors {activeSection ===
				'danger'
					? 'border-red-600 text-red-600'
					: 'border-transparent text-gray-600 hover:text-gray-900'}"
				on:click={() => (activeSection = "danger")}
			>
				Account verwijderen
			</button>
		</nav>
	</div>

	<!-- Personal Information Section -->
	{#if activeSection === "personal"}
		<div class="bg-white rounded-lg shadow p-6">
			<h2 class="text-xl font-semibold mb-4">Persoonlijke gegevens</h2>
			<form class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label
							for="firstName"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Voornaam
						</label>
						<input
							id="firstName"
							type="text"
							bind:value={firstName}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Voornaam"
						/>
					</div>
					<div>
						<label
							for="lastName"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Achternaam
						</label>
						<input
							id="lastName"
							type="text"
							bind:value={lastName}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Achternaam"
						/>
					</div>
				</div>
				<button
					type="submit"
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
				>
					Wijzigingen opslaan
				</button>
			</form>
		</div>
	{/if}

	<!-- Security Section -->
	{#if activeSection === "security"}
		<div class="space-y-6">
			<!-- Change Email -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">E-mailadres wijzigen</h2>
				<form class="space-y-4">
					<div>
						<label
							for="email"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Nieuw e-mailadres
						</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="nieuw@email.com"
						/>
					</div>
					<button
						type="submit"
						class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					>
						E-mailadres wijzigen
					</button>
				</form>
			</div>

			<!-- Change Password -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Wachtwoord wijzigen</h2>
				<form class="space-y-4">
					<div>
						<label
							for="currentPassword"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Huidig wachtwoord
						</label>
						<input
							id="currentPassword"
							type="password"
							bind:value={currentPassword}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
						/>
					</div>
					<div>
						<label
							for="newPassword"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Nieuw wachtwoord
						</label>
						<input
							id="newPassword"
							type="password"
							bind:value={newPassword}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
						/>
					</div>
					<div>
						<label
							for="confirmPassword"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Bevestig nieuw wachtwoord
						</label>
						<input
							id="confirmPassword"
							type="password"
							bind:value={confirmPassword}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
						/>
					</div>
					<button
						type="submit"
						class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					>
						Wachtwoord wijzigen
					</button>
				</form>
			</div>
		</div>
	{/if}

	<!-- Address Section -->
	{#if activeSection === "address"}
		<div class="bg-white rounded-lg shadow p-6">
			<h2 class="text-xl font-semibold mb-4">Bezorgadres</h2>
			<form class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="md:col-span-2">
						<label
							for="street"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Straatnaam
						</label>
						<input
							id="street"
							type="text"
							bind:value={street}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Straatnaam"
						/>
					</div>
					<div>
						<label
							for="houseNumber"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Huisnummer
						</label>
						<input
							id="houseNumber"
							type="text"
							bind:value={houseNumber}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="123"
						/>
					</div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label
							for="postalCode"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Postcode
						</label>
						<input
							id="postalCode"
							type="text"
							bind:value={postalCode}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="1234 AB"
						/>
					</div>
					<div>
						<label
							for="city"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Plaats
						</label>
						<input
							id="city"
							type="text"
							bind:value={city}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Amsterdam"
						/>
					</div>
				</div>
				<div>
					<label
						for="country"
						class="block text-sm font-medium text-gray-700 mb-1"
					>
						Land
					</label>
					<input
						id="country"
						type="text"
						bind:value={country}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Nederland"
					/>
				</div>
				<button
					type="submit"
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
				>
					Adres opslaan
				</button>
			</form>
		</div>
	{/if}

	<!-- Danger Zone Section -->
	{#if activeSection === "danger"}
		<div class="bg-red-50 border border-red-200 rounded-lg shadow p-6">
			<h2 class="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
			<p class="text-gray-700 mb-4">
				Door je account te verwijderen, worden al je gegevens permanent
				verwijderd. Deze actie kan niet ongedaan worden gemaakt.
			</p>
			<button
				class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
			>
				Account permanent verwijderen
			</button>
		</div>
	{/if}
</div>
