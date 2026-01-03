<script lang="ts">
	import { browser } from "$app/environment"
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import { page } from "$app/stores"
	import DeleteAccountTab from "$components/profile/DeleteAccountTab.svelte"
	import InvoiceDetailsTab from "$components/profile/InvoiceDetailsTab.svelte"
	import PersonalDetailsTab from "$components/profile/PersonalDetailsTab.svelte"
	import SecurityTab from "$components/profile/SecurityTab.svelte"
	import { TAB_TYPES, type TabType } from "$components/profile/TabType"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import type { Page } from "@sveltejs/kit"

	let deletedProfile = false
	$: currentTab = getTabFromUrl($page)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function getTabFromUrl(_: Page): TabType {
		if (browser) {
			const tab = $page.url.searchParams.get("tab")
			if (tab && TAB_TYPES.includes(tab as TabType)) return tab as TabType
		}
		return "personal"
	}
	function setTab(tab: TabType) {
		goto(`?tab=${tab}`, { replaceState: true, keepFocus: true })
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Profiel")
	// -- Authguard --
	$: if ($authStore === null && !deletedProfile) goto(resolve("/"))
</script>

<div class="max-w-4xl mx-auto p-3 sm:p-6">
	<h1 class="text-3xl font-bold mb-3">Profiel</h1>
	<div class="tabs tabs-lift">
		<PersonalDetailsTab checked={currentTab == "personal"} {setTab} />
		<SecurityTab checked={currentTab == "security"} {setTab} />
		<InvoiceDetailsTab checked={currentTab == "invoice"} {setTab} />
		<DeleteAccountTab
			checked={currentTab == "delete"}
			{setTab}
			bind:deletedProfile
		/>
	</div>
</div>
