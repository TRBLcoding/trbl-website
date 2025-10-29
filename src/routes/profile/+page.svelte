<script lang="ts">
	import { goto } from "$app/navigation"
	import { page } from "$app/stores"
	import DeleteAccountTab from "$components/profile/DeleteAccountTab.svelte"
	import InvoiceDetailsTab from "$components/profile/InvoiceDetailsTab.svelte"
	import PersonalDetailsTab from "$components/profile/PersonalDetailsTab.svelte"
	import SecurityTab from "$components/profile/SecurityTab.svelte"
	import type { TabType } from "$components/profile/TabType"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"

	let deletedProfile = false
	$: currentTab = ($page.url.searchParams.get("tab") || "personal") as TabType
	function setTab(tab: TabType) {
		goto(`?tab=${tab}`, { replaceState: true, keepFocus: true })
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Profiel")
	// -- Authguard --
	$: if ($authStore === null && !deletedProfile) goto("/")
</script>

<div class="max-w-4xl mx-auto p-6">
	<h1 class="text-3xl font-bold mb-3">Profiel</h1>
	<div class="tabs tabs-lift">
		<PersonalDetailsTab checked={currentTab == "personal"} {setTab} />
		<SecurityTab checked={currentTab == "security"} {setTab} />
		<InvoiceDetailsTab checked={currentTab == "invoice"} {setTab} />
		<DeleteAccountTab checked={currentTab == "delete"} {setTab} bind:deletedProfile />
	</div>
</div>
