<script lang="ts">
	import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
</script>

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
