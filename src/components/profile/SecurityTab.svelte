<script lang="ts">
	import Input from "$components/formHelpers/Input.svelte"
	import { authStore } from "$lib/stores/AuthStore"
	import { faShield } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	let newPassword = ""
	let confirmPassword = ""
	let newEmail = ""
</script>

<!-- Security -->
<label class="tab [--tab-bg:var(--color-base-200)]">
	<input type="radio" name="profile-tabs" checked={true} />
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
