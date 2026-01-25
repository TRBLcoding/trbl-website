<script lang="ts">
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import type { User } from "$lib/domain/User"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { faUserPen } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	// -- Page title --
	pageHeadStore.updatePageTitle("Dashboard")
	// -- Authguard --
	$: if ($authStore === null || ($authStore && !($authStore as User).isAdmin()))
		goto(resolve("/"))
</script>

<div class="mx-6 mt-3">
	<h1 class="text-2xl font-bold mb-2">Dashboard</h1>

	<div class="flex items-center gap-2 mb-2">
		<Fa icon={faUserPen} class="w-6 h-6" />
		<h2 class="text-xl font-bold">Aanpassigen</h2>
	</div>

	<div class="flex gap-2 flex-wrap">
		<a href={resolve("/products/new")} class="btn btn-primary normal-case">
			Nieuw product
		</a>
		<a
			href={resolve("/product-groups/new")}
			class="btn btn-primary normal-case"
		>
			Nieuwe product groep
		</a>
		<a
			href={resolve("/privacy-policy/send-update")}
			class="btn btn-primary normal-case"
		>
			Update privacybeleid
		</a>
	</div>
</div>
