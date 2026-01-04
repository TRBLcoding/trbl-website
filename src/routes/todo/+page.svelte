<script lang="ts">
	import { resolve } from "$app/paths"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"

	// -- Page title --
	pageHeadStore.updatePageTitle("Todo")
</script>

<div class="min-h-[60vh] flex flex-col items-center justify-center px-4">
	<div class="max-w-2xl mx-auto text-center space-y-6">
		<!-- Construction Icon -->
		<div class="text-6xl mb-4">🚧</div>

		<!-- Main Heading -->
		<h1 class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
			Deze pagina is in ontwikkeling
		</h1>

		<!-- Subtitle -->
		<p class="text-xl text-gray-600 dark:text-gray-300">
			We werken hard aan iets geweldigs!
		</p>

		<!-- Description -->
		<div class="card shadow-lg bg-base-200">
			<div class="card-body">
				<p>
					Wij zijn momenteel nog bezig met het bouwen van deze pagina. Kom
					binnenkort terug voor nieuwe functionaliteit en verbeteringen.
				</p>
			</div>
		</div>

		<!-- Back Button -->
		<div class="mt-8">
			<a href={resolve("/")} class="btn btn-primary"> ← Terug naar home </a>
		</div>
	</div>
</div>
