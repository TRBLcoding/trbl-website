<script lang="ts">
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import ProductGroupForm from "$components/product-group/ProductGroupForm.svelte"
	import type { User } from "$lib/domain/User"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"

	// -- Page title --
	pageHeadStore.updatePageTitle("Productgroep aanmaken")
	// -- Authguard --
	$: if ($authStore === null || ($authStore && !($authStore as User).isAdmin()))
		goto(resolve("/"))
</script>

<div class="mx-6 mt-3 mb-8">
	<div class="flex flex-row gap-3 items-center mb-1">
		<h1 class="text-2xl font-bold">Productgroep aanmaken</h1>
		<button class="btn btn-primary btn-sm normal-case"> Toon preview </button>
	</div>

	<ProductGroupForm></ProductGroupForm>
</div>
