<script lang="ts">
	import Input from "$components/formHelpers/Input.svelte"
	import Select from "$components/formHelpers/Select.svelte"
	import { sleep } from "$lib/utils/Utils"
	import {
		faBorderNone,
		faExclamationTriangle,
		faPlus,
		faXmark,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import { slide } from "svelte/transition"

	let firstName = ""
	let lastName = ""
	let emailAddress = ""
	let phoneNumber = ""
	let todo = ""

	let showForm = true
	let saving = false
	let errorMessage = ""

	async function onSubmitWrapper() {
		saving = true
		errorMessage = ""
		try {
			await sleep(1000)
			showForm = false
		} catch (error) {
			errorMessage = "Unknown error occured"
		}
		saving = false
	}
</script>

<div class="flex flex-col gap-1 max-w-sm">
	<h2 class="text-lg font-semibold pb-1 border-b border-base-300 mb-1">
		Factuurgegevens
	</h2>
	<div class="p-4 bg-base-200 rounded-lg mb-2">
		<div class="flex flex-col gap-4 my-2 items-center">
			<Fa icon={faBorderNone} size="2x" />
			<span>Geen opgeslagen factuurgegevens</span>
		</div>
		<button
			class="btn btn-ghost"
			type="button"
			on:click={() => (showForm = true)}
		>
			<Fa icon={faPlus} />
			Factuurgegevens toevoegen
		</button>
	</div>
	{#if showForm}
		<div
			class="p-4 bg-base-200 rounded-lg relative"
			transition:slide={{ duration: 300 }}
		>
			<button
				type="button"
				class="btn btn-sm btn-square btn-ghost absolute right-3 top-3-"
				on:click={() => (showForm = false)}
			>
				<Fa icon={faXmark} />
			</button>
			<form class="flex flex-col gap-1" on:submit|preventDefault={onSubmitWrapper}>
				<h3 class="font-semibold mb-2">Nieuwe factuurgegevens</h3>
				<Input
					type="text"
					label="Voornaam"
					placeholder="Voornaam"
					bind:value={firstName}
					required
				/>
				<Input
					type="text"
					label="Achternaam"
					placeholder="Achternaam"
					bind:value={lastName}
					required
				/>
				<Input
					type="email"
					label="Emailadres"
					placeholder="Emailadres"
					bind:value={emailAddress}
				/>
				<Input
					type="text"
					label="Telefoonnummer"
					placeholder="Telefoonnummer"
					bind:value={phoneNumber}
				/>

				<Input
					type="text"
					label="Bedrijfsnaam (Optioneel)"
					placeholder="Bedrijfsnaam"
					bind:value={todo}
				/>
				<Input
					type="text"
					label="BTW-nummer (Optioneel)"
					placeholder="BTW nummer"
					bind:value={todo}
				/>
				<Select label="Land" bind:value={todo}>
					<option>Belgie</option>
					<option>Nederland</option>
				</Select>
				<Input
					type="text"
					label="Straatnaam huisnummer"
					placeholder="Straatnaam huisnummer"
					bind:value={todo}
				/>
				<Input
					type="text"
					label="Postcode"
					placeholder="Postcode"
					bind:value={todo}
				/>
				<Input
					type="text"
					label="Plaats"
					placeholder="Plaats"
					bind:value={todo}
				/>
				<button
					class="btn btn-primary mt-4 mb-1"
					type="submit"
					disabled={saving}
				>
					Factuurgegevens opslagen
					<span class="loading loading-ring" class:hidden={!saving}></span>
				</button>
				{#if errorMessage}
					<div class="text-error flex gap-2 items-center">
						<Fa icon={faExclamationTriangle} />
						{errorMessage}
					</div>
				{/if}
			</form>
		</div>
	{/if}
</div>
