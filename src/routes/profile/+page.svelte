<script lang="ts">
	import { goto } from "$app/navigation"
	import DeleteAccountTab from "$components/profile/DeleteAccountTab.svelte"
	import InvoiceDetailsTab from "$components/profile/InvoiceDetailsTab.svelte"
	import PersonalDetailsTab from "$components/profile/PersonalDetailsTab.svelte"
	import SecurityTab from "$components/profile/SecurityTab.svelte"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"

	// -- Page title --
	pageHeadStore.updatePageTitle("Profiel")
	// -- Authguard --
	$: if ($authStore === null) goto("/")
</script>

<div class="max-w-4xl mx-auto p-6">
	<h1 class="text-3xl font-bold mb-3">Profiel</h1>
	<div class="tabs tabs-lift">
		<PersonalDetailsTab />
		<SecurityTab />
		<InvoiceDetailsTab />
		<DeleteAccountTab />
	</div>
</div>
