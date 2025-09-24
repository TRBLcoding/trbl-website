<script lang="ts">
	import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
</script>

<div class="max-w-lg">
	<div class="text-xl font-semibold mb-1 flex items-center gap-2">
		<Fa icon={faEnvelope} class="" />
		Stuur een bericht
	</div>
	<div class="flex gap-6">
		<fieldset class="fieldset text-[15px] w-full">
			<legend class="fieldset-legend">Voornaam</legend>
			<input type="text" class="input" placeholder="Voornaam" />
		</fieldset>
		<fieldset class="fieldset text-[15px] w-full">
			<legend class="fieldset-legend">Achternaam</legend>
			<input type="text" class="input" placeholder="Achternaam" />
		</fieldset>
	</div>
	<fieldset class="fieldset text-[15px]">
		<legend class="fieldset-legend">Email</legend>
		<input type="email" class="input w-full" placeholder="Email" />
	</fieldset>
	<fieldset class="fieldset text-[15px]">
		<legend class="fieldset-legend">Onderwerp</legend>
		<input type="text" class="input w-full" placeholder="Onderwerp" />
	</fieldset>
	<fieldset class="fieldset text-[15px]">
		<legend class="fieldset-legend">Boodschap</legend>
		<textarea class="input w-full h-30" placeholder="Boodschap"></textarea>
	</fieldset>
	<button type="submit" class="btn btn-primary mt-3">Verstuur bericht</button>
</div>
